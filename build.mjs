// Generates the static pages from one shared layout: `node build.mjs`, then commit.
import { writeFileSync } from 'node:fs';

const SUPPORT_ENDPOINT = 'https://www.izeus.org/_functions/support';
const SITE = 'https://spookybooth.izeus.org';
const V = Date.now().toString(36);

const appleLogo = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.4-.9-2.4-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"/></svg>';

// APP_ID lives in assets/site.js (empty until the app has an App Store id); the badge stays "Coming soon" until then.
const storeBadge = `<a class="store" data-store href="#get">${appleLogo}<span><small data-store-label>Coming soon on the</small><b>App Store</b></span></a>`;

const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const icons = {
  hand: icon('<path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10V6a1.5 1.5 0 0 1 3 0v7c0 4-2 7-6 7-3 0-4.5-1.5-6-4l-1.5-2.5A1.5 1.5 0 0 1 6 12.5L8 15"/>'),
  camera: icon('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
  ghost: icon('<path d="M5 20V10a7 7 0 0 1 14 0v10l-2.5-2-2.3 2-2.2-2-2.2 2-2.3-2z"/><circle cx="9.5" cy="10.5" r="1"/><circle cx="14.5" cy="10.5" r="1"/>'),
  tv: icon('<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4M9 12l3-3 3 3"/>'),
  qr: icon('<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h3v3h-3zM19 14v1M14 19h2M18 18h2v2h-2z"/>'),
  lock: icon('<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'),
};

const frame = (n, alt, lazy = true) =>
  `<div class="frame"><img src="assets/shots/${n}.webp" alt="${alt}" width="900" height="675"${lazy ? ' loading="lazy"' : ''}></div>`;
const shot = (n, alt, title) =>
  `<figure class="shot">${frame(n, alt)}<figcaption>${title}</figcaption></figure>`;

const background = `<div class="bg" aria-hidden="true">
  <div class="glow"></div>
  <div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div><div class="orb o4"></div>
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
  <a class="brand" href="index.html"><img src="assets/icon-180.png" alt="" width="36" height="36"><span>Spooky Booth</span></a>
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
    title: 'Spooky Booth – The hands-free Halloween photo booth for iPad',
    description: 'Stand your iPad by the TV and let guests step in. Spooky Booth counts down, takes three photos, swaps in haunted backgrounds with no green screen, and shows the results on your TV.',
    script: true,
    body: `<main class="wrap wide">
<section class="pitch">
  <div>
    <span class="eyebrow">Halloween &middot; iPad &middot; Hands-free</span>
    <h1>The photo booth <span class="grad">nobody has to touch</span></h1>
    <p class="lead">Stand the iPad by the TV. When guests step close, Spooky Booth counts down, snaps three photos, and puts them in front of haunted graveyards and foggy forests, with no green screen. The party's photos play on your TV, and guests save theirs to their phones.</p>
    <div class="cta-row">
      ${storeBadge}
      <a class="btn btn-ghost" href="#how">How it works</a>
    </div>
    <p class="meta">For iPad (iPadOS 17 or later) &middot; Apple TV optional &middot; No accounts, nothing uploaded</p>
  </div>
  <div class="pitch-art">
    ${frame(1, 'Spooky Booth on iPad: a guest in front of a haunted scene with the countdown running', false)}
    <img class="pitch-logo" src="assets/icon-512.png" alt="Spooky Booth app icon" width="120" height="120">
  </div>
</section>

<section id="features">
  <h2 class="section-title">Everyone gets in the photo, nobody fiddles with the iPad</h2>
  <p class="section-sub">Set it up once, then enjoy your own party.</p>
  <div class="features">
    <div class="feature glass"><div class="icon">${icons.hand}</div><h3>Completely hands-free</h3><p>It sees when people step close and starts a 20-second countdown by itself. Guests never need to touch the iPad.</p></div>
    <div class="feature glass"><div class="icon">${icons.camera}</div><h3>Three photos, three poses</h3><p>Each visit is a burst of three photos, with a clear &ldquo;Photo 1 of 3&rdquo; and a 3-2-1 between shots.</p></div>
    <div class="feature glass"><div class="icon">${icons.ghost}</div><h3>Spooky scenes, no green screen</h3><p>An on-device person cut-out puts guests in front of a haunted graveyard, gothic mansion, foggy forest, pumpkin house and more. Some rounds use the real room.</p></div>
    <div class="feature glass"><div class="icon">${icons.tv}</div><h3>Party on the big screen</h3><p>With AirPlay to an Apple TV, the newest burst plays as a flip-book, then a slideshow of the whole party.</p></div>
    <div class="feature glass"><div class="icon">${icons.qr}</div><h3>Scan, save, share</h3><p>Each burst becomes a photo strip and an animated GIF, saved to the iPad's Photos. Guests on your Wi-Fi scan a QR code on the TV to save theirs to their phone.</p></div>
    <div class="feature glass"><div class="icon">${icons.lock}</div><h3>Private by design</h3><p>No accounts and nothing is uploaded to the internet. The gallery is served by the iPad itself to your home Wi-Fi.</p></div>
  </div>
</section>

<section id="screens">
  <h2 class="section-title">See it in action</h2>
  <p class="section-sub">Real screens from the app.</p>
  <div class="shots">
    ${shot(1, 'The countdown starting as a guest steps in front of the iPad', 'Steps in front, countdown starts by itself')}
    ${shot(2, 'Three photos in a burst with a Photo 1 of 3 label', 'Three photos, three poses')}
    ${shot(3, 'An instant photo strip and animated GIF', 'Instant photo strip and GIF')}
    ${shot(4, 'Guests in front of spooky backgrounds', 'Spooky backgrounds, no green screen')}
    ${shot(5, 'A big, clear countdown number', 'Big, clear countdown')}
    ${shot(6, 'The host admin screen for choosing backgrounds', 'Choose your backgrounds')}
  </div>
</section>

<section id="how">
  <h2 class="section-title">How it works</h2>
  <p class="section-sub">Set up in a few minutes, then the booth runs itself.</p>
  <ol class="steps">
    <li class="glass"><h3>Prop it up</h3><p>Prop the iPad by the TV and start AirPlay mirroring to your Apple TV.</p></li>
    <li class="glass"><h3>Step in and pose</h3><p>Guests step in front of the iPad and pose. The countdown and the photos start by themselves.</p></li>
    <li class="glass"><h3>Watch the TV</h3><p>The photos appear on the TV, then join a slideshow of the whole party with a QR code.</p></li>
    <li class="glass"><h3>Scan to save</h3><p>Guests on your Wi-Fi scan the QR code to save their own strip or GIF to their phone.</p></li>
  </ol>
</section>

<section id="host">
  <h2 class="section-title">You stay in charge</h2>
  <p class="section-sub">Tap the photo count for the host admin: delete bursts, switch backgrounds on or off, delete them, add your own from Photos, and use the Stop/Start button while you set up. Guests can also send their own background picture from their phone, and it's used next. Turn that off any time.</p>
</section>

<section id="get">
  <div class="band glass">
    <img src="assets/icon-512.png" alt="" width="88" height="88">
    <h2>Ready to haunt your party?</h2>
    <p data-store-text>Spooky Booth is coming soon to the App Store for iPad.</p>
    ${storeBadge}
    <p class="fine">Needs an iPad with iPadOS 17 or later. Apple TV is optional.</p>
  </div>
</section>
</main>`,
  },

  'support.html': {
    title: 'Spooky Booth Support',
    description: 'Help, FAQ and contact form for the Spooky Booth iPad app.',
    script: true,
    body: `<main class="wrap"><article class="doc glass">
<h1>Support</h1>
<p class="muted">Spooky Booth &middot; iPad</p>
<p>Spooky Booth is a hands-free Halloween photo booth for your iPad.</p>

<h2 id="contact">Contact us</h2>
<p>For help, bug reports or feedback, send us a message and we'll reply by email.</p>
<p class="notice ok" id="sent" role="status" hidden>Thanks! Your message has been sent. We'll reply by email.</p>
<p class="notice err" id="error" role="alert" hidden></p>
<form class="contact" method="post" action="${SUPPORT_ENDPOINT}">
  <input type="hidden" name="app" value="SpookyBooth">
  <input type="hidden" name="return" value="${SITE}/support.html">
  <label>Your name<input name="name" required maxlength="80" autocomplete="name"></label>
  <label>Your email<input name="email" type="email" required maxlength="120" autocomplete="email"></label>
  <label>Message<textarea name="message" required minlength="5" maxlength="4000" placeholder="Include your iPad model and iPadOS version if you're reporting a problem."></textarea></label>
  <div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
  <button class="btn" type="submit">Send message</button>
</form>

<h2>Frequently asked questions</h2>
<p class="faq-q">The TV isn't showing the photos.</p>
<p class="faq-a">Start Screen Mirroring from Control Center on the iPad and pick your Apple TV, then reopen the Spooky Booth app.</p>
<p class="faq-q">Guests can't open the QR code.</p>
<p class="faq-a">Their phones must be on the same Wi-Fi network as the iPad. The gallery is served by the iPad itself, so it only works on your home network while the app is open.</p>
<p class="faq-q">How do I delete photos?</p>
<p class="faq-a">Tap the photo count in the app to open the host admin, where you can delete bursts.</p>
<p class="faq-q">The camera is off or the booth can't see anyone.</p>
<p class="faq-a">Open iPadOS Settings &rarr; Spooky Booth and make sure Camera is switched on.</p>

<h2>Privacy</h2>
<p>Your party photos stay on your iPad. <a href="privacy.html">Read the privacy policy</a>.</p>
</article></main>`,
  },

  'privacy.html': {
    title: 'Spooky Booth Privacy Policy',
    description: 'How the Spooky Booth iPad app handles information.',
    body: `<main class="wrap"><article class="doc glass">
<h1>Privacy Policy</h1>
<p class="muted">Last updated: 2 November 2026</p>
<p>Spooky Booth (&ldquo;we&rdquo;, &ldquo;our&rdquo;) is a Halloween photo booth app for iPad, published by iZeus Pty Ltd. This policy explains what information the app uses.</p>

<h2>In short</h2>
<p>The app collects no personal data. It has no accounts, no analytics, no ads and no tracking.</p>

<h2>Camera images</h2>
<p>The camera is used to see when people step close and to take party photos. Camera images are processed on the iPad only, including the cut-out that places guests in front of a background. They are not sent to us or to anyone else.</p>

<h2>Photos</h2>
<p>Photos, photo strips and GIFs are stored on the iPad and saved to its Photos library. The host can delete photos at any time from the app's admin screen or from Photos.</p>

<h2>The Wi-Fi gallery</h2>
<p>The app serves a gallery from the iPad to devices on the same local network only. Anyone on that network who scans the QR code can view and save party photos while the app is open. Nothing is uploaded to the internet. The host can delete photos at any time.</p>

<h2>Guest-sent backgrounds</h2>
<p>Background pictures that guests send from their phones are stored on the iPad only. The host can turn this feature off and delete any background.</p>

<h2>Support messages</h2>
<p>If you contact us through the <a href="support.html#contact">support form</a>, we receive the name, email address and message you enter. We use them only to reply to you, and they are stored by our website provider, Wix.</p>

<h2>Children</h2>
<p>Spooky Booth is for party hosts. It is not directed at children, and we do not knowingly collect information from them.</p>

<h2>Contact</h2>
<p>Questions about privacy? Send us a message through the <a href="support.html#contact">support form</a>.</p>
</article></main>`,
  },

  'terms.html': {
    title: 'Spooky Booth Terms of Use',
    description: 'Terms of Use (EULA) for the Spooky Booth iPad app.',
    body: `<main class="wrap"><article class="doc glass">
<h1>Terms of Use</h1>
<p class="muted">Last updated: 2 November 2026</p>
<p>Spooky Booth is a photo booth app for iPad from iZeus Pty Ltd. By downloading or using Spooky Booth you agree to these terms and to Apple&rsquo;s standard Licensed Application End User License Agreement (EULA).</p>
<p>Apple&rsquo;s standard EULA: <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">apple.com/legal/internet-services/itunes/dev/stdeula</a></p>

<h2>Hosts are responsible</h2>
<p>If you run Spooky Booth at an event, you are responsible for getting your guests' consent to be photographed, and for what is shown on your TV, including any background pictures guests send. Take photos down if a guest asks. Be aware that anyone on your Wi-Fi network who scans the QR code can view and save the party's photos while the app is open.</p>

<h2>Fair use</h2>
<p>Use the app lawfully and considerately. Don't use it to photograph people who have not agreed to it, or to display content that is unlawful or harmful.</p>

<h2>No guarantees</h2>
<p>The person cut-out and countdown are automatic and won't be perfect in every light or room. The app is provided &ldquo;as is&rdquo;, and to the extent the law allows we are not liable for lost photos or for problems with your iPad, TV or network. Nothing here limits rights you have under Australian Consumer Law.</p>

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
