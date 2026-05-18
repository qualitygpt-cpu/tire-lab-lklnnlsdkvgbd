(function () {
  function idx(i, j, M) { return i * M + j; }
  window.TireLabGeometry = {
    computeGeometry: function (state) {
      var p = state.p;
      if (p.M > 1) return this.computeGeometry2D(state);
      var N = p.N;
      var x = new Float64Array(N), z = new Float64Array(N), pen = new Float64Array(N), pc = new Float64Array(N);
      var Fn = 0, c = 0, xmin = 1e9, xmax = -1e9, maxPen = 0;
      for (var i = 0; i < N; i++) {
        var ph = state.phi[i], erx = Math.sin(ph), erz = -Math.cos(ph), etx = Math.cos(ph), etz = Math.sin(ph);
        x[i] = (p.R0 + state.w[i]) * erx + state.u[i] * etx;
        z[i] = state.Cz + (p.R0 + state.w[i]) * erz + state.u[i] * etz;
        pen[i] = Math.max(0, -z[i]); pc[i] = p.kc * pen[i];
        if (pen[i] > 1e-8) { c++; Fn += pc[i] * p.b * p.ds; xmin = Math.min(xmin, x[i]); xmax = Math.max(xmax, x[i]); maxPen = Math.max(maxPen, pen[i]); }
      }
      if (!c) { xmin = 0; xmax = 0; }
      return { x: x, z: z, pen: pen, pc: pc, Fn: Fn, c: c, xmin: xmin, xmax: xmax, maxPen: maxPen };
    },
    computeGeometry2D: function (state) {
      var p = state.p, N = p.N, M = p.M, NM = N * M;
      var x = new Float64Array(NM), y = new Float64Array(NM), z = new Float64Array(NM), pen = new Float64Array(NM), pc = new Float64Array(NM);
      var Fn = 0, c = 0, xmin = 1e9, xmax = -1e9, ymin = 1e9, ymax = -1e9, maxPen = 0, sxp = 0, syp = 0;
      var dA = p.ds * p.dy;
      for (var i = 0; i < N; i++) {
        var ph = state.phi[i], erx = Math.sin(ph), erz = -Math.cos(ph), etx = Math.cos(ph), etz = Math.sin(ph);
        for (var j = 0; j < M; j++) {
          var k = idx(i, j, M), eta = p.eta[j] + state.v2[k];
          x[k] = (p.R0 + state.w2[k]) * erx + state.u2[k] * etx;
          y[k] = eta;
          z[k] = state.Cz + (p.R0 + state.w2[k]) * erz + state.u2[k] * etz - Math.sin(p.bank) * eta;
          pen[k] = Math.max(0, -z[k]); pc[k] = p.kc * pen[k];
          if (pen[k] > 1e-8) {
            c++; Fn += pc[k] * dA; xmin = Math.min(xmin, x[k]); xmax = Math.max(xmax, x[k]); ymin = Math.min(ymin, y[k]); ymax = Math.max(ymax, y[k]); maxPen = Math.max(maxPen, pen[k]);
            sxp += x[k] * pc[k] * dA; syp += y[k] * pc[k] * dA;
          }
        }
      }
      if (!c) { xmin = xmax = ymin = ymax = 0; }
      return { x: x, y: y, z: z, pen: pen, pc: pc, Fn: Fn, c: c, contactCount: c, xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax, dA: dA, maxPen: maxPen, pressureCenterX: Fn > 0 ? sxp / Fn : 0, pressureCenterY: Fn > 0 ? syp / Fn : 0 };
    }
  };
})();
