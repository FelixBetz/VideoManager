#!/bin/bash

pm2 delete video-manager
pm2 save --force
pm2 status
