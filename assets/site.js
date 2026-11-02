(function () {
  // Set to the numeric App Store id once the app is live. While empty, the badge stays "Coming soon".
  var APP_ID = '';

  var q = new URLSearchParams(location.search);
  var form = document.querySelector('form.contact');
  if (q.get('sent') === '1') {
    document.getElementById('sent').hidden = false;
    if (form) form.hidden = true;
  } else if (q.get('error')) {
    var err = document.getElementById('error');
    err.textContent = q.get('error') === 'invalid'
      ? 'Please enter your name, a valid email address and a message.'
      : 'Sorry, your message could not be sent. Please try again in a few minutes.';
    err.hidden = false;
  }
  if (form) {
    form.addEventListener('submit', function () {
      var b = form.querySelector('button');
      b.disabled = true;
      b.textContent = 'Sending…';
    });
  }

  if (APP_ID && document.querySelector('[data-store]')) {
    window.boothCastStore = function (data) {
      var app = data && data.results && data.results[0];
      if (!app || !app.trackViewUrl) return;
      document.querySelectorAll('[data-store]').forEach(function (a) {
        a.href = app.trackViewUrl;
        a.querySelector('[data-store-label]').textContent = 'Download on the';
      });
      document.querySelectorAll('[data-store-text]').forEach(function (p) {
        p.textContent = 'BoothCast is available now on the App Store for iPad and iPhone.';
      });
    };
    var s = document.createElement('script');
    s.src = 'https://itunes.apple.com/lookup?id=' + encodeURIComponent(APP_ID) + '&country=au&callback=boothCastStore';
    document.head.appendChild(s);
  }
})();
