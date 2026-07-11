document.querySelectorAll('.project-grid').forEach(function (grid) {
  var tiles = Array.from(grid.querySelectorAll('.project-tile'));
  tiles.sort(function (a, b) {
    return b.dataset.updated.localeCompare(a.dataset.updated);
  });
  tiles.forEach(function (tile) { grid.appendChild(tile); });
});
