#!/bin/sh
set -e

sleep 5

curl -s -X POST -u root:rootpassword  \
  --header 'Content-Type: application/json' \
  --data '{"name":"Nabu"}' \
  http://DB_arango:8529/_api/database >/dev/null 2>&1

echo "ArangoDB is initialized."

