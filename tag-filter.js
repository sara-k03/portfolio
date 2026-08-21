(function () {
  var bar = document.getElementById('tag-filter');
  if (!bar) return;

  var tiles = Array.from(document.querySelectorAll('.project-tile[data-tags]'));
  if (!tiles.length) return;

  function tagsOf(tile) {
    return tile.dataset.tags.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
  }

  var allTags = [];
  tiles.forEach(function (tile) {
    tagsOf(tile).forEach(function (tag) {
      if (allTags.indexOf(tag) === -1) allTags.push(tag);
    });
  });
  allTags.sort();

  var activeTags = new Set();

  function applyFilter() {
    tiles.forEach(function (tile) {
      var visible = activeTags.size === 0 || tagsOf(tile).some(function (t) { return activeTags.has(t); });
      tile.style.display = visible ? '' : 'none';
    });
  }

  allTags.forEach(function (tag) {
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'tag-chip';

    var label = document.createElement('span');
    label.className = 'tag-label';
    label.textContent = tag;

    var close = document.createElement('span');
    close.className = 'tag-x';
    close.textContent = '×';
    close.setAttribute('aria-hidden', 'true');

    chip.appendChild(label);
    chip.appendChild(close);
    chip.setAttribute('aria-pressed', 'false');

    chip.addEventListener('click', function (e) {
      var clearing = e.target === close && chip.classList.contains('active');
      if (clearing || chip.classList.contains('active')) {
        activeTags.delete(tag);
        chip.classList.remove('active');
        chip.setAttribute('aria-pressed', 'false');
      } else {
        activeTags.add(tag);
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
      }
      applyFilter();
    });

    bar.appendChild(chip);
  });
})();
