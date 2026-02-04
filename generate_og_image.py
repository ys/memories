#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import math

# Create 1200x630 image
width, height = 1200, 630
img = Image.new('RGB', (width, height), color='#8B6F47')

# Add subtle horizontal grain texture
draw = ImageDraw.Draw(img)
pixels = img.load()
for y in range(height):
    for x in range(width):
        r, g, b = pixels[x, y]
        # Add subtle variation
        noise = int((hash((x, y)) % 10) - 5)
        pixels[x, y] = (max(0, min(255, r + noise)), max(0, min(255, g + noise)), max(0, min(255, b + noise)))

# Polaroid frame on the left (slightly tilted)
polaroid_x = 80
polaroid_y = 200
polaroid_width = 180
polaroid_height = 220
polaroid_padding = 12
polaroid_bottom_padding = 40

# Rotate polaroid
polaroid_img = Image.new('RGBA', (250, 280), (0, 0, 0, 0))
polaroid_draw = ImageDraw.Draw(polaroid_img)

# White polaroid frame
polaroid_draw.rectangle([(0, 0), (polaroid_width, polaroid_height)], fill='#FFFFFF', outline='#FFFFFF')

# Light gray photo area
photo_height = polaroid_height - polaroid_padding * 2 - polaroid_bottom_padding
polaroid_draw.rectangle([
    (polaroid_padding, polaroid_padding),
    (polaroid_width - polaroid_padding, polaroid_padding + photo_height)
], fill='#D3D3D3')

# Draw yellow smiley face
center_x = polaroid_width // 2
center_y = polaroid_padding + photo_height // 2
face_radius = 45

# Yellow circle
polaroid_draw.ellipse([
    (center_x - face_radius, center_y - face_radius),
    (center_x + face_radius, center_y + face_radius)
], fill='#FFD700', outline='#FFD700')

# Eyes
eye_y = center_y - 15
polaroid_draw.ellipse([(center_x - 20, eye_y), (center_x - 10, eye_y + 10)], fill='#000000')
polaroid_draw.ellipse([(center_x + 10, eye_y), (center_x + 20, eye_y + 10)], fill='#000000')

# Smile
smile_y = center_y + 5
polaroid_draw.arc([
    (center_x - 25, smile_y),
    (center_x + 25, smile_y + 30)
], start=0, end=180, fill='#000000', width=3)

# Add 'Y S' text at bottom
try:
    small_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 14)
except:
    small_font = ImageFont.load_default()

polaroid_draw.text(
    (polaroid_width // 2, polaroid_height - 20),
    'Y S',
    fill='#666666',
    font=small_font,
    anchor='mm'
)

# Rotate polaroid slightly
polaroid_img = polaroid_img.rotate(-3, expand=True, fillcolor=(0, 0, 0, 0))
img.paste(polaroid_img, (polaroid_x, polaroid_y), polaroid_img)

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
    fill='#333333'
)

# Bottom dark rectangle
draw.rounded_rectangle(
    [(box_x, box2_y), (box_x + box2_width, box2_y + box2_height)],
    radius=8,
    fill='#333333'
)

# Add text
try:
    title_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 42)
    subtitle_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 20)
except:
    title_font = ImageFont.load_default()
    subtitle_font = ImageFont.load_default()

# Title text with wide letter spacing
title_text = 'YANNICK DAILIES'
draw.text(
    (box_x + box1_width // 2, box1_y + box1_height // 2),
    title_text,
    fill='#FFFFFF',
    font=title_font,
    anchor='mm'
)

# Subtitle text
subtitle_text = 'SMALL MOMENTS NO ONE NOTICES.'
draw.text(
    (box_x + box2_width // 2, box2_y + box2_height // 2),
    subtitle_text,
    fill='#FFFFFF',
    font=subtitle_font,
    anchor='mm'
)

# Save image
img.save('public/og-image.jpg', 'JPEG', quality=95)
print('OG image generated successfully!')
