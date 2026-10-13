"""
VIZION DZ - Simplified Video Creator
"""
import os
import numpy as np
from pathlib import Path
from moviepy import (
    VideoClip, TextClip, CompositeVideoClip, AudioFileClip,
    ColorClip, concatenate_videoclips
)
from PIL import Image, ImageDraw, ImageFont

# Config
OUTPUT_DIR = Path(__file__).parent / "output"
TEMP_DIR = Path(__file__).parent / "temp"
OUTPUT_DIR.mkdir(exist_ok=True)

W, H = 1920, 1080
FPS = 24
BG = (10, 10, 18)
ACCENT = (0, 180, 216)
GOLD = (212, 175, 55)
WHITE = (255, 255, 255)
GRAY = (160, 160, 160)

# Segments: (text, duration, style)
SEGMENTS = [
    ("Aujourd'hui, avoir une\npresence en ligne ne suffit plus.", 4.5, "sub"),
    ("Votre entreprise merite\nune image qui inspire confiance.", 4.5, "sub"),
    ("Chez VISION DZ,\nnous transformons vos idees\nen experiences digitales.", 5.0, "company"),
    ("Des sites modernes.", 2.5, "list"),
    ("Des interfaces pensees\npour vos clients.", 3.0, "list"),
    ("Des designs qui refletent\nvotre identite.", 3.0, "list"),
    ("Chaque detail est concu\npour une seule chose :", 4.0, "sub"),
    ("faire de votre vision...\nune realite.", 4.5, "emphasis"),
    ("Decouvrez nos creations.\nDecouvrez notre savoir-faire.", 4.5, "sub"),
    ("VIZION DZ", 4.5, "logo"),
]

def make_frame(t, text, dur, style):
    """Create a single frame."""
    # Background gradient
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # Grid
    for x in range(0, W, 80):
        draw.line([(x, 0), (x, H)], fill=(20, 20, 35), width=1)
    for y in range(0, H, 80):
        draw.line([(0, y), (W, y)], fill=(20, 20, 35), width=1)

    # Fonts
    try:
        f_large = ImageFont.truetype("arial.ttf", 68)
        f_med = ImageFont.truetype("arial.ttf", 50)
        f_bold = ImageFont.truetype("arialbd.ttf", 88) if os.path.exists("C:\\Windows\\Fonts\\arialbd.ttf") else f_large
        f_small = ImageFont.truetype("arial.ttf", 30)
    except:
        f_large = f_med = f_bold = f_small = ImageFont.load_default()

    # Fade in
    alpha = min(1.0, t / 0.5) if t < 0.5 else 1.0

    if style == "logo":
        # Logo
        bbox = draw.textbbox((0, 0), text, font=f_bold)
        tw = bbox[2] - bbox[0]
        x = (W - tw) // 2
        y = H // 2 - 80

        # Top line
        lw = int(250 * alpha)
        lx = (W - lw) // 2
        draw.rectangle([lx, y - 25, lx + lw, y - 21], fill=ACCENT)

        # Main text
        draw.text((x, y), text, font=f_bold, fill=ACCENT)

        # Tagline
        tag = "Votre vision. Notre creation."
        tb = draw.textbbox((0, 0), tag, font=f_small)
        tx = (W - (tb[2] - tb[0])) // 2
        ty = y + 100
        draw.text((tx, ty), tag, font=f_small, fill=GRAY)

        # Bottom line
        draw.rectangle([lx, ty + 60, lx + lw, ty + 64], fill=ACCENT)

    elif style == "company":
        bbox = draw.multiline_textbbox((0, 0), text, font=f_med)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        x = (W - tw) // 2
        y = (H - th) // 2
        draw.multiline_text((x, y), text, font=f_med, fill=WHITE, align="center")
        # Gold underline
        draw.rectangle([x, y + th + 8, x + tw, y + th + 11], fill=GOLD)

    elif style == "emphasis":
        bbox = draw.multiline_textbbox((0, 0), text, font=f_large)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        x = (W - tw) // 2
        y = (H - th) // 2
        draw.multiline_text((x, y), text, font=f_large, fill=GOLD, align="center")

    elif style == "list":
        bbox = draw.multiline_textbbox((0, 0), text, font=f_med)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        x = (W - tw) // 2
        y = (H - th) // 2
        # Bullet
        draw.ellipse([x - 35, y + th//2 - 5, x - 21, y + th//2 + 9], fill=ACCENT)
        draw.multiline_text((x, y), text, font=f_med, fill=WHITE, align="left")

    else:  # sub
        bbox = draw.multiline_textbbox((0, 0), text, font=f_med)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        x = (W - tw) // 2
        y = (H - th) // 2
        draw.multiline_text((x, y), text, font=f_med, fill=WHITE, align="center")

    # Bottom bar
    draw.rectangle([0, H - 50, W, H], fill=(5, 5, 10))
    draw.text((40, H - 40), "VIZION DZ", font=f_small, fill=ACCENT)

    return np.array(img)


def main():
    print("Creating video segments...")

    clips = []
    for i, (text, dur, style) in enumerate(SEGMENTS):
        print(f"  [{i+1}/{len(SEGMENTS)}] {text[:35]}...")
        def make(t, txt=text, d=dur, s=style):
            return make_frame(t, txt, d, s)
        clip = VideoClip(make, duration=dur).with_fps(FPS)
        clips.append(clip)

    print("Concatenating...")
    video = concatenate_videoclips(clips, method="compose")

    print("Loading audio...")
    audio_path = TEMP_DIR / "voiceover_raw.mp3"
    audio = AudioFileClip(str(audio_path))

    # Match durations
    if audio.duration > video.duration:
        audio = audio.subclipped(0, video.duration)

    video = video.with_audio(audio)

    out = OUTPUT_DIR / "VIZION_DZ_Promo.mp4"
    print(f"Rendering to {out}...")
    video.write_videofile(
        str(out),
        fps=FPS,
        codec="libx264",
        audio_codec="aac",
        bitrate="4000k",
        preset="fast",
        threads=4,
        logger=None,
    )

    # Cleanup
    audio.close()
    video.close()
    for c in clips:
        c.close()

    print(f"\nDone! Video: {out}")


if __name__ == "__main__":
    main()
