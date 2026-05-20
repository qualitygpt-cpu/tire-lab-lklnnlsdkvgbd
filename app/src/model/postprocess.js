(function () {
  function idx(i, j, M) { return i * M + j; }

  function averageByCircumference(state, field) {
    var p = state.p, g = state.last.geometry, values = [];
    for (var i = 0; i < p.N; i++) {
      var sx = 0, sv = 0, c = 0;
      for (var j = 0; j < p.M; j++) {
        var k = idx(i, j, p.M);
        if (g.pen[k] <= 0) continue;
        sx += g.x[k];
        sv += field[k];
        c++;
      }
      if (c > 0) values.push({ x: sx / c, value: sv / c });
    }
    values.sort(function (a, b) { return a.x - b.x; });
    return values;
  }

  window.TireLabPostprocess = {
    compute: function (state) {
      var p = state.p, g = state.last.geometry, b = state.last.brush;
      var sliding = 0, sticking = 0, nearLimit = 0;
      for (var i = 0; i < b.slip.length; i++) {
        if (g.pen[i] <= 0) continue;
        if (b.slip[i] === 2) sliding++;
        else if (b.slip[i] === 1) nearLimit++;
        else sticking++;
      }
      var active = Math.max(1, sliding + nearLimit + sticking);
      var mapData = {
        deformation: { radial: p.M > 1 ? state.w2 : state.w, tangential: p.M > 1 ? state.u2 : state.u, lateral: p.M > 1 ? state.v2 : state.y },
        contactPatch: { x: g.x, y: g.y, penetration: g.pen },
        pressurePx: p.M > 1 ? averageByCircumference(state, g.pc) : [],
        tauYPx: p.M > 1 ? averageByCircumference(state, b.ty) : [],
        stickSlip: b.slip
      };
      return {
        maps: mapData,
        stickRatio: sticking / active,
        nearLimitRatio: nearLimit / active,
        slipRatio: sliding / active,
        corneringStiffness: Math.abs(p.alpha) > 1e-6 ? b.Fy / p.alpha : 0
      };
    }
  };
})();
