(function () {
  window.TireLabBrush = { computeBrushForces: function (state, geometry, contact) {
    var p = state.p, N = p.N, qx = new Float64Array(N), qy = new Float64Array(N), tx = new Float64Array(N), ty = new Float64Array(N), slip = new Uint8Array(N);
    var Fx = 0, Fy = 0, Mz = 0, maxR = 0, xc = 0.5 * (geometry.xmax + geometry.xmin);
    for (var i = 0; i < N; i++) { if (geometry.pen[i] <= 0) continue;
      var ph = state.phi[i], erx = Math.sin(ph), etx = Math.cos(ph), carX = state.w[i] * erx + state.u[i] * etx, l = Math.max(0, geometry.xmax - geometry.x[i]);
      qx[i] = p.slipRatio * l - carX; qy[i] = Math.tan(p.alpha) * l - state.y[i];
      var a = p.kb * qx[i], b = p.kb * qy[i], lim = p.mu * geometry.pc[i], mag = Math.hypot(a, b), r = lim > 0 ? mag / lim : 0;
      if (mag > lim && mag > 1e-12) { a = lim * a / mag; b = lim * b / mag; slip[i] = 2; r = 1; } else slip[i] = r > 0.75 ? 1 : 0;
      tx[i] = a; ty[i] = b; Fx += a * p.b * p.ds; Fy += b * p.b * p.ds; Mz += (geometry.x[i] - xc) * b * p.b * p.ds; maxR = Math.max(maxR, r);
    }
    return { qx: qx, qy: qy, tx: tx, ty: ty, slip: slip, Fx: Fx, Fy: Fy, Mz: Mz, maxR: maxR };
  }};
})();
