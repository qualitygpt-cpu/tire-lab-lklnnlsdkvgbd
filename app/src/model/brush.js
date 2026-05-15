window.BrushModel = {
  computeBrushForces: function computeBrushForces(state) {
    var p = state.params;
    var g = state.geometry;
    var c = state.contact;
    var N = p.N;
    var qx = new Float64Array(N);
    var qy = new Float64Array(N);
    var tx = new Float64Array(N);
    var ty = new Float64Array(N);
    var slip = new Uint8Array(N);
    var Fx = 0;
    var Fy = 0;
    var Mz = 0;
    var maxR = 0;
    var xc = 0.5 * (g.xmax + g.xmin);
    var i;

    for (i = 0; i < N; i++) {
      if (g.pen[i] <= 0) {
        continue;
      }
      var ph = state.phi[i];
      var erx = Math.sin(ph);
      var etx = Math.cos(ph);
      var carX = state.w[i] * erx + state.u[i] * etx;
      var l = Math.max(0, g.xmax - g.x[i]);
      qx[i] = p.slipRatio * l - carX;
      qy[i] = Math.tan(p.alpha) * l - state.y[i];
      var a = p.kb * qx[i];
      var b = p.kb * qy[i];
      var lim = p.mu * g.pc[i];
      var mag = Math.hypot(a, b);
      var r = lim > 0 ? mag / lim : 0;
      if (mag > lim && mag > 1e-12) {
        a = lim * a / mag;
        b = lim * b / mag;
        slip[i] = 2;
        r = 1;
      } else {
        slip[i] = r > 0.75 ? 1 : 0;
      }
      tx[i] = a;
      ty[i] = b;
      Fx += a * p.b * p.ds;
      Fy += b * p.b * p.ds;
      Mz += (g.x[i] - xc) * b * p.b * p.ds;
      maxR = Math.max(maxR, r);
    }

    state.brush = { qx: qx, qy: qy, tx: tx, ty: ty, slip: slip, Fx: Fx, Fy: Fy, Mz: Mz, maxR: maxR, maxLongitudinalForceN: Fx };
    return state.brush;
  }
};
