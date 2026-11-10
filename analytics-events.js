/* Marlowe Rose: privacy-conscious, non-identifying GA4 interaction events. */
(function () {
  'use strict';
  function send(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }
  document.addEventListener('click', function (event) {
    var anchor = event.target.closest('a[href]');
    if (anchor) {
      var url;
      try { url = new URL(anchor.href, window.location.href); } catch (_) { return; }
      var host = url.hostname.toLowerCase();
      var label = (anchor.textContent || anchor.getAttribute('aria-label') || '').trim().slice(0, 80);
      if (url.hash && url.origin === window.location.origin) {
        send('section_navigation', { section_id: url.hash.slice(1).slice(0, 80), link_text: label });
      }
      if (host.indexOf('spotify.com') !== -1 || host.indexOf('music.apple.com') !== -1 || host.indexOf('amazon.com') !== -1 || host.indexOf('youtube.com') !== -1 || host.indexOf('youtu.be') !== -1) {
        send('music_link_click', { music_platform: host, link_text: label });
      }
      if (host.indexOf('fourthwall.com') !== -1) {
        send('shop_link_click', { link_text: label });
      }
    }
    if (event.target.closest('.album-lightbox') || event.target.closest('.album-lightbox-close')) return;
    var gallery = event.target.closest('.album-photo, .photo-card, [data-photo-id]');
    if (gallery) send('photo_interaction', { page_path: window.location.pathname });
  });
})();
