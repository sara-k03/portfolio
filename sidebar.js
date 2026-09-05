(function () {
  var mount = document.getElementById('sidebar-mount');
  if (!mount) return;

  var root = (document.currentScript && document.currentScript.dataset.root) || '';
  var path = window.location.pathname;

  function isActive(href) {
    return path.endsWith('/' + href);
  }

  var NAV = [
    {
      label: 'Technical',
      href: 'research.html',
      children: [
        { label: 'LeetCode Diaries', href: 'research/leetcode-diaries.html' },
        { label: 'Disordered Metamaterials', href: 'research/disordered-metamaterials.html' }
      ]
    },
    {
      label: 'Personal',
      href: 'personal.html',
      children: [
        { label: 'Carnatic Music', href: 'personal/carnatic-music.html' },
        { label: 'Sanskrit', href: 'personal/sanskrit.html' },
        { label: 'Writing', href: 'writing.html' }
      ]
    }
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
    var childActive = item.children.some(function (child) { return isActive(child.href); });

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

    var liByHref = {};
    item.children.forEach(function (child) {
      var cli = document.createElement('li');
      var clink = document.createElement('a');
      clink.className = 'sidebar-link';
      clink.href = root + child.href;
      clink.textContent = child.label;
      if (isActive(child.href)) clink.classList.add('active');
      cli.appendChild(clink);
      childList.appendChild(cli);
      liByHref[child.href] = cli;
    });
    item._liByHref = liByHref;
    item._childList = childList;

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'sidebar-toggle';
    toggle.setAttribute('aria-label', 'Toggle ' + item.label + ' section');
    toggle.textContent = '›';
    row.appendChild(toggle);

    var expanded = childActive;
    function setExpanded(val) {
      expanded = val;
      childList.classList.toggle('expanded', expanded);
      toggle.setAttribute('aria-expanded', String(expanded));
    }
    setExpanded(expanded);

    toggle.addEventListener('click', function () {
      setExpanded(!expanded);
    });

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

  // Re-order each section's children by the data-updated date on its hub
  // page's own tiles (same source tile-sort.js reads on the hub pages
  // themselves), so the sidebar always matches without needing its own
  // hardcoded copy of the dates. Silently keeps the declared order above
  // if the fetch fails (e.g. viewed over file://).
  NAV.forEach(function (item) {
    fetch(root + item.href)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var dates = {};
        doc.querySelectorAll('.project-tile[data-updated]').forEach(function (tile) {
          dates[tile.getAttribute('href')] = tile.getAttribute('data-updated');
        });
        item.children
          .slice()
          .sort(function (a, b) {
            var da = dates[a.href] || '';
            var db = dates[b.href] || '';
            return db.localeCompare(da);
          })
          .forEach(function (child) {
            var el = item._liByHref[child.href];
            if (el) item._childList.appendChild(el);
          });
      })
      .catch(function () { /* keep declared order */ });
  });
})();
