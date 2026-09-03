(function () {
  var canvas = document.getElementById('lattice-bg');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var LINK_DISTANCE = 140;
  var AREA_PER_NODE = 9000;
  var SPEED = 0.15;

  var width, height, dpr, nodes;

  function initNodes() {
    var count = Math.max(18, Math.round((width * height) / AREA_PER_NODE));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: 1 + Math.random() * 1.5
      });
    }
  }

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initNodes();
  }

  function step() {
    nodes.forEach(function (n) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DISTANCE) {
          var alpha = (1 - dist / LINK_DISTANCE) * 0.35;
          ctx.strokeStyle = 'rgba(214, 173, 98, ' + alpha.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(function (n) {
      ctx.fillStyle = 'rgba(214, 173, 98, 0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function loop() {
    step();
    draw();
    requestAnimationFrame(loop);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  draw();

  if (!reduceMotion) {
    requestAnimationFrame(loop);
  }
})();
