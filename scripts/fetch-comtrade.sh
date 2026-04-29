#!/usr/bin/env bash
# Fetch raw UN Comtrade JSON for UZ↔US bilateral HS-6 trade.
# Usage:
#   scripts/fetch-comtrade.sh
# Outputs: input/comtrade/r{reporter}_p{partner}_{flow}_{year}.json
# Requires: curl (no API key needed — public preview tier).
#
# After this completes, run:
#   node scripts/build-comtrade.mjs
# to regenerate data/comtrade.ts.

set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)/input/comtrade"
mkdir -p "$DIR"
cd "$DIR"

YEARS=(2021 2022 2023 2024 2025)
PAIRS=("860 842" "842 860")
FLOWS=(X M)
BASE="https://comtradeapi.un.org/public/v1/preview/C/A/HS"

# Fetch HS-6 reference once
if [ ! -f hs6_ref.json ]; then
  echo "Pulling HS-6 reference..."
  curl -s "https://comtradeapi.un.org/files/v1/app/reference/H6.json" -o hs6_ref.json
fi

for year in "${YEARS[@]}"; do
  for flow in "${FLOWS[@]}"; do
    for pair in "${PAIRS[@]}"; do
      set -- $pair
      r=$1; p=$2
      out="r${r}_p${p}_${flow}_${year}.json"
      if [ ! -s "$out" ] || [ "$(wc -c < "$out")" -lt 1000 ]; then
        echo "Fetching $out..."
        curl -s "${BASE}?reporterCode=${r}&partnerCode=${p}&period=${year}&cmdCode=AG6&flowCode=${flow}" -o "$out"
        sleep 2
      fi
    done
  done
done

echo "Done. ${#YEARS[@]} years × ${#FLOWS[@]} flows × ${#PAIRS[@]} reporter combos."
ls -la *.json
