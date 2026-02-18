// src/code.ts
var STORAGE_TOKEN_KEY = "arena-access-token";
var STORAGE_SLUG_KEY = "arena-user-slug";
var STORAGE_GROUPS_KEY = "arena-saved-groups";
var PLUGIN_DATA_KEY = "arena-imported-blocks";
var GRID_COLUMNS = 4;
var GRID_SPACING = 40;
var DEFAULT_IMAGE_SIZE = 400;
var ARENA_BASE = "https://api.are.na/v3";
figma.showUI(__html__, { width: 420, height: 620, themeColors: true });
function getImportedBlockIds() {
  const raw = figma.root.getPluginData(PLUGIN_DATA_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (_e) {
    return [];
  }
}
function addImportedBlockId(blockId) {
  const ids = getImportedBlockIds();
  if (!ids.includes(blockId)) {
    ids.push(blockId);
  }
  figma.root.setPluginData(PLUGIN_DATA_KEY, JSON.stringify(ids));
  return ids;
}
function sendImportedIds() {
  const ids = getImportedBlockIds();
  figma.ui.postMessage({ type: "imported-ids", ids });
}
async function arenaFetch(path, token) {
  let url = ARENA_BASE + path;
  const headers = {};
  if (token) {
    const sep = url.indexOf("?") >= 0 ? "&" : "?";
    url = url + sep + "access_token=" + encodeURIComponent(token);
    headers["Authorization"] = "Bearer " + token;
  }
  console.log("[arena] sandbox fetch:", url.replace(/access_token=[^&]+/, "access_token=***"), "auth:", !!token);
  const res = await fetch(url, { method: "GET", headers });
  console.log("[arena] sandbox status:", res.status, res.statusText);
  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch (_e) {
    }
    console.error("[arena] sandbox error body:", body);
    throw new Error("HTTP " + res.status + (body ? ": " + body : ""));
  }
  return res.json();
}
async function init() {
  const token = await figma.clientStorage.getAsync(STORAGE_TOKEN_KEY);
  const slug = await figma.clientStorage.getAsync(STORAGE_SLUG_KEY);
  const savedGroups = await figma.clientStorage.getAsync(STORAGE_GROUPS_KEY);
  figma.ui.postMessage({
    type: "init",
    token: token || null,
    slug: slug || null,
    savedGroups: savedGroups || []
  });
  sendImportedIds();
}
init();
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case "save-token": {
      await figma.clientStorage.setAsync(STORAGE_TOKEN_KEY, msg.token);
      await figma.clientStorage.setAsync(STORAGE_SLUG_KEY, msg.slug);
      figma.ui.postMessage({ type: "token-saved" });
      break;
    }
    case "clear-token": {
      await figma.clientStorage.deleteAsync(STORAGE_TOKEN_KEY);
      await figma.clientStorage.deleteAsync(STORAGE_SLUG_KEY);
      figma.ui.postMessage({ type: "token-cleared" });
      break;
    }
    case "save-groups": {
      await figma.clientStorage.setAsync(STORAGE_GROUPS_KEY, msg.groups);
      break;
    }
    case "get-imported-ids": {
      sendImportedIds();
      break;
    }
    // ── API relay: UI asks code.ts to fetch from Are.na ─────────────
    case "arena-fetch": {
      const requestId = msg.requestId;
      const path = msg.path;
      const useAuth = msg.useAuth;
      const token = msg.token || null;
      try {
        const data = await arenaFetch(path, useAuth ? token : null);
        figma.ui.postMessage({
          type: "arena-fetch-response",
          requestId,
          data,
          error: null
        });
      } catch (err) {
        figma.ui.postMessage({
          type: "arena-fetch-response",
          requestId,
          data: null,
          error: err.message || String(err)
        });
      }
      break;
    }
    case "import-images": {
      const images = msg.images;
      if (!images || images.length === 0) {
        figma.notify("No images to import.");
        return;
      }
      figma.notify(`Importing ${images.length} image${images.length > 1 ? "s" : ""}...`);
      const viewport = figma.viewport.center;
      let startX = viewport.x - GRID_COLUMNS * (DEFAULT_IMAGE_SIZE + GRID_SPACING) / 2;
      let startY = viewport.y - 200;
      let col = 0;
      let row = 0;
      let maxRowHeight = 0;
      const importedNodes = [];
      for (const img of images) {
        try {
          const image = await figma.createImageAsync(img.url);
          const { width, height } = await image.getSizeAsync();
          const scale = DEFAULT_IMAGE_SIZE / Math.max(width, height);
          const scaledW = Math.round(width * scale);
          const scaledH = Math.round(height * scale);
          const rect = figma.createRectangle();
          rect.resize(scaledW, scaledH);
          rect.x = startX + col * (DEFAULT_IMAGE_SIZE + GRID_SPACING);
          rect.y = startY + row * (DEFAULT_IMAGE_SIZE + GRID_SPACING);
          rect.name = img.title || "Are.na Image";
          rect.fills = [
            {
              type: "IMAGE",
              imageHash: image.hash,
              scaleMode: "FILL"
            }
          ];
          figma.currentPage.appendChild(rect);
          importedNodes.push(rect);
          if (scaledH > maxRowHeight) maxRowHeight = scaledH;
          col++;
          if (col >= GRID_COLUMNS) {
            col = 0;
            row++;
            maxRowHeight = 0;
          }
          const updatedIds = addImportedBlockId(String(img.blockId));
          figma.ui.postMessage({ type: "imported-ids", ids: updatedIds });
        } catch (err) {
          console.error(`Failed to import block ${img.blockId}:`, err);
          figma.notify(`Failed to import "${img.title}": ${err.message || err}`, { error: true });
        }
      }
      if (importedNodes.length > 0) {
        figma.currentPage.selection = importedNodes;
        figma.viewport.scrollAndZoomIntoView(importedNodes);
        figma.notify(`Imported ${importedNodes.length} image${importedNodes.length > 1 ? "s" : ""}.`);
      }
      figma.ui.postMessage({ type: "import-complete", count: importedNodes.length });
      break;
    }
    case "resize": {
      figma.ui.resize(msg.width, msg.height);
      break;
    }
    default:
      break;
  }
};
