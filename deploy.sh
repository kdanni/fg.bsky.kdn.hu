#!/bin/bash

git pull

# npm run dbinstall

sudo systemctl restart server.fg.bsky.service
sudo systemctl restart jetstream.fg.bsky.service

sudo journalctl -qfu backfill.fg.bsky.service -u server.fg.bsky.service -u jetstream.fg.bsky.service -u actor-backfill.fg.bsky.service -u fav-backfill.fg.bsky.service
