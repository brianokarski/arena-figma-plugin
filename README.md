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

### Option A: Download directly

1. [Download the latest ZIP](https://github.com/brianokarski/arena-figma-plugin/archive/refs/heads/main.zip) and unzip it.
2. Open a terminal in the unzipped folder and run:

```
npm install
npm run build
```

### Option B: Clone via terminal

```
git clone https://github.com/brianokarski/arena-figma-plugin.git
cd arena-figma-plugin
npm install
npm run build
```

### Then

1. In Figma, go to **Plugins → Development → Import plugin from manifest** and select the `manifest.json` file from the folder.

2. Generate a personal access token at [are.na/settings/personal-access-tokens](https://are.na/settings/personal-access-tokens).

3. Open the plugin, enter your Are.na username (the slug from your profile URL) and paste your token.