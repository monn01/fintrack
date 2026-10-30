Add-Type -AssemblyName System.Drawing

$bannerDir = "E:\fintrack\public\banners"
if (!(Test-Path $bannerDir)) {
    New-Item -ItemType Directory -Path $bannerDir -Force | Out-Null
}

function Create-PromoBanner {
    param(
        [string]$Filename,
        [string]$ColorStart,
        [string]$ColorEnd,
        [string]$AccentColor,
        [string]$TagText,
        [string]$TagBgColor,
        [string]$TitleText,
        [string]$SubtitleText,
        [string]$IllustrationType
    )

    $width = 720
    $height = 360
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $cStart = [System.Drawing.ColorTranslator]::FromHtml($ColorStart)
    $cEnd = [System.Drawing.ColorTranslator]::FromHtml($ColorEnd)
    $cAccent = [System.Drawing.ColorTranslator]::FromHtml($AccentColor)
    $cTagBg = [System.Drawing.ColorTranslator]::FromHtml($TagBgColor)

    # Background Gradient
    $bgRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, $cStart, $cEnd, [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
    $g.FillRectangle($bgBrush, $bgRect)
    $bgBrush.Dispose()

    # Subtle background decorative glow circles
    $glowColor = [System.Drawing.Color]::FromArgb(35, $cAccent.R, $cAccent.G, $cAccent.B)
    $glowBrush = New-Object System.Drawing.SolidBrush($glowColor)
    $g.FillEllipse($glowBrush, 440, -40, 340, 340)
    $g.FillEllipse($glowBrush, 500, 100, 260, 260)
    $glowBrush.Dispose()

    # Modern Grid Dots Pattern in right area
    $dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 255, 255, 255))
    for ($dx = 460; $dx -lt 700; $dx += 24) {
        for ($dy = 40; $dy -lt 320; $dy += 24) {
            $g.FillEllipse($dotBrush, $dx, $dy, 3, 3)
        }
    }
    $dotBrush.Dispose()

    # Left content area: Tag Badge
    $tagFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
    $tagBrush = New-Object System.Drawing.SolidBrush($cTagBg)
    $g.FillRectangle($tagBrush, 40, 36, 210, 30)
    $tagBrush.Dispose()

    $tagTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.DrawString($TagText, $tagFont, $tagTextBrush, 48, 42)
    $tagTextBrush.Dispose()
    $tagFont.Dispose()

    # Title Text
    $titleFont = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $titleRect = New-Object System.Drawing.RectangleF(40, 84, 420, 110)
    $g.DrawString($TitleText, $titleFont, $whiteBrush, $titleRect)
    $titleFont.Dispose()

    # Subtitle Text
    $subFont = New-Object System.Drawing.Font("Arial", 13, [System.Drawing.FontStyle]::Regular)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(215, 230, 255))
    $subRect = New-Object System.Drawing.RectangleF(40, 196, 410, 75)
    $g.DrawString($SubtitleText, $subFont, $subBrush, $subRect)
    $subFont.Dispose()
    $subBrush.Dispose()

    # CTA Button pill
    $btnRect = New-Object System.Drawing.Rectangle(40, 280, 150, 42)
    $btnBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillRectangle($btnBrush, $btnRect)
    $btnBrush.Dispose()

    $btnFont = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Bold)
    $btnTextBrush = New-Object System.Drawing.SolidBrush($cStart)
    $g.DrawString("Cek Sekarang ->", $btnFont, $btnTextBrush, 50, 292)
    $btnFont.Dispose()
    $btnTextBrush.Dispose()

    # Right side 3D Finance Illustrations
    if ($IllustrationType -eq "invest") {
        # Rising bars
        $barBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(90, 255, 255, 255))
        $barBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(150, 255, 255, 255))
        $barBrush3 = New-Object System.Drawing.SolidBrush($cAccent)
        $g.FillRectangle($barBrush1, 480, 200, 44, 90)
        $g.FillRectangle($barBrush2, 540, 150, 44, 140)
        $g.FillRectangle($barBrush3, 600, 90, 44, 200)
        $barBrush1.Dispose(); $barBrush2.Dispose(); $barBrush3.Dispose()

        # Gold Coins
        $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 204, 21))
        $goldBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(202, 138, 4), 4)
        $g.FillEllipse($goldBrush, 570, 60, 60, 60)
        $g.DrawEllipse($goldBorder, 570, 60, 60, 60)
        
        $g.FillEllipse($goldBrush, 500, 130, 48, 48)
        $g.DrawEllipse($goldBorder, 500, 130, 48, 48)

        # Sparkles
        $sparkleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $g.FillPolygon($sparkleBrush, @(
            (New-Object System.Drawing.Point(645, 45)),
            (New-Object System.Drawing.Point(650, 55)),
            (New-Object System.Drawing.Point(660, 60)),
            (New-Object System.Drawing.Point(650, 65)),
            (New-Object System.Drawing.Point(645, 75)),
            (New-Object System.Drawing.Point(640, 65)),
            (New-Object System.Drawing.Point(630, 60)),
            (New-Object System.Drawing.Point(640, 55))
        ))
        $goldBrush.Dispose(); $goldBorder.Dispose(); $sparkleBrush.Dispose()
    }
    elseif ($IllustrationType -eq "budget") {
        # Large 50 / 30 / 20 badge circles
        $c1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 16, 185, 129))
        $c2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 14, 165, 233))
        $c3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 245, 158, 11))

        $g.FillEllipse($c1, 510, 70, 110, 110)
        $g.FillEllipse($c2, 580, 150, 95, 95)
        $g.FillEllipse($c3, 490, 175, 80, 80)

        $numFont = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
        $labelFont = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)
        $wB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)

        $g.DrawString("50%", $numFont, $wB, 532, 95)
        $g.DrawString("Kebutuhan", $labelFont, $wB, 532, 132)

        $g.DrawString("30%", $numFont, $wB, 600, 172)
        $g.DrawString("Gaya Hidup", $labelFont, $wB, 595, 208)

        $g.DrawString("20%", $numFont, $wB, 505, 195)
        $g.DrawString("Tabungan", $labelFont, $wB, 500, 226)

        $c1.Dispose(); $c2.Dispose(); $c3.Dispose(); $numFont.Dispose(); $labelFont.Dispose(); $wB.Dispose()
    }
    elseif ($IllustrationType -eq "couple") {
        # Joint rings & house
        $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(250, 204, 21), 8)
        $g.DrawEllipse($ringPen, 500, 120, 85, 85)
        $g.DrawEllipse($ringPen, 555, 120, 85, 85)

        # Heart badge in the center
        $heartBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(244, 63, 94))
        $g.FillEllipse($heartBrush, 550, 100, 42, 42)
        $heartBrush.Dispose()

        # Mini house shape
        $houseBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 255, 255, 255))
        $g.FillPolygon($houseBrush, @(
            (New-Object System.Drawing.Point(570, 170)),
            (New-Object System.Drawing.Point(620, 215)),
            (New-Object System.Drawing.Point(520, 215))
        ))
        $g.FillRectangle($houseBrush, 535, 215, 70, 60)
        $houseBrush.Dispose()
        $ringPen.Dispose()
    }
    elseif ($IllustrationType -eq "emergency") {
        # Shield protection
        $shieldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 59, 130, 246))
        $shieldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(250, 204, 21), 6)
        
        $points = @(
            (New-Object System.Drawing.Point(570, 70)),
            (New-Object System.Drawing.Point(645, 100)),
            (New-Object System.Drawing.Point(630, 210)),
            (New-Object System.Drawing.Point(570, 260)),
            (New-Object System.Drawing.Point(510, 210)),
            (New-Object System.Drawing.Point(495, 100))
        )
        $g.FillPolygon($shieldBrush, $points)
        $g.DrawPolygon($shieldPen, $points)

        # Checkmark in shield
        $checkPen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 10)
        $checkPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $checkPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
        $g.DrawLine($checkPen, 540, 165, 565, 195)
        $g.DrawLine($checkPen, 565, 195, 610, 135)
        $checkPen.Dispose()
        $shieldBrush.Dispose()
        $shieldPen.Dispose()
    }

    $whiteBrush.Dispose()
    $g.Dispose()

    $destPath = Join-Path $bannerDir $Filename
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output "Created: $destPath"
}

# 1. Invest Banner
Create-PromoBanner `
    -Filename "banner-invest.png" `
    -ColorStart "#003b95" `
    -ColorEnd "#03173d" `
    -AccentColor "#38bdf8" `
    -TagText "PROMO FINANSIAL" `
    -TagBgColor "#0284c7" `
    -TitleText "Cashback Investasi 25% & Tabungan Rutin" `
    -SubtitleText "Mulai investasikan sisa uang bulanan. Bebas biaya admin & hasil terukur." `
    -IllustrationType "invest"

# 2. 50/30/20 Budget Banner
Create-PromoBanner `
    -Filename "banner-budget.png" `
    -ColorStart "#065f46" `
    -ColorEnd "#022c22" `
    -AccentColor "#34d399" `
    -TagText "TIPS KEUANGAN" `
    -TagBgColor "#059669" `
    -TitleText "Rumus Anti Boncos: Metode 50 / 30 / 20" `
    -SubtitleText "Panduan cerdas membagi pemasukan untuk kebutuhan wajib, gaya hidup, & tabungan." `
    -IllustrationType "budget"

# 3. Couple Goals Banner
Create-PromoBanner `
    -Filename "banner-couple.png" `
    -ColorStart "#581c87" `
    -ColorEnd "#2e1065" `
    -AccentColor "#c084fc" `
    -TagText "DUAL WALLET PRO" `
    -TagBgColor "#7e22ce" `
    -TitleText "Capai Target Impian Bersama Pasangan" `
    -SubtitleText "Tabungan nikah, beli rumah, dan liburan jadi lebih transparan dan terpantau." `
    -IllustrationType "couple"

# 4. Emergency Fund Banner
Create-PromoBanner `
    -Filename "banner-emergency.png" `
    -ColorStart "#1e293b" `
    -ColorEnd "#0f172a" `
    -AccentColor "#f59e0b" `
    -TagText "PROTEKSI KELUARGA" `
    -TagBgColor "#d97706" `
    -TitleText "Siapkan Dana Siaga Minimal 6x Pengeluaran" `
    -SubtitleText "Lindungi stabilitas finansial dari situasi mendesak tanpa perlu pinjaman online." `
    -IllustrationType "emergency"
