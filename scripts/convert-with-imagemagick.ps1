# PowerShell script to convert large SVG files to WebP using ImageMagick

$files = @(
    'immersion_1.svg',
    'immersion_2.svg',
    'immersion_workshop_1.svg',
    'immersion_workshop_2.svg',
    'immersion_workshop_3.svg',
    'namita_two.svg',
    'namita_four.svg',
    'namita_six.svg',
    'training_1.svg',
    'training_2.svg',
    'training_3.svg',
    'we_work_together_vector_one.svg',
    'we_work_together_vector_two.svg',
    'we_work_together_vector_four.svg'
)

Write-Host ""
Write-Host "Converting SVG images to WebP with ImageMagick" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

$totalBefore = 0
$totalAfter = 0
$successCount = 0

foreach ($file in $files) {
    $inputPath = Join-Path "public" $file
    $outputPath = $inputPath -replace '\.svg$', '.webp'

    if (Test-Path $inputPath) {
        try {
            Write-Host "Converting $file..." -NoNewline

            # Run ImageMagick conversion
            & magick $inputPath -quality 82 -define webp:method=6 $outputPath 2>&1 | Out-Null

            if (Test-Path $outputPath) {
                $inSize = (Get-Item $inputPath).Length
                $outSize = (Get-Item $outputPath).Length
                $totalBefore += $inSize
                $totalAfter += $outSize
                $reduction = [math]::Round((1 - $outSize/$inSize) * 100, 1)

                $inSizeMB = [math]::Round($inSize / 1MB, 2)
                $outSizeKB = [math]::Round($outSize / 1KB, 2)

                Write-Host " OK" -ForegroundColor Green
                Write-Host "   $inSizeMB MB → $outSizeKB KB ($reduction% reduction)" -ForegroundColor Gray
                $successCount++
            } else {
                Write-Host " FAILED to create output file" -ForegroundColor Red
            }
        } catch {
            Write-Host " ERROR: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "WARNING: Skipping $file - file not found" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Conversion Summary:" -ForegroundColor Cyan
Write-Host "  Converted: $successCount / $($files.Count) files" -ForegroundColor Green

if ($totalBefore -gt 0) {
    $beforeMB = [math]::Round($totalBefore / 1MB, 2)
    $afterMB = [math]::Round($totalAfter / 1MB, 2)
    $overallReduction = [math]::Round((1 - $totalAfter/$totalBefore) * 100, 1)

    Write-Host "  Total size: $beforeMB MB → $afterMB MB" -ForegroundColor Green
    Write-Host "  Overall reduction: $overallReduction%" -ForegroundColor Green
}

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
