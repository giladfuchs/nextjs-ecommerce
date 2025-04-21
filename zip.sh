#!/bin/bash

## Go up one directory (from commerce to js)
#cd ..
#
## Remove old zip if it exists
#[ -f commerce.zip ] && rm commerce.zip && echo "✅ Removed old commerce.zip"
#
## Zip contents of commerce/, excluding node_modules, into commerce.zip
#zip -r commerce.zip commerce -x "commerce/node_modules/*" && echo "✅ Created new commerce.zip"


echo "[" > picsum_urls.json
for i in {1..100}; do
  url=$(curl -s -o /dev/null -w "%{redirect_url}" https://picsum.photos/300/500)
  echo "  \"$url\"" >> picsum_urls.json
  if [ "$i" -lt 100 ]; then
    echo "," >> picsum_urls.json
  fi
  sleep 10
done
echo "]" >> picsum_urls.json