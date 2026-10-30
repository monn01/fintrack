Add-Type -AssemblyName System.Drawing

$pngPath = "E:\fintrack\public\icon.png"
$bmp = [System.Drawing.Bitmap]::FromFile($pngPath)
$resized = New-Object System.Drawing.Bitmap($bmp, 64, 64)
$iconHandle = $resized.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)

# Save to public/favicon.ico
$fs1 = New-Object System.IO.FileStream("E:\fintrack\public\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($fs1)
$fs1.Close()

# Save to src/app/favicon.ico
$fs2 = New-Object System.IO.FileStream("E:\fintrack\src\app\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($fs2)
$fs2.Close()

$icon.Dispose()
$resized.Dispose()
$bmp.Dispose()

Write-Output "FT favicon generated successfully!"
