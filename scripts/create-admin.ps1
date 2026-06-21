param(
  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$Email,

  [string]$Name = "Northline Admin",

  [string]$Password,

  [securestring]$SecurePassword
)

$ErrorActionPreference = "Stop"

function Read-DotEnv {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "Missing .env file at $Path"
  }

  $values = @{}

  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()

    if (-not $line -or $line.StartsWith("#") -or -not $line.Contains("=")) {
      return
    }

    $index = $line.IndexOf("=")
    $key = $line.Substring(0, $index).Trim()
    $value = $line.Substring($index + 1).Trim().Trim('"').Trim("'")
    $values[$key] = $value
  }

  return $values
}

function ConvertTo-PlainText {
  param([securestring]$SecureString)

  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  }
  finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

$envValues = Read-DotEnv -Path (Join-Path $PSScriptRoot "..\.env")

$supabaseUrl = $envValues["NEXT_PUBLIC_SUPABASE_URL"]
$serviceRoleKey = $envValues["SUPABASE_SERVICE_ROLE_KEY"]

if (-not $supabaseUrl) {
  throw "NEXT_PUBLIC_SUPABASE_URL is missing from .env"
}

if (-not $serviceRoleKey) {
  throw "SUPABASE_SERVICE_ROLE_KEY is missing from .env"
}

if ($Password -and $SecurePassword) {
  throw "Use either -Password or -SecurePassword, not both."
}

if ($Password) {
  $password = $Password
}
elseif ($SecurePassword) {
  $password = ConvertTo-PlainText -SecureString $SecurePassword
}
else {
  $SecurePassword = Read-Host "Admin password" -AsSecureString
  $password = ConvertTo-PlainText -SecureString $SecurePassword
}

if ($password.Length -lt 8) {
  throw "Password must be at least 8 characters."
}

$endpoint = "$($supabaseUrl.TrimEnd('/'))/auth/v1/admin/users"

$headers = @{
  "apikey"        = $serviceRoleKey
  "Authorization" = "Bearer $serviceRoleKey"
  "Content-Type"  = "application/json"
}

$body = @{
  email          = $Email
  password       = $password
  email_confirm  = $true
  app_metadata   = @{
    role  = "admin"
    roles = @("admin")
  }
  user_metadata  = @{
    name = $Name
  }
} | ConvertTo-Json -Depth 5

try {
  $response = Invoke-RestMethod -Method Post -Uri $endpoint -Headers $headers -Body $body
  Write-Host "Admin user created." -ForegroundColor Green
  Write-Host "User ID: $($response.id)"
  Write-Host "Email: $($response.email)"
}
catch {
  $message = $_.Exception.Message

  if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
    $message = $_.ErrorDetails.Message
  }

  throw "Failed to create admin user: $message"
}
