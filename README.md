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