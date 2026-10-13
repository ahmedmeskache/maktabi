"""
VIZION DZ - Modern website promo montage (vertical Reel/TikTok, ~27s)
Footage: past projects (Recording desktop + document mobile + golden thumbnail)
Style: fast cuts, punch zooms, flash transitions, modern bed + SFX
"""
import numpy as np
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from moviepy import (VideoFileClip, VideoClip, ImageClip, ColorClip,
                     CompositeVideoClip, AudioFileClip, concatenate_videoclips)

W, H, FPS = 1080, 1920, 30
OUT = Path(__file__).parent / "output" / "VIZION_DZ_Website_Montage.mp4"
WAV = Path(__file__).parent / "temp" / "montage_audio.wav"

THUMB = Path(r"C:\Users\ASUS\Downloads\Golden Black Reel Thumbnail.mp4")
REC = Path(r"C:\Users\ASUS\Downloads\Recording 2026-08-20 183620 (1).mp4")
MOB = Path(r"C:\Users\ASUS\Downloads\document_5832263166435795625.mp4")

# ---------- helpers ----------
def cover_vertical(clip):
    """Resize + center-crop to exactly 1080x1920."""
    w, h = clip.size
    scale = max(W / w, H / h)
    clip = clip.resized((int(w * scale), int(h * scale)))
    return clip.cropped(x_center=clip.size[0] / 2, y_center=clip.size[1] / 2,
                        width=W, height=H)

def punch(clip, zoom=1.1):
    """Static punch-in: upscale then crop back (cheap zoom-cut feel)."""
    w, h = clip.size
    clip = clip.resized((int(w * zoom), int(h * zoom)))
    return clip.cropped(x_center=clip.size[0] / 2, y_center=clip.size[1] / 2,
                        width=w, height=h)

def flash(dur=0.12):
    return ColorClip(size=(W, H), color=(255, 240, 210), duration=dur)

def load_font(size, bold=False):
    try:
        name = "arialbd.ttf" if bold else "arial.ttf"
        return ImageFont.truetype(name, size)
    except Exception:
        return ImageFont.load_default()

def gold_bg_image():
    arr = np.zeros((H, W, 3), dtype=np.uint8)
    for x in range(W):
        r = x / W
        arr[:, x, 0] = int(10 + (190 - 10) * r)    # dark -> gold
        arr[:, x, 1] = int(10 + (140 - 10) * r)
        arr[:, x, 2] = int(15 + (40 - 15) * r)
    return Image.fromarray(arr)

GOLD_BG = gold_bg_image()

def title_card(lines, dur, sub=None):
    f_big = load_font(110, bold=True)
    f_sub = load_font(52)
    def make(t):
        img = GOLD_BG.copy()
        d = ImageDraw.Draw(img)
        # typing reveal: chars shown grow with t
        full = "\n".join(lines)
        n_chars = int(len(full) * min(1.0, t / (dur * 0.6)))
        shown = full[:n_chars]
        bbox = d.multiline_textbbox((0, 0), shown or " ", font=f_big)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        d.multiline_text(((W - tw) / 2, H / 2 - th / 2 - 40), shown,
                         font=f_big, fill=(255, 245, 220), align="center")
        if sub and t > dur * 0.55:
            sb = d.textbbox((0, 0), sub, font=f_sub)
            d.text(((W - (sb[2] - sb[0])) / 2, H / 2 + th / 2 + 30),
                   sub, font=f_sub, fill=(20, 15, 5))
        d.rectangle([90, H - 140, W - 90, H - 132], fill=(20, 15, 5))
        d.text((90, H - 220), "VIZION DZ", font=f_sub, fill=(20, 15, 5))
        return np.array(img)
    return VideoClip(make, duration=dur).with_fps(FPS)

def caption_bar(clip, text):
    """Bottom caption baked via composite of a PIL strip."""
    f = load_font(44, bold=True)
    strip = Image.new("RGB", (W, 130), (8, 8, 12))
    d = ImageDraw.Draw(strip)
    d.rectangle([0, 0, W, 6], fill=(212, 175, 55))
    bb = d.textbbox((0, 0), text, font=f)
    d.text(((W - (bb[2] - bb[0])) / 2, 35), text, font=f, fill=(255, 240, 210))
    bar = ImageClip(np.array(strip), duration=clip.duration).with_position(("center", H - 160))
    return CompositeVideoClip([clip, bar], size=(W, H)).with_fps(FPS)

# ---------- build video ----------
print("Loading sources...")
thumb = VideoFileClip(str(THUMB))
rec = VideoFileClip(str(REC))
mob = VideoFileClip(str(MOB))

parts = []
# 1. HOOK 0-2.6s : logo reveal
parts.append(cover_vertical(thumb.subclipped(0, 2.6)))
parts.append(flash())
# 2. DESKTOP showcase with punch cuts (Recording = Niproflex site)
takes = [(1.0, 3.2, "SITE VITRINE  •  MODERNE", 1.0),
         (4.0, 6.2, "DESIGN PRO  •  QUI VEND", 1.1),
         (7.0, 9.4, "100% RESPONSIVE", 1.18)]
for a, b, cap, z in takes:
    c = cover_vertical(rec.subclipped(a, b))
    c = punch(c, z)
    parts.append(caption_bar(c, cap))
    parts.append(flash(0.08))
# 3. MOBILE showcase (document = mobile scroll)
mtakes = [(5.0, 7.5, "PARFAIT SUR MOBILE", 1.0),
          (18.0, 20.5, "RAPIDE  •  SECURISE", 1.12),
          (30.0, 33.0, "PENSE POUR VOS CLIENTS", 1.2)]
for a, b, cap, z in mtakes:
    c = cover_vertical(mob.subclipped(a, b))
    c = punch(c, z)
    parts.append(caption_bar(c, cap))
    parts.append(flash(0.08))
# 4. TITLE cards
parts.append(title_card(["SITES", "MODERNES"], 1.6, sub="VIZION DZ"))
parts.append(title_card(["RAPIDE.", "SECURISE."], 1.6, sub="VOTRE IMAGE MERITE MIEUX"))
# 5. CTA: thumbnail end card (freeze last frames area)
parts.append(cover_vertical(thumb.subclipped(2.0, 5.0)))

print(f"Concatenating {len(parts)} parts...")
video = concatenate_videoclips(parts, method="compose")
print(f"Total duration: {video.duration:.1f}s")

# ---------- audio: modern bed + sfx ----------
SR = 44100
n = int(video.duration * SR)
tt = np.arange(n) / SR
rng = np.random.default_rng(5)

# modern bed: 126 BPM four-floor kick + hats + bass
bpm, beat = 126.0, 60.0 / 126.0
kick = np.zeros(n)
for bt in np.arange(0, video.duration, beat):
    i0 = int(bt * SR)
    L = int(0.22 * SR)
    k = np.arange(L) / SR
    s = np.sin(2 * np.pi * (55 - 25 * k / 0.22) * k) * np.exp(-k * 18)
    i1 = min(n, i0 + L)
    kick[i0:i1] += s[:i1 - i0] * 0.55
hat = np.zeros(n)
for ht in np.arange(beat / 2, video.duration, beat / 2):
    i0 = int(ht * SR)
    L = int(0.05 * SR)
    s = rng.standard_normal(L) * np.exp(-np.arange(L) / SR * 220) * 0.18
    i1 = min(n, i0 + L)
    hat[i0:i1] += s[:i1 - i0]
# bassline A1 groove
bass_notes = [55, 55, 65.41, 82.41]
bass = np.zeros(n)
bar = beat * 4
for bi, f in enumerate(bass_notes):
    for rep in range(int(video.duration / bar) + 1):
        t0 = rep * bar + bi * beat
        i0 = int(t0 * SR)
        L = int(beat * 0.9 * SR)
        if i0 >= n:
            break
        k = np.arange(min(L, n - i0)) / SR
        bass[i0:i0 + len(k)] += (np.sin(2 * np.pi * f * k)
                                 + 0.4 * np.sin(2 * np.pi * f * 2 * k)) * np.exp(-k * 3) * 0.22
bed = (kick + hat + bass) * 0.8
bed *= np.minimum(1, tt * 2)  # intro fade

# SFX: whoosh on each flash/cut + pops + keyboard on titles + booms
def whoosh_at(t0, dur=0.35, vol=0.5):
    L = int(dur * SR)
    i0 = int(t0 * SR)
    if i0 >= n:
        return np.zeros(0), 0
    x = rng.standard_normal(L)
    k = np.ones(20) / 20
    x = np.convolve(x, k, mode="same")
    env = np.sin(np.pi * np.arange(L) / L)
    return i0, (x * env * vol)

sfx = np.zeros(n)
cuts = [2.6]
acc = 2.6
for p in parts[2:]:
    acc += p.duration
    cuts.append(acc)
for c in cuts:
    i0, s = whoosh_at(max(0, c - 0.3))
    i1 = min(n, i0 + len(s))
    sfx[i0:i1] += s[:i1 - i0]
    # pop on cut
    L = int(0.15 * SR)
    k = np.arange(L) / SR
    i0 = int(min(c, video.duration - 0.01) * SR)
    i1 = min(n, i0 + L)
    sfx[i0:i1] += np.sin(2 * np.pi * 1200 * k[:i1 - i0]) * np.exp(-k[:i1 - i0] * 30) * 0.3

# keyboard during title cards
def key_at(t0, vol=0.4):
    L = int(0.03 * SR)
    k = np.arange(L) / SR
    s = (rng.standard_normal(L) * np.exp(-k * 250) * 0.6
         + np.sin(2 * np.pi * 3000 * k) * np.exp(-k * 220) * 0.5) * vol
    i0 = int(t0 * SR)
    i1 = min(n, i0 + L)
    if i0 < n:
        sfx[i0:i1] += s[:i1 - i0]

t_titles = sum(p.duration for p in parts[:-3])
for i in range(24):
    key_at(t_titles + 0.2 + i * 0.12)

# booms: hook lock + final CTA
for bt in (0.9, t_titles + 3.4):
    d = tt - bt
    m = d >= 0
    boom = np.zeros(n)
    boom[m] = (0.8 * np.sin(2 * np.pi * 55 * tt[m]) * np.exp(-d[m] * 3)
               + 0.4 * np.sin(2 * np.pi * 110 * tt[m]) * np.exp(-d[m] * 5))
    sfx += boom * 0.9

mix = bed + sfx
mix /= np.max(np.abs(mix)) / 0.89
mix[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))
mix[-int(0.5 * SR):] *= np.linspace(1, 0, int(0.5 * SR))

import wave
WAV.parent.mkdir(exist_ok=True, parents=True)
with wave.open(str(WAV), "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())

final = video.with_audio(AudioFileClip(str(WAV)))
OUT.parent.mkdir(exist_ok=True, parents=True)
final.write_videofile(str(OUT), fps=FPS, codec="libx264", audio_codec="aac",
                      preset="fast", logger=None)
print(f"DONE -> {OUT} ({video.duration:.1f}s)")
