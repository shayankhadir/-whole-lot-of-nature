# Instagram Content Generator & Exporter
# Run this to generate 30 days of Instagram content and save to CSV

Write-Host "📱 Instagram Content Generator" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PostCount = 30
$Keywords = @("indoor plants", "plant care", "houseplants", "succulents", "gardening tips")

Write-Host "⏳ Generating $PostCount Instagram posts..." -ForegroundColor Yellow

# Generate posts via API
try {
    $Body = @{
        postCount = $PostCount
        keywords = $Keywords
    } | ConvertTo-Json

    $Response = Invoke-WebRequest `
        -Method POST `
        -Uri "http://localhost:3000/api/instagram/automate?action=generate-and-export" `
        -ContentType "application/json" `
        -Body $Body `
        -ErrorAction Stop

    $Data = $Response.Content | ConvertFrom-Json

    if ($Data.success) {
        Write-Host "✅ Generated $($Data.posts.Count) posts successfully!" -ForegroundColor Green
        Write-Host ""

        # Save CSV
        $CSVPath = "instagram-content-$(Get-Date -Format 'yyyy-MM-dd-HHmm').csv"
        $Data.csvData | Out-File -FilePath $CSVPath -Encoding UTF8

        Write-Host "📁 Saved to: $CSVPath" -ForegroundColor Green
        Write-Host ""

        # Display first 3 posts as preview
        Write-Host "📝 Sample Posts (First 3):" -ForegroundColor Cyan
        Write-Host "=========================" -ForegroundColor Cyan

        for ($i = 0; $i -lt [Math]::Min(3, $Data.posts.Count); $i++) {
            $Post = $Data.posts[$i]
            Write-Host ""
            Write-Host "📸 Post $($i + 1):" -ForegroundColor Yellow
            Write-Host "Caption: $($Post.content)" -ForegroundColor White
            Write-Host "Hashtags: $($Post.hashtags[0..4] -join ' ')..." -ForegroundColor Gray
            Write-Host "CTA: $($Post.cta)" -ForegroundColor Magenta
        }

        Write-Host ""
        Write-Host "=" * 50 -ForegroundColor Cyan
        Write-Host ""
        Write-Host "✅ NEXT STEPS:" -ForegroundColor Green
        Write-Host "1. Open: $CSVPath" -ForegroundColor White
        Write-Host "2. Review and edit posts if needed" -ForegroundColor White
        Write-Host "3. Go to: https://business.facebook.com/latest/inbox/all" -ForegroundColor White
        Write-Host "4. Use 'Content Publishing' to schedule posts" -ForegroundColor White
        Write-Host ""
        Write-Host "📊 OR use the dashboard:" -ForegroundColor Cyan
        Write-Host "   http://localhost:3000/blog-agent → Social Media tab" -ForegroundColor White
        Write-Host ""

    } else {
        Write-Host "❌ Error: $($Data.error)" -ForegroundColor Red
    }

} catch {
    Write-Host "❌ Failed to generate content" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Make sure the dev server is running:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
