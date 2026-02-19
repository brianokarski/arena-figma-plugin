# Are.na Browser for Figma

![Are.na Browser Plugin](preview.png)

A Figma plugin for browsing your Are.na channels and groups, importing images individually or in batch, with visual tracking of what's already been imported.

## Features

- **Browse your channels** — connects to the Are.na API using your personal access token
- **Group support** — enter a group slug to browse group channels, with saved groups for quick access
- **Batch import** — select multiple images and import them all at once, laid out in a grid on your canvas
- **Import tracking** — imported images are marked at 50% opacity so you can see what's already been brought in (tracked per document)
- **Sorted by recent** — channels and images are sorted by most recently updated

## Setup

1. [Download the ZIP](https://github.com/brianokarski/arena-figma-plugin/archive/refs/heads/main.zip) and unzip it (or `git clone` this repo).

2. In Figma, go to **Plugins → Development → Import plugin from manifest** and select the `manifest.json` file from the folder.

3. Generate a personal access token at [are.na/settings/personal-access-tokens](https://are.na/settings/personal-access-tokens).

4. Open the plugin, enter your Are.na username (the slug from your profile URL) and paste your token.

## Changelog

### v1.1.0

- **Refresh button** — re-fetches the latest images from the Are.na channel and re-checks the Figma board for what's already been imported. One button to fully sync between Are.na and Figma.
- **"Select new" button** — selects only images that haven't been imported yet, skipping anything already on the board.
- **Shift-click range selection** — click one image, then shift-click another to select everything in between.
- **Improved controls bar** — tighter layout with consistent sizing; selection count appears in its own row to avoid breaking the UI.

### v1.0.0

- Initial release. Browse channels, group support, batch import, import tracking.