"""Free social card generator for Vee's brands (no AI credits, no Canva).
Usage: python3 make_cards.py cards.json OUT_DIR FONT_DIR POSE_DIR
cards.json: [{"brand": "Feral Watt"|"Howdy Move", "slug": "...", "headline": "...", "sub": "...", "pose": "reading", "style": "poster"}]
Feral Watt styles: poster (default), bill, split, amber, myth, vee. See each fw_* function for its fields.
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
    img.save(os.path.join(out, card["slug"] + ".png")); img.convert("RGB").save(os.path.join(out, card["slug"] + ".jpg"), "JPEG", quality=90)


# ---- Extra Feral Watt styles (added Nov 13, 2026, so the feed doesn't look the same every post) ----
# Pick with "style" in cards.json: poster (default, above), bill, split, amber, myth, vee.
# All use only Brand Kit colors and fonts. Static art is the approved pose set, unchanged.
INK, SURF, TEXT, MUTED, AMBER, PAPER = "#100E0B", "#1B1815", "#F3EDE2", "#9C9385", "#FFB020", "#F3EDE2"

def _pose(poses, name, box):
    p = Image.open(os.path.join(poses, f"static-{name}@2x.png")).convert("RGBA"); p.thumbnail(box); return p

def _footer(d, fonts, fg, accent, y=None):
    ff = font(fonts["mono"], 36); y = H - 96 if y is None else y
    d.text((72, y), "Not cute. Correct.", font=ff, fill=fg)
    t = "feralwatt.com"; d.text((W - 72 - d.textlength(t, font=ff), y), t, font=ff, fill=accent)

def fw_bill(card, fonts, poses, out):
    """Cream paper 'bill' with highlighted line items. card: headline, items [3], pose."""
    img = Image.new("RGB", (W, H), INK); d = ImageDraw.Draw(img)
    d.rounded_rectangle([60, 60, W - 60, H - 150], 18, fill=PAPER)
    mono = font(fonts["mono"], 34)
    d.text((110, 100), "FERAL WATT  /  BILL, DECODED", font=mono, fill="#6B6358")
    for x in range(110, W - 110, 24): d.line([x, 160, x + 12, 160], fill="#B8AE9E", width=3)
    f, lines, size = fit_headline(d, card["headline"].upper(), fonts["barlowc"], W - 220, 260, 120, lh=0.98)
    y = 190
    for l in lines: d.text((110, y), l, font=f, fill=INK); y += int(size * 0.98)
    y += 30
    item_f = font(fonts["barlow"], 50)
    pose = _pose(poses, card.get("pose", "reading"), (300, 300))
    for i, it in enumerate(card.get("items", [])):
        w = d.textlength(it, font=item_f)
        d.rectangle([104, y + 8, 104 + 60 + w + 16, y + 64], fill=AMBER)
        d.text((110, y), f"{i+1}.", font=item_f, fill=INK)
        d.text((170, y), it, font=item_f, fill=INK); y += 92
    img.paste(pose, (W - 60 - pose.width - 20, H - 150 - pose.height - 10), pose)
    _footer(d, fonts, TEXT, AMBER)
    img.save(os.path.join(out, card["slug"] + ".png")); img.convert("RGB").save(os.path.join(out, card["slug"] + ".jpg"), "JPEG", quality=90)

def fw_split(card, fonts, poses, out):
    """Two panels side by side. card: headline, left {title, text}, right {title, text}, pose."""
    img = Image.new("RGB", (W, H), INK); d = ImageDraw.Draw(img)
    f, lines, size = fit_headline(d, card["headline"].upper(), fonts["barlowc"], W - 144, 230, 120, lh=0.98)
    y = 70
    for l in lines: d.text((72, y), l, font=f, fill=TEXT); y += int(size * 0.98)
    top = y + 40; bottom = H - 330; mid = W // 2
    for i, side in enumerate([card["left"], card["right"]]):
        x0 = 72 if i == 0 else mid + 12; x1 = mid - 12 if i == 0 else W - 72
        fill = SURF if i == 0 else AMBER; fg = TEXT if i == 0 else INK
        d.rounded_rectangle([x0, top, x1, bottom], 16, fill=fill)
        tf = font(fonts["barlowc"], 92); d.text((x0 + 32, top + 28), side["title"].upper(), font=tf, fill=fg if i else AMBER)
        sf, sl, ss = sub_fit(d, side["text"], fonts["barlow"], x1 - x0 - 64, bottom - top - 170, 46, floor=34)
        yy = top + 150
        for l in sl: d.text((x0 + 32, yy), l, font=sf, fill=fg); yy += int(ss * 1.28)
    pose = _pose(poses, card.get("pose", "meh"), (220, 220))
    img.paste(pose, (W - 60 - pose.width, H - 120 - pose.height + 10), pose)
    if card.get("sub"):
        sf, sl, ss = sub_fit(d, card["sub"], fonts["barlow"], W - 144 - 280, 150, 46, floor=36)
        yy = bottom + 40
        for l in sl: d.text((72, yy), l, font=sf, fill=TEXT); yy += int(ss * 1.28)
    _footer(d, fonts, TEXT, AMBER)
    img.save(os.path.join(out, card["slug"] + ".png")); img.convert("RGB").save(os.path.join(out, card["slug"] + ".jpg"), "JPEG", quality=90)

def fw_amber(card, fonts, poses, out):
    """Full amber background, dark type. Loud. card: headline, sub, pose."""
    img = Image.new("RGB", (W, H), AMBER); d = ImageDraw.Draw(img)
    d.text((72, 66), "FERAL WATT", font=font(fonts["mono"], 40), fill=INK)
    pose = _pose(poses, card.get("pose", "approves"), (360, 360))
    f, lines, size = fit_headline(d, card["headline"].upper(), fonts["barlowc"], W - 144, 380, 170, lh=0.95)
    y = 140
    for l in lines: d.text((72, y), l, font=f, fill=INK); y += int(size * 0.95)
    if card.get("sub"):
        y += 36
        sf, sl, ss = sub_fit(d, card["sub"], fonts["barlow"], W - 72 - pose.width - 100, H - 150 - y, 56, floor=40)
        for l in sl: d.text((72, y), l, font=sf, fill=INK); y += int(ss * 1.28)
    d.rectangle([0, H - 140, W, H], fill=INK)
    img.paste(pose, (W - pose.width - 30, H - 140 - pose.height + 30), pose)
    _footer(d, fonts, TEXT, AMBER, y=H - 92)
    img.save(os.path.join(out, card["slug"] + ".png")); img.convert("RGB").save(os.path.join(out, card["slug"] + ".jpg"), "JPEG", quality=90)

def fw_myth(card, fonts, poses, out):
    """Myth or Fact quiz card with two answer boxes. card: statement, pose."""
    img = Image.new("RGB", (W, H), SURF); d = ImageDraw.Draw(img)
    for x in range(-H, W, 60): d.line([x, 0, x + H, H], fill="#221E1A", width=18)
    big = font(fonts["barlowc"], 150)
    d.text((72, 60), "MYTH", font=big, fill=TEXT)
    w = d.textlength("MYTH ", font=big); d.text((72 + w, 60), "OR", font=big, fill=MUTED)
    d.text((72, 200), "FACT?", font=big, fill=AMBER)
    d.rounded_rectangle([72, 400, W - 72, 680], 20, fill=PAPER)
    sf, sl, ss = sub_fit(d, "“" + card["statement"] + "”", fonts["barlow"], W - 144 - 80, 230, 58, floor=40)
    yy = 400 + (280 - int(len(sl) * ss * 1.28)) // 2
    for l in sl: d.text((112, yy), l, font=sf, fill=INK); yy += int(ss * 1.28)
    bf = font(fonts["barlowc"], 70)
    for i, (lab, col) in enumerate([("MYTH", TEXT), ("FACT", AMBER)]):
        x0 = 72 + i * 270
        d.rounded_rectangle([x0, 730, x0 + 240, 840], 14, outline=col, width=5)
        d.text((x0 + 120 - d.textlength(lab, font=bf) / 2, 742), lab, font=bf, fill=col)
    d.text((72, 860), "Answer in the comments.", font=font(fonts["barlow"], 40), fill=MUTED)
    pose = _pose(poses, card.get("pose", "meh"), (300, 300))
    img.paste(pose, (W - pose.width - 40, H - 130 - pose.height + 30), pose)
    _footer(d, fonts, TEXT, AMBER)
    img.save(os.path.join(out, card["slug"] + ".png")); img.convert("RGB").save(os.path.join(out, card["slug"] + ".jpg"), "JPEG", quality=90)

def fw_vee(card, fonts, poses, out):
    """Vee + Static drawing on top, caption band below. card: headline, sub. Needs art at assets/vee-static.jpg."""
    img = Image.new("RGB", (W, H), INK); d = ImageDraw.Draw(img)
    art = Image.open(card.get("art", os.path.join(poses, "vee-static.jpg"))).convert("RGB")
    band = 400; tw, th = W, H - band
    r = max(tw / art.width, th / art.height); art = art.resize((int(art.width * r), int(art.height * r)))
    left = (art.width - tw) // 2; top = int((art.height - th) * 0.25)
    img.paste(art.crop((left, top, left + tw, top + th)), (0, 0))
    d.rectangle([0, H - band, W, H - band + 12], fill=AMBER)
    f, lines, size = fit_headline(d, card["headline"].upper(), fonts["barlowc"], W - 144, 150, 96, lh=0.98)
    y = H - band + 44
    for l in lines: d.text((72, y), l, font=f, fill=TEXT); y += int(size * 0.98)
    if card.get("sub"):
        sf, sl, ss = sub_fit(d, card["sub"], fonts["barlow"], W - 144, H - 130 - y - 10, 44, floor=34)
        y += 14
        for l in sl: d.text((72, y), l, font=sf, fill="#E4DCCD"); y += int(ss * 1.28)
    _footer(d, fonts, TEXT, AMBER)
    img.save(os.path.join(out, card["slug"] + ".png")); img.convert("RGB").save(os.path.join(out, card["slug"] + ".jpg"), "JPEG", quality=90)

FW_STYLES = {"bill": fw_bill, "split": fw_split, "amber": fw_amber, "myth": fw_myth, "vee": fw_vee}

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
    img.save(os.path.join(out, card["slug"] + ".png")); img.convert("RGB").save(os.path.join(out, card["slug"] + ".jpg"), "JPEG", quality=90)

if __name__ == "__main__":
    cards_path, out, fdir, pdir = sys.argv[1:5]
    os.makedirs(out, exist_ok=True)
    fonts = {"barlowc": f"{fdir}/BarlowCondensed-Bold.ttf.ttf", "barlow": f"{fdir}/Barlow-Medium.ttf.ttf",
             "mono": f"{fdir}/IBMPlexMono-Medium.ttf.ttf", "bricolage": f"{fdir}/BricolageGrotesque.ttf", "dmsans": f"{fdir}/DMSans.ttf"}
    logo = os.path.join(HERE, "..", "howdy-move", "png", "howdymove-logo-horizontal-reverse.png")
    for c in json.load(open(cards_path)):
        if c["brand"] == "Feral Watt":
            FW_STYLES.get(c.get("style", "poster"), feral)(c, fonts, pdir, out)
        else:
            howdy(c, fonts, logo, out)
        print("made", c["slug"])
