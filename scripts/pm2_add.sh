#!/bin/bash

pm2 start npm --name video-manager -- run preview -- --host
pm2 startup
pm2 save

pm2 status