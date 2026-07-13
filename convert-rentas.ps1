# Script to convert inventario renta media to webp/webm and place in project
$inventarioBase = "C:\Users\OSCAR\Desktop\LAURA MEXICO\inventario renta"
$projectBase = "C:\Users\OSCAR\Desktop\LAURA MEXICO\badi108 web"
$rentasDir = "$projectBase\public\images\rentas"

# Mapping from inventario folder names to website slug IDs
$folderMap = @{
    "01 Relox 08-B"             = "relox-08b"
    "02 Relox 07-C Aldama"      = "relox-07c-aldama"
    "03 Relox 07-A ALDAMA P-J"  = "relox-07a-aldama-pj"
    "04 Relox 10-A Recreo"      = "relox-10a-recreo"
    "05 INSURGENTES 10-D"       = "insurgentes-10d"
    "06 Relox 17-C ALDAMA"      = "relox-17c-aldama"
    "07 Hidalgo 08-A Recreo P-J"= "hidalgo-08a-recreo-pj"
    "08 Hidalgo 02-C"           = "hidalgo-02c"
    "09 Relox 28 D Recreo"      = "relox-28d-recreo"
    "10 Relox 02 C Recreo"      = "relox-02c-recreo"
}

foreach ($folder in $folderMap.Keys) {
    $slug = $folderMap[$folder]
    $sourceDir = Join-Path $inventarioBase $folder
    $targetDir = Join-Path $rentasDir $slug
    
    # Create target directory
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    
    Write-Host "`n=== Processing: $folder -> $slug ==="
    
    # Convert images to webp
    $images = Get-ChildItem $sourceDir -File | Where-Object { $_.Name -match '\.(jpg|jpeg|png|gif|bmp)$' }
    $imgCount = 0
    foreach ($img in $images) {
        $outName = "img-{0:D3}.webp" -f (++$imgCount)
        $outPath = Join-Path $targetDir $outName
        Write-Host "  Converting image: $($img.Name) -> $outName"
        & ffmpeg -i $img.FullName -quality 80 -y $outPath 2>&1 | Out-Null
    }
    
    # Also check subdirectories for images (some properties have images in VIDEOS CAP CUT subfolders too)
    $subImages = Get-ChildItem $sourceDir -File -Recurse | Where-Object { $_.Name -match '\.(jpg|jpeg|png|gif|bmp)$' -and $_.DirectoryName -ne $sourceDir }
    foreach ($img in $subImages) {
        $outName = "img-{0:D3}.webp" -f (++$imgCount)
        $outPath = Join-Path $targetDir $outName
        Write-Host "  Converting sub-image: $($img.Name) -> $outName"
        & ffmpeg -i $img.FullName -quality 80 -y $outPath 2>&1 | Out-Null
    }
    
    Write-Host "  Total images converted: $imgCount"
    
    # Convert videos to webm
    $videos = Get-ChildItem $sourceDir -File -Recurse | Where-Object { $_.Name -match '\.(mp4|mov|avi|mkv)$' }
    $vidCount = 0
    foreach ($vid in $videos) {
        $outName = "video-{0:D2}.webm" -f (++$vidCount)
        $outPath = Join-Path $targetDir $outName
        Write-Host "  Converting video: $($vid.Name) -> $outName (size: $([math]::Round($vid.Length/1MB,1)) MB)"
        & ffmpeg -i $vid.FullName -c:v libvpx -crf 30 -b:v 1M -an -y $outPath 2>&1 | Out-Null
        $newSize = if (Test-Path $outPath) { [math]::Round((Get-Item $outPath).Length/1MB,1) } else { 0 }
        Write-Host "    -> Output: $newSize MB"
    }
    
    Write-Host "  Total videos converted: $vidCount"
}

Write-Host "`n=== DONE ==="
