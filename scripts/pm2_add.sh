#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

#set repo dir as working dir
cd "$SCRIPT_DIR" 
cd ..

PORT=8765  ORIGIN=http://pivideo:8765   pm2 start node --name video-manager -- build


pm2 startup
pm2 save --force
pm2 status
