#!/usr/bin/env python3
import io

import cairosvg
from PIL import Image, ImageDraw, ImageFont

# Create 1200x630 image
width, height = 1200, 630
img = Image.new("RGB", (width, height), color="#8B6F47")

# Add subtle horizontal grain texture
draw = ImageDraw.Draw(img)
pixels = img.load()
for y in range(height):
    for x in range(width):
        r, g, b = pixels[x, y]
        # Add subtle variation
        noise = int((hash((x, y)) % 10) - 5)
        pixels[x, y] = (
            max(0, min(255, r + noise)),
            max(0, min(255, g + noise)),
            max(0, min(255, b + noise)),
        )

# Polaroid frame on the left (slightly tilted)
polaroid_x = 80
polaroid_y = 200
polaroid_width = 180
polaroid_height = 220
polaroid_padding = 12
polaroid_bottom_padding = 40

# Create polaroid with white background
polaroid_img = Image.new("RGBA", (polaroid_width, polaroid_height), "#FFFFFF")
polaroid_draw = ImageDraw.Draw(polaroid_img)

# Gray photo area
photo_height = polaroid_height - polaroid_padding * 2 - polaroid_bottom_padding
polaroid_draw.rectangle(
    [
        (polaroid_padding, polaroid_padding),
        (polaroid_width - polaroid_padding, polaroid_padding + photo_height),
    ],
    fill="#6B7280",
)

# Load and render the logo SVG with yellow color
with open("public/logo.svg", "r") as f:
    svg_content = f.read()
    # Replace fill color with yellow
    svg_content = svg_content.replace(
        "fill-rule:nonzero", "fill:#FCD34D;fill-rule:nonzero"
    )

# Convert SVG to PNG with proper size
logo_size = 120
png_data = cairosvg.svg2png(
    bytestring=svg_content.encode("utf-8"),
    output_width=logo_size,
    output_height=logo_size,
)
logo_img = Image.open(io.BytesIO(png_data)).convert("RGBA")

# Center the logo in the photo area
logo_x = (polaroid_width - logo_size) // 2
logo_y = polaroid_padding + (photo_height - logo_size) // 2
polaroid_img.paste(logo_img, (logo_x, logo_y), logo_img)

# Add 'Y S' text at bottom
try:
    small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
except:
    small_font = ImageFont.load_default()

polaroid_draw.text(
    (polaroid_width // 2, polaroid_height - 20),
    "Y S",
    fill="#666666",
    font=small_font,
    anchor="mm",
)

# Rotate polaroid slightly and paste onto main image
polaroid_img_rotated = polaroid_img.rotate(-3, expand=True, fillcolor=(0, 0, 0, 0))
img.paste(polaroid_img_rotated, (polaroid_x, polaroid_y), polaroid_img_rotated)

# Text boxes (center-left composition)
box_x = 350
box1_y = 200
box2_y = 310

box1_width = 700
box1_height = 80
box2_width = 700
box2_height = 60

# Top dark rectangle
draw.rounded_rectangle(
    [(box_x, box1_y), (box_x + box1_width, box1_y + box1_height)],
    radius=8,
    fill="#333333",
)

# Bottom dark rectangle
draw.rounded_rectangle(
    [(box_x, box2_y), (box_x + box2_width, box2_y + box2_height)],
    radius=8,
    fill="#333333",
)

# Add text
try:
    title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 42)
    subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
except:
    title_font = ImageFont.load_default()
    subtitle_font = ImageFont.load_default()

# Title text with wide letter spacing
title_text = "YANNICK DAILIES"
draw.text(
    (box_x + box1_width // 2, box1_y + box1_height // 2),
    title_text,
    fill="#FFFFFF",
    font=title_font,
    anchor="mm",
)

# Subtitle text
subtitle_text = "SMALL MOMENTS NO ONE NOTICES."
draw.text(
    (box_x + box2_width // 2, box2_y + box2_height // 2),
    subtitle_text,
    fill="#FFFFFF",
    font=subtitle_font,
    anchor="mm",
)

# Save image
img.save("public/og-image.jpg", "JPEG", quality=95)
print("OG image generated successfully with logo!")
