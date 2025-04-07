#!/usr/bin/env bash
# Usage: ./wait-for-it.sh host:port -t timeout -- command-to-run

host_port=($1)
shift
timeout=30
cmd="$@"

IFS=":" read -r host port <<< "$host_port"

echo "⏳ Waiting for $host:$port..."

for ((i=0;i<timeout;i++)); do
  nc -z "$host" "$port" && echo "✅ $host:$port is up!" && exec $cmd
  sleep 1
done

echo "❌ Timeout reached. $host:$port not reachable."
exit 1