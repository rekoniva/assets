# Social cards

Free graphics for Vee's social posts. No Canva credits, no AI image credits.

`make_cards.py` draws a 1080x1080 card per post from a small JSON list (brand, headline, sub line, Static pose). Feral Watt cards use the approved Static poses from rekoniva/feralwatt-site; Howdy Move cards use the logo in `howdy-move/png`. Brand colors and fonts come from the Notion Brand Kit page.

Each batch lives in its own folder. Make and the Social Post Calendar link to the PNGs through jsDelivr:
`https://cdn.jsdelivr.net/gh/rekoniva/assets@BRANCH/social-cards/BATCH/FILE.png`
