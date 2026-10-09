# Cloudflare's official Codex agent setup.
# Source: https://developers.cloudflare.com/agent-setup/prompt.md
# Run in a normal PowerShell terminal outside the restricted agent session.
$ErrorActionPreference = 'Stop'

if (-not (Get-Command npx.cmd -ErrorAction SilentlyContinue)) {
    throw 'Node.js/npm is required (npx.cmd was not found).'
}
if (-not (Get-Command codex.cmd -ErrorAction SilentlyContinue)) {
    throw 'Codex CLI is required (codex.cmd was not found).'
}

Write-Host 'Installing Cloudflare skills...'
& npx.cmd -y skills add cloudflare/skills --skill '*' --yes --global
if ($LASTEXITCODE -ne 0) { throw 'Cloudflare skill installation failed.' }

Write-Host 'Registering the Cloudflare MCP server...'
& codex.cmd mcp add cloudflare --url https://mcp.cloudflare.com/mcp
if ($LASTEXITCODE -ne 0) { throw 'Cloudflare MCP registration failed.' }

Write-Host 'Completing Cloudflare MCP authorization...'
& codex.cmd mcp login cloudflare
if ($LASTEXITCODE -ne 0) { throw 'Cloudflare MCP authorization failed.' }

& codex.cmd mcp list
if ($LASTEXITCODE -ne 0) { throw 'MCP configuration verification failed.' }
Write-Host 'Cloudflare agent setup completed. Restart Codex to load its MCP tools.'
