(function () {
  window.TireLabGeometry = {
    computeGeometry: function (state) {
      var p = state.p;
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
    }
  };
})();
