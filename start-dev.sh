#!/bin/bash
# Load environment variables from .env file properly
set -a  # automatically export all variables
source .env
set +a  # stop automatically exporting

# Start Next.js with the PORT from .env (only if PORT is set)
if [ -n "$PORT" ]; then
    next dev --turbopack --port $PORT
else
    next dev --turbopack
fi
