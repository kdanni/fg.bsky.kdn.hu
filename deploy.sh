#!/bin/bash

git pull

# npm run dbinstall

sudo systemctl restart server.fg.bsky.service
sudo systemctl restart backfill.fg.bsky.service

sudo journalctl -qfu backfill.fg.bsky.service -u server.fg.bsky.service
