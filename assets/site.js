// Mobile navigation
(function () {
  var btn = document.querySelector('.navtoggle');
  var nav = document.getElementById('nav');
  if (!btn || !nav) return;
  var mq = window.matchMedia('(max-width: 900px)');
  function sync() { nav.hidden = mq.matches && btn.getAttribute('aria-expanded') !== 'true'; }
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    sync();
  });
  mq.addEventListener('change', sync);
  sync();
})();

// Track record filtering
(function () {
  var bar = document.querySelector('.filters');
  var table = document.querySelector('table.record');
  var count = document.getElementById('record-count');
  if (!bar || !table) return;
  var rows = Array.prototype.slice.call(table.tBodies[0].rows);

  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    var want = btn.dataset.filter;
    bar.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b === btn));
    });
    var shown = 0;
    rows.forEach(function (row) {
      var match = want === 'all' || (row.dataset.sector || '').split(' ').indexOf(want) !== -1;
      row.hidden = !match;
      if (match) shown++;
    });
    if (count) {
      count.textContent = shown === rows.length
        ? 'Showing all ' + rows.length + ' engagements'
        : 'Showing ' + shown + ' of ' + rows.length + ' engagements';
    }
  });
})();
