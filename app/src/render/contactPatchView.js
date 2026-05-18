(function () {
  function render(canvas, state) {
    var ctx = canvas.getContext('2d'), p = state.p, g = state.last.geometry, b = state.last.brush;
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827'; ctx.font = 'bold 15px Arial'; ctx.fillText('Пятно контакта: вид сверху', 16, 22);
    if (p.M <= 1) { ctx.fillStyle = '#6b7280'; ctx.fillText('1D режим: используйте widthNodes > 1 для карты 2.5D', 16, 48); return; }
    if (!g.c) { ctx.fillStyle = '#667085'; ctx.fillText('Контакт не найден', 16, 60); return; }
    var left = 65, right = 25, top = 44, bottom = 48, W = canvas.width - left - right, H = canvas.height - top - bottom;
    var X = function (x) { return left + W * (x - g.xmin) / Math.max(g.xmax - g.xmin, 1e-9); };
    var Y = function (y) { return top + H - H * (y - g.ymin) / Math.max(g.ymax - g.ymin, 1e-9); };
    var pmax = 0; for (var k = 0; k < g.pc.length; k++) pmax = Math.max(pmax, g.pc[k]);
    for (var i = 0; i < p.N; i++) for (var j = 0; j < p.M; j++) {
      var id = i * p.M + j; if (g.pen[id] <= 0) continue;
      var xn = X(g.x[id]), yn = Y(g.y[id]), val = g.pc[id] / Math.max(pmax, 1);
      var col = 'hsl(' + (220 - 220 * val) + ',85%,50%)'; ctx.fillStyle = col; ctx.fillRect(xn - 2.5, yn - 2.5, 5, 5);
      if (b.slip[id] === 2) { ctx.fillStyle = 'rgba(220,38,38,0.8)'; ctx.fillRect(xn - 1.2, yn - 1.2, 2.4, 2.4); }
    }
    ctx.strokeStyle = '#111827'; ctx.strokeRect(left, top, W, H);
    ctx.fillStyle = '#374151'; ctx.font = '12px Arial'; ctx.fillText('X - длина пятна контакта', left + W / 2 - 66, canvas.height - 8);
    ctx.save(); ctx.translate(18, top + H / 2 + 48); ctx.rotate(-Math.PI / 2); ctx.fillText('Y - ширина шины', 0, 0); ctx.restore();
  }
  window.TireLabContactPatchView = { render: render };
})();
