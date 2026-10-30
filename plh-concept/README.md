# Partnership Lake Houston: concept redesign

Static HTML/CSS concept of [lakehouston.org](https://lakehouston.org/). It's not the live site, and every page is `noindex`.
Open `index.html` in a browser; no build step is needed.

## What's here

- **26 pages on one template** (same sticky header, hero, cards and footer):
  - Hubs: `index`, `about`, `membership`, `events`, `community`, `development`, `contact`
  - One page per menu item, with these merges:
    - `membership.html` holds the why-join copy, Membership Levels (one collapsible row per level, price on the right; the duplicate price tiles were dropped), a Testimonials carousel and both sponsorship links.
    - `networking-programs.html` holds Bizcom, Business & Bacon and Chamber on Tap.
    - Luncheons is covered by `signature-events.html#luncheons`.
- **Section navigation:** every page in a section ends with the same "More in <Section>" tiles (hub pages say "Explore <Section>").
- **Copy:** kept word for word. The markup was rebuilt; the text wasn't edited.
  - Pages from lakehouston.org were pulled on 2026-10-30.
  - The members.lakehouston.org pages (staff, board, ambassadors, contact, calendar, deals, directory categories) were rebuilt from copies saved by hand on 2026-10-30. That site blocks automated access.
- **Colors:** taken from the official logo. Red `#B62A3F` is used for calls to action only; navy `#0D1E58` for structure.
- **Logo:** `assets/img/plh-logo.svg` is the supplied vector file, byte for byte, used in the header. On the homepage only, the footer opens with their Facebook cover banner (`assets/img/fb-cover.jpg`), cropped around the logo on phones.
- **Images and video:** hotlinked from their CDN (`edge.growthzonecms.com`). `assets/img/video-poster.jpg` is a frame from their own video.
- **No third-party code:** `assets/js/site.js` is a small hand-written script. It runs the menu (WAI-ARIA disclosure pattern), the homepage hero video (muted loop on tablet/desktop with a pause button; phones and reduced-motion users get a still frame), the deep links into collapsible sections, the directory search, and the Education photo carousels (scroll-snap, swipe on phones, arrow buttons with a counter).

## Menu map

| Menu | Pages |
|---|---|
| About | Who We Are, Partnership Staff, Board of Directors, Our Elite Investors |
| Membership | Membership Levels, Sponsorship Opportunities, Member Directory, Lake Houston Deals |
| Events | Event Calendar, Signature Events, Networking Programs, Leadership Lake Houston, Recorded Events (their YouTube uploads embedded) |
| Community | Volunteer, Ambassadors, Advocacy, Business Resources, Publications & Communication |
| Development | Lake Houston Area Profile, Incentives, Education, Industries, Properties (their map tool embedded) |
| Contact | single page, no submenu |

**Contact form:** a working Netlify Form (Name, Email, Phone, Message). Submissions land in the Netlify dashboard under Forms, not with the chamber. Their saved Contact Us page didn't include the form fields, so these are standard ones.

These still link out on purpose:
- **Login and Join** (their live member system)
- **The sponsorship PDF and the Canva deck**
- **Lake Houston Jobs**
- **The full member directory search**
- **Event detail pages** for the two events their homepage links to

## Snapshots and placeholders

- **Event calendar** is a snapshot of the saved list view, so it won't update on its own.
  - Two entries are left out because the saved page didn't include their dates: an untitled Business & Bacon session and the Elected Officials Breakfast Reception.
- **Member Directory:** 473 businesses (508 listing rows) from a full scrape of their directory on 2026-10-30, so it's a snapshot too.
  - The 106 original categories are grouped into 34 consolidated ones, following the category proposal. Each card still shows its original categories, and search matches business names and both sets of categories.
  - One fix to the scrape: Chicken Salad Chick's phone number was in the Address column and was moved to Phone.
  - The scrape had no websites and only 3 addresses, so cards show name, category and phone.
- **Volunteer:** lakehouston.org/volunteer returns a 404, so there's no copy to bring over.
- **FAQ, Privacy policy, Terms and conditions:** these are dead `#` links on the live site.

## Things found on the live site (left verbatim, worth fixing)

- Their homepage lists the Veterans luncheon at "11:0 AM". It also gives Sheldon Bizcom a different start time and timezone from their calendar (11:00 AM (CDT) vs 10:45 AM). This concept uses the calendar's times.
- The Bizcom page sponsorship email is `SMagee@LakeHosuton.org` (typo, so the mailto bounces).
- Publications & Communication lists "Annual Business and Community Guide 2023-2024" twice.
- The Industries tiles link to a personal SharePoint/OneDrive, which public visitors likely can't open.
- Jordan Buish is "Director of Member Services" on the Staff page but "Director of Membership Development" on Ambassadors and Membership Levels.
