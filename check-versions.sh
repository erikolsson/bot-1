#!/bin/bash
# Towns Protocol Bot - Version Checker
# Checks for latest SDK versions and Bun runtime

echo "🔍 Checking Towns Protocol SDK versions..."
echo ""

# Check current versions in package.json
echo "📦 Current versions in package.json:"
if [ -f "package.json" ]; then
  grep -A 1 '"@towns-protocol/bot"' package.json | tail -1
  grep -A 1 '"@towns-protocol/sdk"' package.json | tail -1
else
  echo "❌ package.json not found"
  exit 1
fi

echo ""
echo "🌐 Latest versions from npm:"

# Check latest versions from npm
BOT_LATEST=$(npm view @towns-protocol/bot version 2>/dev/null)
SDK_LATEST=$(npm view @towns-protocol/sdk version 2>/dev/null)

if [ -n "$BOT_LATEST" ]; then
  echo "   @towns-protocol/bot: $BOT_LATEST"
else
  echo "   ❌ Could not fetch @towns-protocol/bot version"
fi

if [ -n "$SDK_LATEST" ]; then
  echo "   @towns-protocol/sdk: $SDK_LATEST"
else
  echo "   ❌ Could not fetch @towns-protocol/sdk version"
fi

echo ""
echo "🦊 Checking Bun installation:"

if command -v bun &> /dev/null; then
  BUN_VERSION=$(bun --version)
  echo "   ✅ Bun installed: v$BUN_VERSION"
  
  # Check if version is at least 1.2.20
  REQUIRED_VERSION="1.2.20"
  if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$BUN_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
    echo "   ✅ Version OK (>= $REQUIRED_VERSION)"
  else
    echo "   ⚠️  Version $BUN_VERSION is older than recommended $REQUIRED_VERSION"
    echo "   💡 Update with: curl -fsSL https://bun.sh/install | bash"
  fi
else
  echo "   ❌ Bun not installed"
  echo "   💡 Install with: curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

echo ""
echo "💡 To update to latest versions:"
echo "   bun update @towns-protocol/bot @towns-protocol/sdk"
echo ""

