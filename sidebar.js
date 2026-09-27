(function () {
  var mount = document.getElementById('sidebar-mount');
  if (!mount) return;

  var root = (document.currentScript && document.currentScript.dataset.root) || '';
  var path = window.location.pathname;

  function isActive(href) {
    return path.endsWith('/' + href);
  }

  // Flat list of projects, re-sorted at runtime by how recently each was
  // updated (newest first). A project's date comes from the
  // <meta name="updated"> tag on its own page, or — for pages like Writing
  // that list posts — the newest .project-tile[data-updated] on it. The
  // order below is only the fallback shown before/if the fetches fail
  // (e.g. viewed over file://).
  var NAV = [
    { label: 'Journey to the East', href: 'journey-to-the-east.html' },
    { label: 'Measuring Viscosity', href: 'measuring-viscosity.html' },
    { label: 'Writing', href: 'writing.html' },
    { label: 'Disordered Metamaterials', href: 'disordered-metamaterials.html' }
  ];

  var header = document.createElement('div');
  header.className = 'sidebar-header';

  var brand = document.createElement('a');
  brand.className = 'sidebar-brand';
  brand.href = root + 'index.html';
  brand.textContent = 'Portfolio';
  header.appendChild(brand);

  var mobileToggle = document.createElement('button');
  mobileToggle.type = 'button';
  mobileToggle.className = 'sidebar-toggle-mobile';
  mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.textContent = '☰';
  mobileToggle.addEventListener('click', function () {
    var open = mount.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.textContent = open ? '✕' : '☰';
  });
  header.appendChild(mobileToggle);

  mount.appendChild(header);

  var panel = document.createElement('div');
  panel.className = 'sidebar-panel';

  var nav = document.createElement('nav');
  nav.className = 'sidebar-nav';
  nav.setAttribute('aria-label', 'Main sections');

  var list = document.createElement('ul');

  NAV.forEach(function (item) {
    var li = document.createElement('li');
    li.className = 'sidebar-section';

    var link = document.createElement('a');
    link.className = 'sidebar-link';
    link.href = root + item.href;
    link.textContent = item.label;
    // Also highlight a project while on one of its subpages
    // (e.g. measuring-viscosity/... under Measuring Viscosity).
    var base = item.href.replace(/\.html$/, '');
    if (isActive(item.href) || path.indexOf('/' + base + '/') !== -1) {
      link.classList.add('active');
    }

    li.appendChild(link);
    list.appendChild(li);
    item._li = li;
  });

  nav.appendChild(list);
  panel.appendChild(nav);

  var footer = document.createElement('div');
  footer.className = 'sidebar-footer';

  var linkedin = document.createElement('a');
  linkedin.href = 'https://www.linkedin.com/in/sarayu-kondaveeti/';
  linkedin.target = '_blank';
  linkedin.rel = 'noopener noreferrer';
  linkedin.textContent = 'LinkedIn';

  var email = document.createElement('a');
  email.href = 'mailto:sarayu.kondaveeti@gmail.com';
  email.textContent = 'Email';

  var github = document.createElement('a');
  github.href = 'https://github.com/sara-k03';
  github.target = '_blank';
  github.rel = 'noopener noreferrer';
  github.textContent = 'GitHub';

  footer.appendChild(linkedin);
  footer.appendChild(email);
  footer.appendChild(github);
  panel.appendChild(footer);

  mount.appendChild(panel);

  function updatedDate(doc) {
    var meta = doc.querySelector('meta[name="updated"]');
    if (meta) return meta.getAttribute('content') || '';
    return Array.prototype.slice.call(doc.querySelectorAll('.project-tile[data-updated]'))
      .map(function (tile) { return tile.getAttribute('data-updated'); })
      .sort()
      .pop() || '';
  }

  Promise.all(NAV.map(function (item) {
    return fetch(root + item.href)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        item.updated = updatedDate(new DOMParser().parseFromString(html, 'text/html'));
      });
  }))
    .then(function () {
      NAV.slice()
        .sort(function (a, b) { return b.updated.localeCompare(a.updated); })
        .forEach(function (item) { list.appendChild(item._li); });
    })
    .catch(function () { /* keep fallback order */ });
})();
