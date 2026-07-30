#!/usr/bin/env bash
# Exports the Zscaler root CA from macOS Keychain so Node/Convex can verify TLS
# through corporate SSL inspection.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/certs/zscaler-ca.pem"
mkdir -p "$ROOT/certs"

if ! security find-certificate -c "support@zscaler.com" -a -p \
  /Library/Keychains/System.keychain > "$OUT" 2>/dev/null; then
  echo "Could not find Zscaler cert (support@zscaler.com) in System.keychain."
  echo "Open Keychain Access, find your Zscaler/corporate root CA, export as .pem to:"
  echo "  $OUT"
  exit 1
fi

if ! grep -q "BEGIN CERTIFICATE" "$OUT"; then
  echo "Export produced an empty file. Export the CA manually to: $OUT"
  exit 1
fi

echo "Wrote $OUT"
echo
echo "Add this to your shell profile (~/.zshrc), then open a new terminal:"
echo "  export NODE_EXTRA_CA_CERTS=\"$OUT\""
echo
echo "Then run:"
echo "  npm run convex:dev"
