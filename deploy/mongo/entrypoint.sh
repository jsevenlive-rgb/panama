#!/bin/bash
set -e

HOST="${RAILWAY_PRIVATE_DOMAIN:-localhost}:27017"

if [ "$(id -u)" = "0" ]; then
  chown -R mongodb:mongodb /data/db
  gosu mongodb mongod --replSet rs0 --bind_ip_all --ipv6 --dbpath /data/db &
else
  mongod --replSet rs0 --bind_ip_all --ipv6 --dbpath /data/db &
fi
MONGOD_PID=$!

until mongosh --quiet --eval 'db.adminCommand({ ping: 1 })' >/dev/null 2>&1; do
  sleep 1
done

mongosh --quiet --eval "
try {
  rs.status();
} catch (e) {
  rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '${HOST}' }] });
}
"

wait "$MONGOD_PID"
