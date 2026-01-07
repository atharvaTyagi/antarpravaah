# Convert the very large SVG files that failed
# These need special handling due to their size

$largeFiles = @(
    'immersion_1.svg',
    'immersion_2.svg',
    'immersion_workshop_1.svg',
    'immersion_workshop_2.svg',
    'immersion_workshop_3.svg',
    'namita_two.svg',
    'namita_four.svg',
    'namita_six.svg',
    'we_work_together_vector_two.svg'
)

Write-Host ""
Write-Host "Converting very large SVG files..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$totalBefore = 0
$totalAfter = 0
$successCount = 0

foreach ($file in $largeFiles) {
    $inputPath = Join-Path "public" $file
    $outputPath = $inputPath -replace '\.svg$', '.webp'

    if (Test-Path $inputPath) {
        Write-Host "Converting $file..." -NoNewline

        try {
            # Try with density limitation to handle large files
            & magick $inputPath -density 150 -resize 2000x2000'>' -quality 82 -define webp:method=6 $outputPath 2>&1 | Out-Null

            if (Test-Path $outputPath) {
                $inSize = (Get-Item $inputPath).Length
                $outSize = (Get-Item $outputPath).Length
                $totalBefore += $inSize
                $totalAfter += $outSize
                $reduction = [math]::Round((1 - $outSize/$inSize) * 100, 1)

                $inSizeMB = [math]::Round($inSize / 1MB, 2)
                $outSizeKB = [math]::Round($outSize / 1KB, 2)

                Write-Host " OK" -ForegroundColor Green
                Write-Host "   $inSizeMB MB to $outSizeKB KB ($reduction% reduction)" -ForegroundColor Gray
                $successCount++
            } else {
                Write-Host " FAILED" -ForegroundColor Red
            }
        } catch {
            Write-Host " ERROR: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "WARNING: $file not found" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Results: $successCount / $($largeFiles.Count) files converted" -ForegroundColor Green

if ($totalBefore -gt 0) {
    $beforeMB = [math]::Round($totalBefore / 1MB, 2)
    $afterMB = [math]::Round($totalAfter / 1MB, 2)
    $overallReduction = [math]::Round((1 - $totalAfter/$totalBefore) * 100, 1)

    Write-Host "Total: $beforeMB MB to $afterMB MB ($overallReduction% reduction)" -ForegroundColor Green
}

Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
