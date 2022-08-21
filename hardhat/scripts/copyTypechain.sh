#!/usr/bin/env bash
npx hardhat typechain
[ -d ../frontend ] && cp -r typechain-types ../frontend/lib/typechain-types \
  && echo "Copied typechain types to frontend"