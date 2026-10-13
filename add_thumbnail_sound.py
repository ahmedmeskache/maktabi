"""
Golden Black Reel Thumbnail - luxury reveal + keyboard typing SFX (v2)
Timeline matched to actual video motion (0-1.8s action, 1.8-5s hold):
 - 0.00-0.55 : logo wipe up -> silky whoosh
 - ~0.55      : divider lines pop
 - 0.60-0.95  : "ONE OF OUR" types on -> keyboard clicks
 - 0.95-1.20  : "CREATIONS" glitch-reveal -> clicks + digital tick + slide whoosh
 - 1.15-1.32  : "ENJOY" -> clicks + soft ding
 - 1.25-1.80  : social handles + phone number typing -> fast keyboard run
 - ~1.80      : final lock-in -> deep boom + gold shimmer chime
 - 1.80-5.00  : warm luxury tail
"""
import numpy as np
import wave
from pathlib import Path
from moviepy import VideoFileClip, AudioFileClip

SRC = Path(r"C:\Users\ASUS\Downloads\Golden Black Reel Thumbnail.mp4")
WAV_OUT = Path(__file__).parent / "temp" / "thumbnail_reveal_sound.wav"
OUT1 = Path(r"C:\Users\ASUS\Downloads\Golden Black Reel Thumbnail with Sound.mp4")
OUT2 = Path(__file__).parent / "output" / "Golden Black Reel Thumbnail with Sound.mp4"

SR = 44100
rng = np.random.default_rng(11)


def key_click(t0, pitch=1.0, vol=0.5, bright=True):
    """One mechanical keyboard keystroke (~25ms): click + thock."""
    L = int(0.035 * SR)
    tt = np.arange(L) / SR
    # click: highpassed noise burst, pitch-varied
    noise = rng.standard_normal(L)
    # resonant band around 2.5-4.5kHz * pitch
    f0 = (2800 + rng.uniform(-500, 900)) * pitch
    tone = np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 220)
    click = noise * np.exp(-tt * 260) * 0.6 + tone * 0.7
    # thock: low-mid body ~180-300Hz
    f1 = (210 + rng.uniform(-30, 60)) * (0.9 + 0.2 * pitch)
    thock = np.sin(2 * np.pi * f1 * tt) * np.exp(-tt * 120) * 0.5
    s = (click + thock) * vol
    if bright:
        s += 0.15 * vol * np.sin(2 * np.pi * 5200 * pitch * tt) * np.exp(-tt * 300)
    # tiny fade to avoid clicks
    s *= np.minimum(1.0, tt * 800) * np.exp(-tt * 8)
    return t0, s


def place(track, t0, s):
    i0 = int(t0 * SR)
    i1 = min(len(track), i0 + len(s))
    if i0 < len(track):
        track[i0:i1] += s[: i1 - i0]


def typing_run(track, t_start, t_end, n_keys, vol=0.5, pitch_base=1.0):
    """Evenly spaced keystrokes with human jitter."""
    ts = np.linspace(t_start, t_end, n_keys)
    ts += rng.uniform(-0.008, 0.008, size=n_keys)
    for k, t0 in enumerate(ts):
        if t0 < 0:
            continue
        pitch = pitch_base + rng.uniform(-0.12, 0.12)
        _, s = key_click(t0, pitch=pitch, vol=vol * rng.uniform(0.85, 1.15))
        place(track, t0, s)
    return ts


def pop(track, t0, freq=880, vol=0.4, decay=18):
    """Short UI pop / reveal blip."""
    L = int(0.25 * SR)
    tt = np.arange(L) / SR
    s = (np.sin(2 * np.pi * freq * tt) * 0.7
         + np.sin(2 * np.pi * freq * 1.5 * tt) * 0.3) * np.exp(-tt * decay) * vol
    s *= np.minimum(1.0, tt * 500)
    place(track, t0, s)


def whoosh_event(track, t0, dur, vol=0.5, reverse=False):
    """Small airy whoosh for text slides."""
    L = int(dur * SR)
    tt = np.arange(L) / SR
    noise = rng.standard_normal(L)
    k = np.ones(24) / 24
    smooth = np.convolve(noise, k, mode="same")
    env = np.sin(np.pi * tt / dur) ** 1.5  # swell in/out
    if reverse:
        env = env[::-1]
    s = smooth * env * vol
    place(track, t0, s)


def main():
    video = VideoFileClip(str(SRC))
    dur = video.duration
    print(f"Video: duration={dur:.2f}s size={video.size} fps={video.fps}")
    video.close()

    n = int(dur * SR)
    t = np.arange(n) / SR
    hit = 1.80  # final lock-in moment

    # ============ BASE: logo whoosh + riser + boom + shimmer (from v1, retimed) ====
    noise = rng.standard_normal(n)
    kernel = np.ones(32) / 32
    smooth = np.convolve(noise, kernel, mode="same")
    env = np.zeros(n)
    pre = t < 0.55
    env[pre] = (t[pre] / 0.55) ** 2.0
    env[~pre] = np.exp(-(t[~pre] - 0.55) * 7)
    whoosh_logo = smooth * env * 0.85

    # long tension riser 0 -> hit
    riser = np.zeros(n)
    m = t < hit
    phase = 2 * np.pi * (280 * t[m] + (950 / (2 * hit)) * t[m] ** 2)
    riser[m] = np.sin(phase) * (t[m] / hit) ** 1.6 * 0.11

    # sub drop into final hit
    drop = np.zeros(n)
    dm = (t >= hit - 0.5) & (t < hit)
    td = t[dm] - (hit - 0.5)
    freq = 200 * (50 / 200) ** (td / 0.5)
    ph = np.cumsum(freq) / SR * 2 * np.pi
    drop[dm] = np.sin(ph) * (td / 0.5) * 0.28

    # deep boom at hit
    dt = t - hit
    k = dt >= 0
    d = dt[k]
    boom = np.zeros(n)
    boom[k] = (
        0.9 * np.sin(2 * np.pi * 55 * t[k]) * np.exp(-d * 3.0)
        + 0.45 * np.sin(2 * np.pi * 110 * t[k]) * np.exp(-d * 4.5)
        + 0.7 * np.sin(2 * np.pi * 36.7 * t[k]) * np.exp(-d * 2.2)
    )
    boom[k] += 0.35 * np.exp(-d * 60) * np.sin(2 * np.pi * 180 * t[k])

    # gold shimmer chime
    chime = np.zeros(n)
    for i, f in enumerate([1567.98, 2093.0, 2637.02, 3135.96, 4186.01]):
        amp = 0.13 / (1 + i * 0.35)
        dec = np.zeros(n)
        dec[k] = np.exp(-d * (1.6 + i * 0.25))
        atk = np.ones(n)
        atk[k] = np.minimum(1.0, np.maximum(0, d) * 300)
        chime += np.sin(2 * np.pi * f * t + i * 0.7) * dec * amp * atk

    # warm pad tail
    pad = np.zeros(n)
    for f in [110.0, 164.81, 220.0, 277.18]:
        pad += np.sin(2 * np.pi * f * t) * 0.045
    pad *= np.minimum(1.0, t * 3) * np.exp(-t * 0.32)

    # ============ NEW: keyboard + reveal extras ============
    keys = np.zeros(n)
    # "ONE OF OUR" (10 chars)
    typing_run(keys, 0.60, 0.92, 10, vol=0.55, pitch_base=1.0)
    # "CREATIONS" (9 chars, slightly lower/faster + glitch ticks)
    typing_run(keys, 0.95, 1.18, 9, vol=0.55, pitch_base=0.92)
    # "ENJOY" (5 chars)
    typing_run(keys, 1.15, 1.32, 5, vol=0.60, pitch_base=1.08)
    # handles: VISON DZ1 / VISION DZ1 runs
    typing_run(keys, 1.25, 1.55, 14, vol=0.45, pitch_base=1.0)
    # phone number: fast run
    typing_run(keys, 1.45, 1.78, 14, vol=0.45, pitch_base=0.95)
    # Enter keys at end of each line (deeper thunk)
    for et in (0.93, 1.19, 1.33, 1.79):
        _, s = key_click(et, pitch=0.55, vol=0.65)
        place(keys, et, s)

    reveals = np.zeros(n)
    pop(reveals, 0.55, freq=660, vol=0.35)    # divider lines
    pop(reveals, 0.60, freq=990, vol=0.30)    # ONE OF OUR in
    whoosh_event(reveals, 0.55, 0.30, vol=0.35)
    whoosh_event(reveals, 0.90, 0.30, vol=0.45)  # CREATIONS slide
    # glitch ticks for CREATIONS distortion frames
    for gt in (0.98, 1.04, 1.10):
        pop(reveals, gt, freq=float(rng.uniform(1800, 3200)), vol=0.16, decay=40)
    pop(reveals, 1.15, freq=1174, vol=0.32)   # ENJOY
    pop(reveals, 1.25, freq=880, vol=0.25)    # socials start
    pop(reveals, 1.45, freq=740, vol=0.25)    # phone start
    pop(reveals, 1.80, freq=1318, vol=0.35)   # final lock ding
    whoosh_event(reveals, 1.60, 0.25, vol=0.25)

    mix = whoosh_logo + riser + drop + boom + chime + pad + keys + reveals

    fade_in = int(0.015 * SR)
    fade_out = int(0.6 * SR)
    mix[:fade_in] *= np.linspace(0, 1, fade_in)
    mix[-fade_out:] *= np.linspace(1, 0, fade_out)

    peak = np.max(np.abs(mix))
    mix = mix / peak * 0.89
    print(f"peak before norm: {peak:.3f}")

    WAV_OUT.parent.mkdir(exist_ok=True, parents=True)
    with wave.open(str(WAV_OUT), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix * 32767).astype(np.int16).tobytes())
    print(f"Sound saved: {WAV_OUT}")

    video = VideoFileClip(str(SRC))
    audio = AudioFileClip(str(WAV_OUT))
    final = video.with_audio(audio)
    for out in (OUT1, OUT2):
        out.parent.mkdir(exist_ok=True, parents=True)
        print(f"Rendering {out} ...")
        final.write_videofile(str(out), fps=video.fps, codec="libx264",
                              audio_codec="aac", logger=None)
    video.close()
    audio.close()
    final.close()
    print("DONE")


if __name__ == "__main__":
    main()
