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
    words, lines, cur = text.split(), [], ""
    for w in words:
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

def feral(card, fonts, poses, out):
    img = Image.new("RGB", (W, H), "#100E0B"); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 14], fill="#FFB020")
    lab = font(fonts["mono"], 30)
    d.text((72, 72), "FERAL WATT", font=lab, fill="#9C9385")
    f, lines, size = fit_headline(d, card["headline"].upper(), fonts["barlowc"], 500, 420, 140, lh=0.98)
    y = 170
    for l in lines:
        d.text((72, y), l, font=f, fill="#F3EDE2"); y += int(size * 0.98)
    if card.get("sub"):
        sf = font(fonts["barlow"], 38); y += 24
        for l in wrap(d, card["sub"], sf, 480):
            d.text((72, y), l, font=sf, fill="#9C9385"); y += 50
    pose = Image.open(os.path.join(poses, f"static-{card['pose']}@2x.png")).convert("RGBA")
    pose.thumbnail((470, 470))
    img.paste(pose, (W - pose.width - 30, H - pose.height - 90), pose)
    d.rectangle([72, H - 120, 72 + 64, H - 114], fill="#FFB020")
    d.text((72, H - 100), "Not cute. Correct.  feralwatt.com", font=font(fonts["mono"], 28), fill="#F3EDE2")
    img.save(os.path.join(out, card["slug"] + ".png"))

def howdy(card, fonts, logo, out):
    img = Image.new("RGB", (W, H), "#F6EAD0"); d = ImageDraw.Draw(img)
    d.rectangle([0, H - 210, W, H], fill="#1C3D5A")
    d.rectangle([72, 120, 72 + 120, 132], fill="#D6452B")
    f, lines, size = fit_headline(d, card["headline"], fonts["bricolage"], 936, 470, 130, var="ExtraBold", lh=1.05)
    y = 170
    for l in lines:
        d.text((72, y), l, font=f, fill="#1C3D5A"); y += int(size * 1.05)
    if card.get("sub"):
        sf = font(fonts["dmsans"], 42, "Medium"); y += 28
        for l in wrap(d, card["sub"], sf, 900):
            d.text((72, y), l, font=sf, fill="#14202B"); y += 56
    lg = Image.open(logo).convert("RGBA"); lg.thumbnail((520, 140))
    img.paste(lg, (72, H - 105 - lg.height // 2), lg)
    tf = font(fonts["dmsans"], 36, "SemiBold")
    t = "Y'all settled?"
    d.text((W - 72 - d.textlength(t, font=tf), H - 125), t, font=tf, fill="#F6EAD0")
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
