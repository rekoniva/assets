# Partnership Lake Houston: concept redesign

Static HTML/CSS concept of [lakehouston.org](https://lakehouston.org/). It's not the live site, and every page is `noindex`.
Open `index.html` in a browser; no build step is needed.

## What's here

- **24 pages on one template** (same sticky header, hero, cards and footer).
- **Menu:** five header items plus Search, Login and a red Join. On phones, Login moves into the menu panel.
  - About: Who We Are, Staff, Board of Directors, Elite Investors
  - Membership: Membership Levels, Sponsorship, Member Directory, Lake Houston Deals
  - Events: Event Calendar, Signature Events, Networking Programs, Recorded Events
  - Community: Ambassadors, Leadership Lake Houston, Advocacy, Business Resources, Publications
  - Contact
  - Economic Development is footer-only: Lake Houston Area Profile, Incentives, Education, and Properties (their map tool).
- **Homepage:** photo hero (Join + "See upcoming events"), a 2-sentence "Who We Are" teaser with a photo beside it on desktop, the next 3 events (one short sentence each), their video behind a poster (plays only on tap, with controls), and the Elite Investors logo strip.
- **No repeats:** core values live on About only. Membership benefits copy lives on Membership only. Join appears twice on the homepage (header and hero).
- **Layout:**
  - One spacing scale: 40px phone, 64px desktop. One content width: 1100px, with a 720px text column.
  - Card grids are 1/2/3 across, with a short last row centered.
  - Footer links are 16px with 44px tap targets on phones.
- **Site search:** header icon on every page. It searches pages, page sections, events, people and all 473 directory businesses. Business results open the directory already filtered.
- **Copy:** kept word for word. Pages from lakehouston.org were pulled on 2026-10-30. The members.lakehouston.org pages (staff, board, ambassadors, contact, calendar, deals, directory) were rebuilt from copies saved by hand that day; that site blocks automated access.
- **Edits made on request:**
  - "……" became "...".
  - `utm_source=chatgpt.com` was removed from links.
  - Every phone number uses the (281) 446-2128 format, and every phone link has a spoken "Call …" label.
- **Colors and logo:** navy `#0D1E58` and red `#B62A3F` (calls to action only), taken from the official logo. `assets/img/plh-logo.svg` is the supplied vector file, byte for byte.
- **Images and video:** hotlinked from their CDN. The exceptions:
  - The Elite Investors logos are local copies in `assets/img/logos/`, with only their white margins trimmed.
  - `assets/img/video-poster.jpg` is a frame from their video.
- **Contact form:** a working Netlify Form. Submissions land in the Netlify dashboard under Forms, not with the chamber.

## Retired pages (no usable real content)

- **Volunteer:** lakehouston.org/volunteer returns a 404.
- **Industries:** only five image tiles linking to a private OneDrive.
- **Properties:** the page was just their third-party map tool, so it's now a footer link straight to that tool.
- **FAQ, Privacy policy, Terms:** dead `#` links on the live site, so they're left out of the footer.

## Snapshots

- **Event calendar** is a snapshot of the saved list view. Two entries are left out because their dates weren't captured.
- **Member Directory:** 473 businesses (508 rows) from a full scrape on 2026-10-30, grouped into 34 consolidated categories (original categories shown on each card).

## Copy fixes

These typos come from the live site. The concept corrects them; everything else stays word for word.

- **Membership, 3rd testimonial:** "priceless. ." → "priceless."
- **Elite Investors, Generation Park:**
  - "spend countries hours" → "spend countless hours"
  - "enable those of our clients" → "enable our clients"
  - "For its the employees" → "For it's the employees"
- **Elite Investors, Memorial Hermann:** "for 40 years Recognized" → "for 40 years. Recognized" (added the missing period)

## Where short copy comes from

- **Homepage "Who We Are":** a 2-sentence teaser. It pairs their homepage line with the first sentence of their Membership Levels page. The full "More than a chamber / The Heart of Opportunity" block, with the mission, is on About only.
- **Community intro:** the opening sentence of their Signature Events page. The live site has no Community landing copy; its Community Engagement page is placeholder Latin.
- **Homepage events:** each card shows the first sentence of the event description. If that sentence runs long, it's cut after the last whole word. Hyphenated names like "Axe-Mania" never break at the hyphen.

## Things found on the live site (left verbatim, worth fixing)

- Their homepage lists the Veterans luncheon at "11:0 AM". It also gives Sheldon Bizcom a different start time and timezone from their calendar (11:00 AM (CDT) vs 10:45 AM). This concept uses the calendar's times.
- The Bizcom page sponsorship email is `SMagee@LakeHosuton.org` (typo, so the mailto bounces).
- Publications & Communication lists "Annual Business and Community Guide 2023-2024" twice.
- The Industries tiles link to a personal SharePoint/OneDrive, which public visitors likely can't open.
- Jordan Buish is "Director of Member Services" on the Staff page but "Director of Membership Development" on Ambassadors and Membership Levels.
