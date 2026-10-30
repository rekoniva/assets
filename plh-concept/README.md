# Partnership Lake Houston: concept redesign

Static HTML/CSS concept of [lakehouston.org](https://lakehouston.org/). It's not the live site, and every page is `noindex`.
Open `index.html` in a browser; no build step is needed.

## What's here

- **23 pages on one template** (same sticky header, hero, cards and footer):
  - Hubs: `index`, `about`, `membership`, `events`, `community`, `contact`
  - One subpage per submenu item that has content on lakehouston.org
- **Copy:** pulled from lakehouston.org on 2026-10-30 and kept word for word. The markup was rebuilt; the text wasn't edited.
- **Colors:** sampled from `assets/img/plh-logo.png`. Red `#CE0F3A` is used for calls to action only; navy `#01285D` for structure.
- **Logo:** `assets/img/plh-logo.png` is the supplied file, byte for byte. CSS crops off its white margin; it isn't redrawn.
- **Images and video:** hotlinked from their CDN (`edge.growthzonecms.com`). `assets/img/video-poster.jpg` is a frame from their own video.
- **No third-party code:** the menu (WAI-ARIA disclosure pattern) and tap-to-play video are a small hand-written script, `assets/js/site.js`.

## Menu map

| Menu | Pages |
|---|---|
| About | Who We Are, Our Elite Investors, Partnership Staff ↗, Board of Directors ↗ |
| Membership | Membership Levels, Member Testimonials, Member Directory ↗, Lake Houston Deals ↗, Partnership Opportunities 2027 ↗, Sponsorship Opportunities ↗ |
| Events | Upcoming Events, Full Calendar ↗, Signature Events, Luncheons, Bizcom, Business & Bacon, Chamber on Tap, Leadership Lake Houston, Recorded Events ↗ |
| Community | **Community Engagement:** Volunteer, Ambassadors ↗, Advocacy, Business Resources, Publications & Communication. **Economic Development:** Lake Houston Area Profile, Incentives, Education, Industries, Properties ↗ |
| Contact | Contact Us, Partnership Staff ↗, Board of Directors ↗ |

↗ = links out to their live system (members.lakehouston.org, etc.). Login and Join links live in the sticky header.

## Placeholders

- **Volunteer:** lakehouston.org/volunteer returns a 404, so there's no copy to bring over.
- **FAQ, Privacy policy, Terms and conditions:** these are dead `#` links on the live site.

## Things found on the live site (left verbatim, worth fixing)

- Homepage event time reads "11:0 AM". The Nov 12 Bizcom time says "(CDT)", but that date falls in CST.
- The Bizcom page sponsorship email is `SMagee@LakeHosuton.org` (typo, so the mailto bounces).
- Publications & Communication lists "Annual Business and Community Guide 2023-2024" twice.
- The Industries tiles link to a personal SharePoint/OneDrive, which public visitors likely can't open.
- The homepage shows 2 upcoming events, not 3. The full calendar sits behind members.lakehouston.org.
- The supplied logo PNG is a low-res upscale. Production needs a vector/SVG or high-res file.
