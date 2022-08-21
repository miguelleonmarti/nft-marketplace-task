#!/usr/bin/env bash
npx hardhat typechain
[ -d ../frontend ]  && mkdir ../frontend/lib && cp -r typechain-types ../frontend/lib/typechain-types \
  && echo "Copied typechain types to frontend"