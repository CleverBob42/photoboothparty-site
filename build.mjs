// Generates the static pages from one shared layout: `node build.mjs`, then commit.
import { writeFileSync } from 'node:fs';

const SUPPORT_ENDPOINT = 'https://www.izeus.org/_functions/support';
const SITE = 'https://photoboothparty.izeus.org';
const V = Date.now().toString(36);

const appleLogo = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.4-.9-2.4-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"/></svg>';

// APP_ID lives in assets/site.js (empty until the app has an App Store id); the badge stays "Coming soon" until then.
const storeBadge = `<a class="store" data-store href="#get">${appleLogo}<span><small data-store-label>Coming soon on the</small><b>App Store</b></span></a>`;

const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const icons = {
  hand: icon('<path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10V6a1.5 1.5 0 0 1 3 0v7c0 4-2 7-6 7-3 0-4.5-1.5-6-4l-1.5-2.5A1.5 1.5 0 0 1 6 12.5L8 15"/>'),
  camera: icon('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
  sparkle: icon('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>'),
  tv: icon('<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4M9 12l3-3 3 3"/>'),
  qr: icon('<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h3v3h-3zM19 14v1M14 19h2M18 18h2v2h-2z"/>'),
  lock: icon('<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'),
};

const frame = (n, alt, lazy = true) =>
  `<div class="frame"><img src="assets/shots/ipad-${n}.webp" alt="${alt}" width="900" height="675"${lazy ? ' loading="lazy"' : ''}></div>`;
const phone = (n, alt, lazy = true) =>
  `<div class="frame phone"><img src="assets/shots/phone-${n}.webp" alt="${alt}" width="420" height="913"${lazy ? ' loading="lazy"' : ''}></div>`;
const shot = (kind, n, alt, title) =>
  `<figure class="shot ${kind}">${kind === 'ipad' ? frame(n, alt) : phone(n, alt)}<figcaption>${title}</figcaption></figure>`;

const background = `<div class="bg" aria-hidden="true">
  <div class="glow"></div>
  <div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div><div class="orb o4"></div><div class="orb o5"></div><div class="orb o6"></div><div class="orb o7"></div>
  <div class="fog f1"></div><div class="fog f2"></div><div class="fog f3"></div>
  <div class="vignette"></div>
</div>`;

const NAV = [
  ['index.html', 'Home'],
  ['support.html', 'Support'],
  ['privacy.html', 'Privacy'],
  ['terms.html', 'Terms'],
];

function layout({ file, title, description, body, script = false }) {
  const links = NAV.map(([href, label]) =>
    `<a href="${href}"${href === file ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#120818">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${SITE}/assets/icon-512.png">
<link rel="icon" type="image/png" sizes="32x32" href="assets/icon-32.png">
<link rel="icon" type="image/png" sizes="512x512" href="assets/icon-512.png">
<link rel="apple-touch-icon" href="assets/icon-180.png">
<link rel="stylesheet" href="assets/style.css?v=${V}">
</head>
<body>
${background}
<header class="nav">
  <a class="brand" href="index.html"><img src="assets/icon-180.png" alt="" width="36" height="36"><span>Photo Booth Party</span></a>
  <nav class="nav-links">${links}</nav>
</header>
${body}
<footer class="foot">&copy; 2026 iZeus Pty Ltd &middot; <a href="privacy.html">Privacy</a> &middot; <a href="terms.html">Terms</a> &middot; <a href="support.html">Support</a></footer>
${script ? `<script src="assets/site.js?v=${V}"></script>\n` : ''}</body>
</html>
`;
}

const pages = {
  'index.html': {
    title: 'Photo Booth Party: Hands-Free Photo Booth for iPad and iPhone',
    description: 'A hands-free party photo booth for iPad and iPhone. Stand it by the TV and guests just step in: countdown, three photos, fun backgrounds with no green screen, and the results on your TV.',
    script: true,
    body: `<main class="wrap wide">
<section class="pitch">
  <div>
    <span class="eyebrow">Parties &middot; iPad &amp; iPhone &middot; Hands-free</span>
    <h1>The photo booth <span class="grad">nobody has to touch</span></h1>
    <p class="lead">Stand your iPad or iPhone by the TV. When guests step close, Photo Booth Party counts down, snaps three photos, and puts them in front of party backgrounds with no green screen. The photos play on your TV, and guests save theirs to their phones. Birthdays, Christmas, Halloween, New Year, weddings, office parties: any party.</p>
    <div class="cta-row">
      ${storeBadge}
      <a class="btn btn-ghost" href="#how">How it works</a>
    </div>
    <p class="meta">For iPad and iPhone (iOS or iPadOS 17 or later) &middot; Apple TV optional &middot; No accounts, nothing uploaded</p>
  </div>
  <div class="pitch-art">
    ${frame(1, 'Photo Booth Party on iPad: guests in front of a party background with the countdown running', false)}
    <div class="pitch-phone">${phone(1, 'Photo Booth Party on iPhone showing the same party countdown', false)}</div>
    <img class="pitch-logo" src="assets/icon-512.png" alt="Photo Booth Party app icon" width="120" height="120">
  </div>
</section>

<section id="features">
  <h2 class="section-title">Everyone gets in the photo, nobody fiddles with the device</h2>
  <p class="section-sub">Set it up once, then enjoy your own party.</p>
  <div class="features">
    <div class="feature glass"><div class="icon">${icons.hand}</div><h3>Completely hands-free</h3><p>Stand it by the TV and guests never touch it. It sees when people step close and starts a 20-second countdown by itself, in any orientation.</p></div>
    <div class="feature glass"><div class="icon">${icons.camera}</div><h3>Three photos, three poses</h3><p>Each visit is a burst of three photos, with a clear &ldquo;Photo 1 of 3&rdquo; and a 3-2-1 between shots.</p></div>
    <div class="feature glass"><div class="icon">${icons.sparkle}</div><h3>Backgrounds, no green screen</h3><p>An on-device person cut-out puts guests in front of confetti, balloons, snowy cabins or haunted mansions. Some rounds use the real room.</p></div>
    <div class="feature glass"><div class="icon">${icons.tv}</div><h3>Party on the big screen</h3><p>With AirPlay to an Apple TV, the newest burst plays as a flip-book, then a slideshow of the whole party with a QR code.</p></div>
    <div class="feature glass"><div class="icon">${icons.qr}</div><h3>Scan, save, share</h3><p>Each burst becomes a photo strip and an animated GIF, saved to Photos. Guests on your Wi-Fi scan the QR code to open a gallery and save their own photos.</p></div>
    <div class="feature glass"><div class="icon">${icons.lock}</div><h3>Private by design</h3><p>No accounts and nothing is uploaded to the internet. The gallery is served by your device itself to your Wi-Fi.</p></div>
  </div>
</section>

<section id="themes">
  <h2 class="section-title">A theme for every party</h2>
  <p class="section-sub">Each theme brings its own backgrounds and its own wording. Type an event name like &ldquo;Happy 40th Sam!&rdquo; and it's printed on every photo strip.</p>
  <div class="themes">
    <div class="theme glass"><h3>Party</h3><p>Confetti, disco ball, neon, Ferris wheel, beach lanterns.</p></div>
    <div class="theme glass"><h3>Birthday</h3><p>Balloons, candles, bunting, streamers.</p></div>
    <div class="theme glass"><h3>Halloween</h3><p>Haunted graveyard, gothic mansion, foggy forest, pumpkins.</p></div>
    <div class="theme glass"><h3>Christmas</h3><p>Tree and fireplace, snowy cabin, snowy forest, baubles.</p></div>
  </div>
</section>

<section id="screens">
  <h2 class="section-title">See it in action</h2>
  <p class="section-sub">Real screens from the app, on iPad and iPhone.</p>
  <div class="shots">
    ${shot('ipad', 1, 'The countdown starting on iPad with a party background', 'Step in, countdown starts by itself')}
    ${shot('phone', 2, 'Three photos in a burst with a Photo 1 of 3 label on iPhone', 'Three photos, three poses')}
    ${shot('ipad', 3, 'A Christmas photo strip on iPad', 'Instant photo strip and GIF')}
    ${shot('phone', 4, 'Guests in front of a Halloween background on iPhone', 'Pick a theme, any party')}
    ${shot('ipad', 5, 'A big, clear countdown number on iPad', 'Big, clear countdown')}
    ${shot('phone', 6, 'The host admin screen on iPhone', 'Host admin in a tap')}
    ${shot('ipad', 2, 'A birthday burst of three photos on iPad', 'Birthday photos with your event name')}
  </div>
</section>

<section id="how">
  <h2 class="section-title">How it works</h2>
  <p class="section-sub">Set up in a few minutes, then the booth runs itself.</p>
  <ol class="steps">
    <li class="glass"><h3>Prop it up</h3><p>Stand your iPad or iPhone by the TV and start AirPlay mirroring to your Apple TV.</p></li>
    <li class="glass"><h3>Step in and pose</h3><p>Guests step in front of the device and pose. The countdown and the photos start by themselves.</p></li>
    <li class="glass"><h3>Watch the TV</h3><p>The newest photos flip through on the TV, then join a slideshow of the whole party with a QR code.</p></li>
    <li class="glass"><h3>Scan to save</h3><p>Guests on your Wi-Fi scan the QR code to open the gallery and save their own strip or GIF.</p></li>
  </ol>
</section>

<section id="host">
  <h2 class="section-title">You stay in charge</h2>
  <p class="section-sub">Tap the photo count for the host admin: delete bursts, choose the theme and event name, switch backgrounds on or off, delete them, add your own from Photos, and use the Stop/Start button while you set up. Guests can also send their own background picture from their phone, and it's used next. Turn that off any time.</p>
</section>

<section id="get">
  <div class="band glass">
    <img src="assets/icon-512.png" alt="" width="88" height="88">
    <h2>Ready to start the party?</h2>
    <p data-store-text>Photo Booth Party is coming soon to the App Store for iPad and iPhone.</p>
    ${storeBadge}
    <p class="fine">Needs an iPad or iPhone with iOS or iPadOS 17 or later. Apple TV is optional.</p>
  </div>
</section>
</main>`,
  },

  'support.html': {
    title: 'Photo Booth Party Support',
    description: 'Help, FAQ and contact form for the Photo Booth Party app on iPad and iPhone.',
    script: true,
    body: `<main class="wrap"><article class="doc glass">
<h1>Support</h1>
<p class="muted">Photo Booth Party &middot; iPad &amp; iPhone</p>
<p>Photo Booth Party is a hands-free party photo booth for your iPad or iPhone.</p>

<h2 id="contact">Contact us</h2>
<p>For help, bug reports or feedback, send us a message and we'll reply by email.</p>
<p class="notice ok" id="sent" role="status" hidden>Thanks! Your message has been sent. We'll reply by email.</p>
<p class="notice err" id="error" role="alert" hidden></p>
<form class="contact" method="post" action="${SUPPORT_ENDPOINT}">
  <input type="hidden" name="app" value="PhotoBoothParty">
  <input type="hidden" name="return" value="${SITE}/support.html">
  <label>Your name<input name="name" required maxlength="80" autocomplete="name"></label>
  <label>Your email<input name="email" type="email" required maxlength="120" autocomplete="email"></label>
  <label>Message<textarea name="message" required minlength="5" maxlength="4000" placeholder="Include your device model and iOS or iPadOS version if you're reporting a problem."></textarea></label>
  <div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
  <button class="btn" type="submit">Send message</button>
</form>

<h2>Frequently asked questions</h2>
<p class="faq-q">The TV isn't showing the photos.</p>
<p class="faq-a">Start Screen Mirroring from Control Center on the device and pick your Apple TV, then reopen the Photo Booth Party app.</p>
<p class="faq-q">Guests can't open the QR code.</p>
<p class="faq-a">Their phones must be on the same Wi-Fi network as your device. The gallery is served by the device itself, so it only works on your home network while the app is open.</p>
<p class="faq-q">How do I delete photos?</p>
<p class="faq-a">Tap the photo count in the app to open the host admin, where you can delete bursts.</p>
<p class="faq-q">The camera is off or the booth can't see anyone.</p>
<p class="faq-a">Open Settings &rarr; Booth Party and make sure Camera is switched on.</p>

<h2>Privacy</h2>
<p>Your party photos stay on your iPad or iPhone. <a href="privacy.html">Read the privacy policy</a>.</p>
</article></main>`,
  },

  'privacy.html': {
    title: 'Photo Booth Party Privacy Policy',
    description: 'How the Photo Booth Party app handles information.',
    body: `<main class="wrap"><article class="doc glass">
<h1>Privacy Policy</h1>
<p class="muted">Last updated: 2 November 2026</p>
<p>Photo Booth Party (&ldquo;we&rdquo;, &ldquo;our&rdquo;) is a party photo booth app for iPad and iPhone, published by iZeus Pty Ltd. This policy explains what information the app uses.</p>

<h2>In short</h2>
<p>The app collects no personal data. It has no accounts, no analytics, no ads and no tracking.</p>

<h2>Camera images</h2>
<p>The camera is used to see when people step close and to take party photos. Camera images are processed on the device only, including the cut-out that places guests in front of a background. They are not sent to us or to anyone else.</p>

<h2>Photos</h2>
<p>Photos, photo strips and GIFs are stored on the device and saved to its Photos library. The host can delete photos at any time from the app's admin screen or from Photos.</p>

<h2>The Wi-Fi gallery</h2>
<p>The app serves a gallery from the device to devices on the same local network only. Anyone on that network who scans the QR code can view and save party photos while the app is open. Nothing is uploaded to the internet. The host can delete photos at any time.</p>

<h2>Guest-sent backgrounds</h2>
<p>Background pictures that guests send from their phones are stored on the device only. The host can turn this feature off and delete any background.</p>

<h2>Support messages</h2>
<p>If you contact us through the <a href="support.html#contact">support form</a>, we receive the name, email address and message you enter. We use them only to reply to you, and they are stored by our website provider, Wix.</p>

<h2>Children</h2>
<p>Photo Booth Party is for party hosts. It is not directed at children, and we do not knowingly collect information from them.</p>

<h2>Contact</h2>
<p>Questions about privacy? Send us a message through the <a href="support.html#contact">support form</a>.</p>
</article></main>`,
  },

  'terms.html': {
    title: 'Photo Booth Party Terms of Use',
    description: 'Terms of Use (EULA) for the Photo Booth Party app.',
    body: `<main class="wrap"><article class="doc glass">
<h1>Terms of Use</h1>
<p class="muted">Last updated: 2 November 2026</p>
<p>Photo Booth Party is a party photo booth app for iPad and iPhone from iZeus Pty Ltd. By downloading or using Photo Booth Party you agree to these terms and to Apple&rsquo;s standard Licensed Application End User License Agreement (EULA).</p>
<p>Apple&rsquo;s standard EULA: <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">apple.com/legal/internet-services/itunes/dev/stdeula</a></p>

<h2>Hosts are responsible</h2>
<p>If you run Photo Booth Party at an event, you are responsible for getting your guests' consent to be photographed, and for what is shown on your TV, including any background pictures guests send. Take photos down if a guest asks. Be aware that anyone on your Wi-Fi network who scans the QR code can view and save the party's photos while the app is open.</p>

<h2>Fair use</h2>
<p>Use the app lawfully and considerately. Don't use it to photograph people who have not agreed to it, or to display content that is unlawful or harmful.</p>

<h2>No guarantees</h2>
<p>The person cut-out and countdown are automatic and won't be perfect in every light or room. The app is provided &ldquo;as is&rdquo;, and to the extent the law allows we are not liable for lost photos or for problems with your iPad, iPhone, TV or network. Nothing here limits rights you have under Australian Consumer Law.</p>

<h2>Privacy</h2>
<p>How we handle information is described in our <a href="privacy.html">Privacy Policy</a>.</p>

<h2>Contact</h2>
<p>Questions? Send us a message through the <a href="support.html#contact">support form</a>.</p>
</article></main>`,
  },
};

for (const [file, page] of Object.entries(pages)) {
  writeFileSync(new URL(file, import.meta.url), layout({ file, ...page }));
}
console.log(`built ${Object.keys(pages).length} pages (v=${V})`);
