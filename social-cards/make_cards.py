"""Free social card generator for Vee's brands (no AI credits, no Canva).
Usage: python3 make_cards.py cards.json OUT_DIR FONT_DIR POSE_DIR
cards.json: [{"brand": "Feral Watt"|"Howdy Move", "slug": "...", "headline": "...", "sub": "...", "pose": "reading"}]
"""
import json, sys, os, textwrap
from PIL import Image, ImageDraw, ImageFont

W = H = 1080
HERE = os.path.dirname(os.path.abspath(__file__))

def font(path, size, var=None):
    f = ImageFont.truetype(path, size)
    if var:
        try: f.set_variation_by_name(var)
        except Exception: pass
    return f

def wrap(draw, text, f, max_w):
    lines = []
    for part in text.split("\n"):  # "\n" in a headline forces a line break
        cur = ""
        for w in part.split():
            t = (cur + " " + w).strip()
            if draw.textlength(t, font=f) <= max_w: cur = t
            else: lines.append(cur); cur = w
        if cur: lines.append(cur)
    return lines

def fit_headline(draw, text, path, max_w, max_h, start, var=None, lh=1.0):
    size = start
    while size > 40:
        f = font(path, size, var)
        lines = wrap(draw, text, f, max_w)
        h = len(lines) * size * lh
        if h <= max_h and all(draw.textlength(l, font=f) <= max_w for l in lines):
            return f, lines, size
        size -= 4
    f = font(path, size, var); return f, wrap(draw, text, f, max_w), size

def sub_fit(d, text, path, max_w, max_h, start, var=None, lh=1.28, floor=40):
    size = start
    while True:
        f = font(path, size, var)
        lines = wrap(d, text, f, max_w)
        if len(lines) * size * lh <= max_h or size <= floor:
            return f, lines, size
        size -= 2

# Sizes tuned for a 1080x1080 card read on a phone feed (Nov 13, 2026):
# label 40, headline up to 150 across the full width, subline 52 to 60, footer 38.
def feral(card, fonts, poses, out):
    img = Image.new("RGB", (W, H), "#100E0B"); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 16], fill="#FFB020")
    d.text((72, 66), "FERAL WATT", font=font(fonts["mono"], 40), fill="#FFB020")
    pose = Image.open(os.path.join(poses, f"static-{card['pose']}@2x.png")).convert("RGBA")
    pose.thumbnail((440, 440))
    px, py = W - pose.width - 36, H - pose.height - 120
    f, lines, size = fit_headline(d, card["headline"].upper(), fonts["barlowc"], 936, py - 170, 150, lh=0.98)
    y = 140
    for l in lines:
        d.text((72, y), l, font=f, fill="#F3EDE2"); y += int(size * 0.98)
    if card.get("sub"):
        y += 44
        sf, sl, ss = sub_fit(d, card["sub"], fonts["barlow"], px - 72 - 30, H - 150 - y, 60, floor=44)
        for l in sl:
            d.text((72, y), l, font=sf, fill="#E4DCCD"); y += int(ss * 1.28)
    img.paste(pose, (px, py), pose)
    ff = font(fonts["mono"], 38)
    d.rectangle([72, H - 128, 72 + 72, H - 121], fill="#FFB020")
    d.text((72, H - 104), "Not cute. Correct.", font=ff, fill="#F3EDE2")
    t = "feralwatt.com"
    d.text((W - 72 - d.textlength(t, font=ff), H - 104), t, font=ff, fill="#FFB020")
    if card.get("disclosure"):  # paid ads only: broker's registered name, small (16 TAC 25.486)
        d.text((72, H - 48), card["disclosure"], font=font(fonts["barlow"], 24), fill="#9C9385")
    img.save(os.path.join(out, card["slug"] + ".png"))

def howdy(card, fonts, logo, out):
    img = Image.new("RGB", (W, H), "#F6EAD0"); d = ImageDraw.Draw(img)
    band = 210
    d.rectangle([0, H - band, W, H], fill="#1C3D5A")
    f, lines, size = fit_headline(d, card["headline"], fonts["bricolage"], 936, 470, 136, var="ExtraBold", lh=1.05)
    blocks = int(len(lines) * size * 1.05)
    sf = sl = None; ss = 0
    if card.get("sub"):
        sf, sl, ss = sub_fit(d, card["sub"], fonts["dmsans"], 936, 260, 56, var="Medium", lh=1.3, floor=44)
        blocks += 36 + int(len(sl) * ss * 1.3)
    top = 60 + 12 + 40
    avail = H - band - top - 60
    y = top + max(0, (avail - blocks) // 2)
    d.rectangle([72, y - 52, 72 + 120, y - 40], fill="#D6452B")
    for l in lines:
        d.text((72, y), l, font=f, fill="#1C3D5A"); y += int(size * 1.05)
    if sl:
        y += 36
        for l in sl:
            d.text((72, y), l, font=sf, fill="#14202B"); y += int(ss * 1.3)
    lg = Image.open(logo).convert("RGBA"); lg.thumbnail((540, 150))
    img.paste(lg, (72, H - band // 2 - lg.height // 2), lg)
    tf = font(fonts["dmsans"], 46, "SemiBold")
    t = "Y'all settled?"
    d.text((W - 72 - d.textlength(t, font=tf), H - band // 2 - 30), t, font=tf, fill="#F6EAD0")
    img.save(os.path.join(out, card["slug"] + ".png"))

if __name__ == "__main__":
    cards_path, out, fdir, pdir = sys.argv[1:5]
    os.makedirs(out, exist_ok=True)
    fonts = {"barlowc": f"{fdir}/BarlowCondensed-Bold.ttf.ttf", "barlow": f"{fdir}/Barlow-Medium.ttf.ttf",
             "mono": f"{fdir}/IBMPlexMono-Medium.ttf.ttf", "bricolage": f"{fdir}/BricolageGrotesque.ttf", "dmsans": f"{fdir}/DMSans.ttf"}
    logo = os.path.join(HERE, "..", "howdy-move", "png", "howdymove-logo-horizontal-reverse.png")
    for c in json.load(open(cards_path)):
        (feral if c["brand"] == "Feral Watt" else lambda c, f, p, o: howdy(c, f, logo, o))(c, fonts, pdir, out)
        print("made", c["slug"])
