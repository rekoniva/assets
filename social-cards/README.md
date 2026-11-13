# Social cards

Free graphics for Vee's social posts. No Canva credits, no AI image credits.

`make_cards.py` draws a 1080x1080 card per post from a small JSON list (brand, headline, sub line, Static pose). Feral Watt cards use the approved Static poses from rekoniva/feralwatt-site; Howdy Move cards use the logo in `howdy-move/png`. Brand colors and fonts come from the Notion Brand Kit page.

Each batch lives in its own folder. Make and the Social Post Calendar link to the PNGs through jsDelivr:
`https://cdn.jsdelivr.net/gh/rekoniva/assets@BRANCH/social-cards/BATCH/FILE.png`

## Feral Watt styles (Nov 13, 2026)

Vee asked for graphics that don't all look the same. Set `"style"` on a Feral Watt card:

- `poster` (default): dark, big headline, Static bottom right.
- `bill`: cream paper "bill" with 3 highlighted lines (`items`). Good for Static Decodes.
- `split`: two panels side by side (`left`, `right`, each with `title` and `text`). Good for this-vs-that.
- `amber`: full amber background, dark type. Good for Business Corner and Local + Seasonal.
- `myth`: Myth or Fact quiz card (`statement`). Answer goes in the caption.
- `vee`: the Vee + Static drawing (`vee-static.jpg` from feralwatt-site, put it in the pose folder) with a caption band. Good for Meet Vee + Static.

Rotate styles so no two posts in a row share one. Poses: the approved Static set only.
