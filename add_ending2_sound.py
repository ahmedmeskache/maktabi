"""
Ending video SFX: Golden Black Reel Thumbnail (1).mp4 (5s)
Timeline from frame analysis:
 - 0.0-0.7 : logo fades/scales in from dark, glow builds
 - ~0.7     : light flare under logo + 3 social icons pop in (IG/WA/TikTok)
 - 0.8-2.5  : "Your vision, Our creation." + handles type on
 - ~2.5     : "let's work rocket" appears
 - 2.5-5.0  : hold with logo glow shimmer -> ending resolve
Sound:
 - logo glow whoosh+riser, flare ding, 3 icon pops,
 - keyboard typing for tagline/handles, rocket swoosh,
 - final ending boom + gold chime + warm fade tail
"""
import numpy as np
import wave
from pathlib import Path
from moviepy import VideoFileClip, AudioFileClip

SRC = Path(r"C:\Users\ASUS\Downloads\Golden Black Reel Thumbnail (2).mp4")
WAV_OUT = Path(__file__).parent / "temp" / "ending2_sound.wav"
OUT1 = Path(r"C:\Users\ASUS\Downloads\Golden Black Reel Thumbnail (2) with Sound.mp4")
OUT2 = Path(__file__).parent / "output" / "Golden Black Reel Thumbnail (2) with Sound.mp4"

SR = 44100
rng = np.random.default_rng(21)


def place(track, t0, s):
    i0 = int(t0 * SR)
    if i0 >= len(track):
        return
    i1 = min(len(track), i0 + len(s))
    track[i0:i1] += s[:i1 - i0]


def pop(track, t0, freq=880, vol=0.35, decay=16, dur=0.25):
    L = int(dur * SR)
    tt = np.arange(L) / SR
    s = (np.sin(2 * np.pi * freq * tt) * 0.7
         + np.sin(2 * np.pi * freq * 1.5 * tt) * 0.3) * np.exp(-tt * decay) * vol
    s *= np.minimum(1.0, tt * 600)
    place(track, t0, s)


def key_at(track, t0, pitch=1.0, vol=0.42):
    L = int(0.03 * SR)
    k = np.arange(L) / SR
    f0 = (2800 + rng.uniform(-500, 900)) * pitch
    s = (rng.standard_normal(L) * np.exp(-k * 260) * 0.55
         + np.sin(2 * np.pi * f0 * k) * np.exp(-k * 220) * 0.6
         + np.sin(2 * np.pi * (210 + rng.uniform(-30, 60)) * k) * np.exp(-k * 120) * 0.45) * vol
    s *= np.minimum(1.0, k * 800)
    place(track, t0, s)


def main():
    v = VideoFileClip(str(SRC))
    dur = v.duration
    print(f"Video: {dur:.2f}s size={v.size} fps={v.fps}")
    v.close()

    n = int(dur * SR)
    t = np.arange(n) / SR
    hit = 2.55  # ending hit when "let's work" lands

    # ---- logo glow whoosh (0-0.7) ----
    whoosh = np.zeros(n)
    L = int(0.7 * SR)
    x = rng.standard_normal(L)
    k = np.ones(28) / 28
    x = np.convolve(x, k, mode="same")
    env = (np.arange(L) / L) ** 1.8
    whoosh[:L] = x * env * 0.7

    # ---- riser into flare (0-0.7) ----
    riser = np.zeros(n)
    m = t < 0.7
    ph = 2 * np.pi * (300 * t[m] + (700 / 1.4) * t[m] ** 2)
    riser[m] = np.sin(ph) * (t[m] / 0.7) ** 1.5 * 0.12

    # ---- reveal pops: flare + 3 icons ----
    pops = np.zeros(n)
    pop(pops, 0.70, freq=1318, vol=0.38)   # flare ding (bright)
    pop(pops, 0.72, freq=990, vol=0.30)    # IG
    pop(pops, 0.82, freq=880, vol=0.30)    # WhatsApp
    pop(pops, 0.92, freq=784, vol=0.30)    # TikTok
    pop(pops, 2.50, freq=1174, vol=0.34)   # "let's work" lands

    # ---- rocket swoosh for the rocket emoji (~2.5, playful up-sweep) ----
    L = int(0.45 * SR)
    tt = np.arange(L) / SR
    rx = rng.standard_normal(L)
    k = np.ones(16) / 16
    rx = np.convolve(rx, k, mode="same")
    renv = np.sin(np.pi * np.arange(L) / L) ** 1.2
    sweep = np.sin(2 * np.pi * (600 + 1400 * tt / 0.45) * tt) * renv * 0.14
    place(pops, 2.45, rx * renv * 0.30 + sweep)

    # ---- keyboard typing: tagline (0.8-2.5) + handles ----
    keys = np.zeros(n)
    for i in range(26):  # "Your vision, Our creation."
        key_at(keys, 0.80 + i * 0.062, pitch=1.0 + rng.uniform(-0.1, 0.1), vol=0.40)
    for i in range(10):  # "let's work"
        key_at(keys, 2.05 + i * 0.045, pitch=1.1, vol=0.36)
    for i in range(16):  # handles row
        key_at(keys, 1.10 + i * 0.075, pitch=0.92 + rng.uniform(-0.1, 0.1), vol=0.33)
    key_at(keys, 2.52, pitch=0.55, vol=0.6)  # enter thunk on final

    # ---- sub drop into ending hit ----
    drop = np.zeros(n)
    dm = (t >= hit - 0.5) & (t < hit)
    td = t[dm] - (hit - 0.5)
    fq = 200 * (50 / 200) ** (td / 0.5)
    ph = np.cumsum(fq) / SR * 2 * np.pi
    drop[dm] = np.sin(ph) * (td / 0.5) * 0.28

    # ---- ending boom + gold chime (bigger, resolving) ----
    dt = t - hit
    kk = dt >= 0
    d = dt[kk]
    boom = np.zeros(n)
    boom[kk] = (
        1.0 * np.sin(2 * np.pi * 55 * t[kk]) * np.exp(-d * 2.6)
        + 0.5 * np.sin(2 * np.pi * 110 * t[kk]) * np.exp(-d * 4.0)
        + 0.75 * np.sin(2 * np.pi * 36.7 * t[kk]) * np.exp(-d * 2.0)
    )
    boom[kk] += 0.3 * np.exp(-d * 60) * np.sin(2 * np.pi * 180 * t[kk])
    chime = np.zeros(n)
    for i, f in enumerate([130.8 * 16, 156.8 * 16, 196.0 * 16, 261.6 * 16]):
        # warm C-major stack high: C7 Eb? no -> C E G C
        amp = 0.12 / (1 + i * 0.3)
        dec = np.zeros(n)
        dec[kk] = np.exp(-d * (1.4 + i * 0.2))
        atk = np.ones(n)
        atk[kk] = np.minimum(1.0, np.maximum(0, d) * 300)
        chime += np.sin(2 * np.pi * f * t + i * 0.6) * dec * amp * atk
    # song-end shimmer tail: soft high sparkle decaying to silence
    tail = np.zeros(n)
    tail[kk] = np.sin(2 * np.pi * 5232.5 * t[kk]) * np.exp(-d * 2.2) * 0.05

    # ---- warm pad bed under everything ----
    pad = np.zeros(n)
    for f in [110.0, 164.81, 220.0, 277.18]:
        pad += np.sin(2 * np.pi * f * t) * 0.04
    pad *= np.minimum(1.0, t * 3) * np.exp(-t * 0.4)

    mix = whoosh + riser + pops + keys + drop + boom + chime + tail + pad
    mix[:int(0.015 * SR)] *= np.linspace(0, 1, int(0.015 * SR))
    mix[-int(0.7 * SR):] *= np.linspace(1, 0, int(0.7 * SR))  # proper ending fade
    mix /= np.max(np.abs(mix)) / 0.89

    WAV_OUT.parent.mkdir(exist_ok=True, parents=True)
    with wave.open(str(WAV_OUT), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix * 32767).astype(np.int16).tobytes())
    print(f"Sound saved: {WAV_OUT}")

    v = VideoFileClip(str(SRC))
    a = AudioFileClip(str(WAV_OUT))
    final = v.with_audio(a)
    for out in (OUT1, OUT2):
        out.parent.mkdir(exist_ok=True, parents=True)
        print(f"Rendering {out} ...")
        final.write_videofile(str(out), fps=v.fps, codec="libx264",
                              audio_codec="aac", logger=None)
    v.close()
    a.close()
    final.close()
    print("DONE")


if __name__ == "__main__":
    main()
