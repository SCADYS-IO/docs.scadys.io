<# Usage:
Make sure you are in the /docs/ directory, then run in PowerShell 5.1:

cd docs
mkdocs build --clean
.\scripts/deploy_docs.ps1 

Set environment variables SCADYSIO_FTP_HOST, SCADYSIO_FTP_USER, SCADYSIO_FTP_PASS
(e.g. in Windows System Properties > Environment Variables) #>


<#
--------------------------------------------------------------------------------
  deploy_docs.ps1 — Automated deployment of MkDocs site to Namecheap (cPanel)
  Author: SCADYS.IO
  Purpose:
    • Uploads the contents of your local MkDocs "site/" folder
      to the Namecheap cPanel hosting account via secure FTPS (FTP over TLS)
    • Replaces the manual "zip, upload, extract" workflow

  Requirements:
    • WinSCP installed (https://winscp.net/eng/download.php)
    • Environment variables set once:
        SCADYSIO_FTP_HOST = ftp.gmconsult.com.au
        SCADYSIO_FTP_USER = deploy_docs@scadys.io
        SCADYSIO_FTP_PASS = yourStrongPassword
    • The FTP user’s home directory should be:
        /home/gmcostbr/docs.scadys.io
--------------------------------------------------------------------------------
#>
<# 
--------------------------------------------------------------------------------
deploy_docs.ps1 — Deploy MkDocs site to Namecheap (FTPS) via WinSCP
- Requires WinSCP installed; copy WinSCPnet.dll + WinSCP.exe into scripts/tools/winscp
- Uses user env vars: SCADYSIO_FTP_HOST, SCADYSIO_FTP_USER, SCADYSIO_FTP_PASS
- Run from anywhere: .\scripts\deploy_docs.ps1
--------------------------------------------------------------------------------
#>

[CmdletBinding()]
param(
  [switch]$Build  # optional: also run `mkdocs build --clean`
)

# Always resolve relative paths from this script's folder
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)

# --- Config/paths ---
$LocalDirRel = "..\site\"            # MkDocs output relative to scripts/
$RemoteDir   = "/"                   # FTP user is rooted at /home/.../docs.scadys.io

# Vendored WinSCP files (keep DLL and EXE in repo to avoid version drift)
$WinSCPRoot = Join-Path $PSScriptRoot "tools\winscp"
$WinSCPDll  = Join-Path $WinSCPRoot "WinSCPnet.dll"
$WinSCPExe  = Join-Path $WinSCPRoot "WinSCP.exe"

# --- Optional build step ---
if ($Build) {
  Write-Host "🧱 Building MkDocs (mkdocs build --clean) ..."
  try {
    & mkdocs build --clean
    if ($LASTEXITCODE -ne 0) { throw "mkdocs returned exit code $LASTEXITCODE" }
  } catch {
    Write-Host "❌ MkDocs build failed: $($_.Exception.Message)"
    exit 1
  }
}

# --- Read credentials from environment ---
# $ftpHost = $env:SCADYSIO_FTP_HOST
# $user    = $env:SCADYSIO_FTP_USER
$pass    = $env:SCADYSIO_FTP_PASS

$ftpHost = "ftp.scadys.io"
$user    = "deploy_docs@scadys.io"
# $pass    = "8pka782lF3X9"

if (-not $ftpHost -or -not $user -or -not $pass) {
  Write-Host "❌ One or more FTP environment variables are missing."
  Write-Host "   Set SCADYSIO_FTP_HOST, SCADYSIO_FTP_USER, SCADYSIO_FTP_PASS and re-run."
  exit 1
}

# --- Sanity checks ---
if (-not (Test-Path $WinSCPDll) -or -not (Test-Path $WinSCPExe)) {
  Write-Host "❌ WinSCP files not found at: $WinSCPRoot"
  Write-Host "   Expected WinSCPnet.dll and WinSCP.exe"
  exit 1
}
if (-not (Test-Path $LocalDirRel)) {
  Write-Host "❌ Local MkDocs output folder not found: $LocalDirRel"
  Write-Host "   Tip: run with -Build to generate it."
  exit 1
}

# --- Load WinSCP .NET and configure session ---
Add-Type -Path $WinSCPDll

$sessionOptions = New-Object WinSCP.SessionOptions -Property @{
    Protocol   = [WinSCP.Protocol]::Ftp
    FtpSecure  = [WinSCP.FtpSecure]::Explicit
    HostName   = $ftpHost
    PortNumber = 21
    UserName   = $user
    Password   = $pass
    TlsHostCertificateFingerprint = "b2:e8:7d:90:d3:96:2b:34:9e:48:06:f5:99:ff:81:b0:72:f3:e0:14:16:03:ae:86:6b:41:7d:34:73:63:b5:8f"
}


$session = New-Object WinSCP.Session
$session.ExecutablePath = $WinSCPExe

# --- Deploy (try/catch/finally correctly balanced) ---
try {
    $logFile = Join-Path $PSScriptRoot "winscp.log"
    $session.SessionLogPath = $logFile
    Write-Host "Logging to $logFile"  
    Write-Host "Connecting to $ftpHost as $user ..."
    $session.Open($sessionOptions)
    Write-Host "Remote working directory: " ($session.ExecuteCommand("pwd").Output)
    Write-Host "Remote listing:"
    $session.ListDirectory($RemoteDir).Files | Select-Object Name | ForEach-Object { $_.Name }

    Write-Host "FTPS connection established."

    $transferOptions = New-Object WinSCP.TransferOptions
    $transferOptions.TransferMode = [WinSCP.TransferMode]::Binary

    $localAbs = (Resolve-Path $LocalDirRel).Path
    Write-Host "Sync local  : $localAbs"
    Write-Host "  to remote: $RemoteDir"
    Write-Host "-------------------------------------------"

    # Synchronize (local → remote). 
    # removeFiles=$true deletes remote files that no longer exist locally.
    # mirror=$true includes subdirectories.
    $result = $session.SynchronizeDirectories(
        [WinSCP.SynchronizationMode]::Remote,
        $localAbs,
        $RemoteDir,
        $true,                                  # removeFiles
        $true,                                  # mirror recursively
        [WinSCP.SynchronizationCriteria]::Time  # compare by modified time
    )

    $result.Check()   # throws if any transfer failed

    Write-Host "✅ Deployment complete. Files transferred: $($result.Transfers.Count)"
}
catch {
    Write-Host "Deployment failed:"
    Write-Host "   $($_.Exception.Message)"
}
finally {
    if ($null -ne $session) {
        $session.Dispose()
    }
  Write-Host "Connection closed."
}
