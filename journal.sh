#!/bin/bash

sudo journalctl -qfu backfill.fg.bsky.service -u server.fg.bsky.service
