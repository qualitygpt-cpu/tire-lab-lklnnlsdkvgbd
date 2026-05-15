window.ContactModel = {
  computeContact: function computeContact(state) {
    var p = state.p, N = p.N, g = state.g;
    var eps = new Float64Array(N), chi = new Float64Array(N), duf = new Float64Array(N), qx = new Float64Array(N), qy = new Float64Array(N), tx = new Float64Array(N), ty = new Float64Array(N), slip = new Uint8Array(N);
    var Fx = 0, Fy = 0, Mz = 0, maxE = 0, maxR = 0, xc = 0.5 * (g.xmax + g.xmin);
    for (var i = 0; i < N; i++) {
      var im = (i - 1 + N) % N, ip = (i + 1) % N;
      var du = (state.u[ip] - state.u[im]) / (2 * p.ds), dw = (state.w[ip] - state.w[im]) / (2 * p.ds), d2 = (state.w[ip] - 2 * state.w[i] + state.w[im]) / (p.ds * p.ds);
      eps[i] = du + state.w[i] / p.R0 + 0.5 * Math.pow(dw - state.u[i] / p.R0, 2);
      chi[i] = d2 - du / p.R0;
      duf[i] = -du / Math.max(p.ds, 1e-9) - state.u[i] / (p.R0 * p.R0);
      maxE = Math.max(maxE, Math.abs(eps[i]));
    }
    for (var j = 0; j < N; j++) {
      if (g.pen[j] <= 0) continue;
      var ph = state.phi[j], erx = Math.sin(ph), etx = Math.cos(ph), carX = state.w[j] * erx + state.u[j] * etx, l = Math.max(0, g.xmax - g.x[j]);
      qx[j] = p.slipRatio * l - carX; qy[j] = Math.tan(p.alpha) * l - state.y[j];
      var a = p.kb * qx[j], b = p.kb * qy[j], lim = p.mu * g.pc[j], mag = Math.hypot(a, b), r = lim > 0 ? mag / lim : 0;
      if (mag > lim && mag > 1e-12) { a = lim * a / mag; b = lim * b / mag; slip[j] = 2; r = 1; } else slip[j] = r > 0.75 ? 1 : 0;
      tx[j] = a; ty[j] = b; Fx += a * p.b * p.ds; Fy += b * p.b * p.ds; Mz += (g.x[j] - xc) * b * p.b * p.ds; maxR = Math.max(maxR, r);
    }
    state.f = { eps: eps, chi: chi, duf: duf, qx: qx, qy: qy, tx: tx, ty: ty, slip: slip, Fx: Fx, Fy: Fy, Mz: Mz, maxE: maxE, maxR: maxR };
    return state.f;
  }
};
