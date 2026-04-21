#!/bin/bash
set -e

NGINX_SITE="ui"
APP_DIR="/var/www/$NGINX_SITE"
BUILD_DIR="dist"

if ! command -v node >/dev/null 2>&1; then
    echo "Node.js not found → installing..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "Node.js already installed: $(node -v)"
fi

sudo mkdir -p $APP_DIR
npm install
npm run build

sudo rm -rf $APP_DIR/*
sudo cp -r $BUILD_DIR/* $APP_DIR/

sudo chown -R www-data:www-data $APP_DIR

sudo cp $NGINX_SITE /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx
