"""
VIZION DZ - Promotional Video Generator
Creates a premium dark-themed motion graphics video with French voiceover.
"""

import os
import asyncio
from pathlib import Path
from gtts import gTTS
from moviepy import (
    VideoClip, TextClip, CompositeVideoClip, AudioFileClip,
    ColorClip, concatenate_videoclips
)
from PIL import Image, ImageDraw, ImageFont
import numpy as np

# ============================================================
# CONFIGURATION
# ============================================================
OUTPUT_DIR = Path(__file__).parent / "output"
TEMP_DIR = Path(__file__).parent / "temp"
OUTPUT_DIR.mkdir(exist_ok=True)
TEMP_DIR.mkdir(exist_ok=True)

VIDEO_WIDTH = 1920
VIDEO_HEIGHT = 1080
FPS = 30
BG_COLOR = (10, 10, 15)  # Very dark blue-black
ACCENT_COLOR = (0, 180, 216)  # Cyan/teal accent
TEXT_COLOR = (255, 255, 255)
SUBTITLE_COLOR = (180, 180, 180)
GOLD_ACCENT = (212, 175, 55)

# Voiceover script segments with timing
SEGMENTS = [
    {
        "text": "Aujourd'hui, avoir une présence en ligne ne suffit plus.",
        "duration": 5.0,
        "style": "subtitle",
    },
    {
        "text": "Votre entreprise mérite une image\nqui inspire confiance.",
        "duration": 5.0,
        "style": "subtitle",
    },
    {
        "text": "Chez VISION DZ,\nnous transformons vos idées\nen expériences digitales.",
        "duration": 5.5,
        "style": "highlight",
        "company": True,
    },
    {
        "text": "Des sites modernes.",
        "duration": 2.5,
        "style": "list",
    },
    {
        "text": "Des interfaces pensées\npour vos clients.",
        "duration": 3.0,
        "style": "list",
    },
    {
        "text": "Des designs qui reflètent\nvotre identité.",
        "duration": 3.0,
        "style": "list",
    },
    {
        "text": "Chaque détail est conçu\npour une seule chose :",
        "duration": 4.0,
        "style": "subtitle",
    },
    {
        "text": "faire de votre vision…\nune réalité.",
        "duration": 4.5,
        "style": "emphasis",
    },
    {
        "text": "Découvrez nos créations.\nDécouvrez notre savoir-faire.",
        "duration": 4.5,
        "style": "subtitle",
    },
    {
        "text": "VIZION DZ",
        "duration": 4.0,
        "style": "logo",
        "tagline": "Votre vision.\nNotre création.",
    },
]


# ============================================================
# STEP 1: Generate Voiceover
# ============================================================
def generate_voiceover():
    """Generate French voiceover using gTTS."""
    full_text = ""
    for seg in SEGMENTS:
        full_text += seg["text"].replace("\n", " ") + " "

    audio_path = TEMP_DIR / "voiceover_raw.mp3"
    print(f"[1/3] Generating voiceover...")
    tts = gTTS(text=full_text, lang="fr", slow=False)
    tts.save(str(audio_path))
    print(f"  -> Saved to {audio_path}")
    return audio_path


# ============================================================
# STEP 2: Create Video Segments
# ============================================================
def create_gradient_background(w, h, color1, color2):
    """Create a gradient background as numpy array."""
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    for y in range(h):
        ratio = y / h
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        arr[y, :] = [r, g, b]
    return arr


def create_frame(text, style="subtitle", progress=1.0, company=False, tagline=None):
    """Create a single video frame with text."""
    # Create gradient background
    bg_top = (8, 8, 18)
    bg_bottom = (15, 15, 30)
    bg_arr = create_gradient_background(VIDEO_WIDTH, VIDEO_HEIGHT, bg_top, bg_bottom)

    img = Image.fromarray(bg_arr)
    draw = ImageDraw.Draw(img)

    # Add subtle grid pattern
    for x in range(0, VIDEO_WIDTH, 60):
        draw.line([(x, 0), (x, VIDEO_HEIGHT)], fill=(25, 25, 40), width=1)
    for y in range(0, VIDEO_HEIGHT, 60):
        draw.line([(0, y), (VIDEO_WIDTH, y)], fill=(25, 25, 40), width=1)

    # Load fonts
    try:
        font_large = ImageFont.truetype("arial.ttf", 72)
        font_medium = ImageFont.truetype("arial.ttf", 52)
        font_small = ImageFont.truetype("arial.ttf", 36)
        font_tagline = ImageFont.truetype("arial.ttf", 40)
        font_bold = ImageFont.truetype("arialbd.ttf", 80) if os.path.exists("C:\\Windows\\Fonts\\arialbd.ttf") else font_large
    except:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_tagline = ImageFont.load_default()
        font_bold = font_large

    # Calculate text position (centered)
    bbox = draw.multiline_textbbox((0, 0), text, font=font_large if style != "logo" else font_bold)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (VIDEO_WIDTH - text_width) // 2
    y = (VIDEO_HEIGHT - text_height) // 2 - 40

    # Apply fade-in effect
    alpha = min(1.0, progress * 3)  # Fade in during first 33% of segment

    if style == "logo":
        # Logo style - large with accent line
        # Draw accent line
        line_y = y - 30
        line_width = int(300 * alpha)
        line_x = (VIDEO_WIDTH - line_width) // 2
        draw.rectangle([line_x, line_y, line_x + line_width, line_y + 4], fill=ACCENT_COLOR)

        # Main text
        draw.multiline_text((x, y), text, font=font_bold, fill=ACCENT_COLOR, align="center")

        # Tagline
        if tagline:
            tag_bbox = draw.multiline_textbbox((0, 0), tagline, font=font_tagline)
            tag_x = (VIDEO_WIDTH - (tag_bbox[2] - tag_bbox[0])) // 2
            tag_y = y + text_height + 40
            draw.multiline_text((tag_x, tag_y), tagline, font=font_tagline, fill=SUBTITLE_COLOR, align="center")

        # Bottom accent line
        line_y2 = y + text_height + 120 if tagline else y + text_height + 30
        draw.rectangle([line_x, line_y2, line_x + line_width, line_y2 + 4], fill=ACCENT_COLOR)

    elif style == "highlight":
        # Highlighted company name
        draw.multiline_text((x, y), text, font=font_medium, fill=TEXT_COLOR, align="center")
        # Underline effect
        if company:
            underline_y = y + text_height + 10
            draw.rectangle([x, underline_y, x + text_width, underline_y + 3], fill=GOLD_ACCENT)

    elif style == "emphasis":
        # Emphasis style - larger, with accent
        draw.multiline_text((x - 10, y), text, font=font_large, fill=GOLD_ACCENT, align="center")

    elif style == "list":
        # List item with bullet
        bullet_x = x - 40
        bullet_y = y + text_height // 2
        draw.ellipse([bullet_x, bullet_y - 6, bullet_x + 12, bullet_y + 6], fill=ACCENT_COLOR)
        draw.multiline_text((x, y), text, font=font_medium, fill=TEXT_COLOR, align="left")

    else:
        # Standard subtitle
        draw.multiline_text((x, y), text, font=font_medium, fill=TEXT_COLOR, align="center")

    # Add bottom bar
    draw.rectangle([0, VIDEO_HEIGHT - 60, VIDEO_WIDTH, VIDEO_HEIGHT], fill=(5, 5, 10))
    draw.text((50, VIDEO_HEIGHT - 45), "VIZION DZ", font=font_small, fill=ACCENT_COLOR)

    return np.array(img)


def create_video_frames(segment):
    """Create video frames for a segment."""
    text = segment["text"]
    style = segment.get("style", "subtitle")
    duration = segment["duration"]
    company = segment.get("company", False)
    tagline = segment.get("tagline", None)

    def make_frame(t):
        progress = t / duration
        frame = create_frame(text, style, progress, company, tagline)
        return frame

    clip = VideoClip(make_frame, duration=duration).with_fps(FPS)
    return clip


# ============================================================
# STEP 3: Assemble Video
# ============================================================
def assemble_video(audio_path):
    """Assemble all segments into final video."""
    print(f"[2/3] Creating video segments...")

    clips = []
    for i, seg in enumerate(SEGMENTS):
        print(f"  -> Segment {i+1}/{len(SEGMENTS)}: {seg['text'][:30]}...")
        clip = create_video_frames(seg)
        clips.append(clip)

    # Concatenate all clips
    print(f"  -> Concatenating {len(clips)} segments...")
    final_video = concatenate_videoclips(clips, method="compose")

    # Load and trim audio to match video duration
    print(f"[3/3] Adding audio...")
    audio = AudioFileClip(str(audio_path))
    video_duration = final_video.duration

    # If audio is shorter than video, loop it; if longer, trim it
    if audio.duration < video_duration:
        # Loop audio
        loops_needed = int(video_duration / audio.duration) + 1
        from moviepy import concatenate_audioclips
        audio_clips = [audio] * loops_needed
        audio = concatenate_audioclips(audio_clips)
    audio = audio.subclipped(0, video_duration)

    # Combine video and audio
    final = final_video.with_audio(audio)

    # Export
    output_path = OUTPUT_DIR / "VIZION_DZ_Promo.mp4"
    print(f"  -> Rendering to {output_path}...")
    final.write_videofile(
        str(output_path),
        fps=FPS,
        codec="libx264",
        audio_codec="aac",
        bitrate="5000k",
        preset="medium",
        threads=4,
        logger=None,
    )

    # Cleanup
    audio.close()
    final_video.close()
    for clip in clips:
        clip.close()

    print(f"\n✅ Video saved to: {output_path}")
    return output_path


# ============================================================
# MAIN
# ============================================================
if __name__ == "__main__":
    print("=" * 50)
    print("  VIZION DZ - Promotional Video Generator")
    print("=" * 50)
    print()

    # Step 1: Generate voiceover
    audio_path = generate_voiceover()

    # Step 2 & 3: Create and assemble video
    output = assemble_video(audio_path)

    print()
    print("=" * 50)
    print("  DONE!")
    print("=" * 50)
