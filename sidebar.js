(function () {
  var mount = document.getElementById('sidebar-mount');
  if (!mount) return;

  var root = (document.currentScript && document.currentScript.dataset.root) || '';
  var path = window.location.pathname;

  function isActive(href) {
    return path.endsWith('/' + href);
  }

  function isExternal(href) {
    return /^https?:\/\//i.test(href);
  }

  // Technical and Personal derive their children at runtime from the
  // .project-tile elements on their own hub pages (see the fetch loop
  // below), so adding/renaming/removing a tile there is enough — nothing
  // here needs to be kept in sync by hand. Writing stays a plain link with
  // no dropdown.
  var NAV = [
    { label: 'Technical', href: 'technical.html', children: [], dynamicChildren: true },
    { label: 'Personal', href: 'personal.html', children: [], dynamicChildren: true },
    { label: 'Writing', href: 'writing.html', children: [], dynamicChildren: false }
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

  // Builds/rebuilds the <li> entries inside an item's child list from its
  // current item.children array.
  function renderChildren(item) {
    item._childList.innerHTML = '';
    item._liByHref = {};
    item.children.forEach(function (child) {
      var cli = document.createElement('li');
      var clink = document.createElement('a');
      clink.className = 'sidebar-link';
      if (isExternal(child.href)) {
        clink.href = child.href;
        clink.target = '_blank';
        clink.rel = 'noopener noreferrer';
      } else {
        clink.href = root + child.href;
        if (isActive(child.href)) clink.classList.add('active');
      }
      clink.textContent = child.label;
      cli.appendChild(clink);
      item._childList.appendChild(cli);
      item._liByHref[child.href] = cli;
    });
  }

  // Lazily adds the expand/collapse toggle for a section once it's known to
  // have children (Writing starts with none until its tiles are fetched).
  function ensureToggle(item) {
    if (item._toggle) return;

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'sidebar-toggle';
    toggle.setAttribute('aria-label', 'Toggle ' + item.label + ' section');
    toggle.textContent = '›';
    item._row.appendChild(toggle);
    item._toggle = toggle;

    var expanded = false;
    item._setExpanded = function (val) {
      expanded = val;
      item._childList.classList.toggle('expanded', expanded);
      toggle.setAttribute('aria-expanded', String(expanded));
    };
    item._setExpanded(item.children.some(function (child) { return isActive(child.href); }));

    toggle.addEventListener('click', function () {
      item._setExpanded(!expanded);
    });
  }

  NAV.forEach(function (item) {
    var li = document.createElement('li');
    li.className = 'sidebar-section';

    var row = document.createElement('div');
    row.className = 'sidebar-row';

    var link = document.createElement('a');
    link.className = 'sidebar-link';
    link.href = root + item.href;
    link.textContent = item.label;
    if (isActive(item.href)) link.classList.add('active');
    row.appendChild(link);

    var childList = document.createElement('ul');
    childList.className = 'sidebar-children';

    item._row = row;
    item._childList = childList;

    li.appendChild(row);
    li.appendChild(childList);
    list.appendChild(li);
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

  footer.appendChild(linkedin);
  footer.appendChild(email);
  panel.appendChild(footer);

  mount.appendChild(panel);

  // Pull each section's children straight from the .project-tile elements on
  // its own hub page — label from the tile's <h3>, link from its href,
  // ordered by data-updated (newest first). Silently leaves the section
  // empty if the fetch fails (e.g. viewed over file://).
  NAV.forEach(function (item) {
    if (!item.dynamicChildren) return;

    fetch(root + item.href)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var tiles = Array.prototype.slice.call(doc.querySelectorAll('.project-tile[data-updated]'));

        item.children = tiles
          .map(function (tile) {
            var h3 = tile.querySelector('h3');
            return {
              label: h3 ? h3.textContent.trim() : tile.getAttribute('href'),
              href: tile.getAttribute('href'),
              updated: tile.getAttribute('data-updated') || ''
            };
          })
          .sort(function (a, b) { return b.updated.localeCompare(a.updated); });

        renderChildren(item);
        if (item.children.length) ensureToggle(item);
      })
      .catch(function () { /* keep section empty */ });
  });
})();
