(function () {
  window.TireLabContact = {
    computeContact: function (state, geometry) {
      var p = state.p, N = p.N, eps = new Float64Array(N), chi = new Float64Array(N), duf = new Float64Array(N), maxE = 0;
      for (var i = 0; i < N; i++) {
        var im = (i - 1 + N) % N, ip = (i + 1) % N;
        var du = (state.u[ip] - state.u[im]) / (2 * p.ds), dw = (state.w[ip] - state.w[im]) / (2 * p.ds), d2 = (state.w[ip] - 2 * state.w[i] + state.w[im]) / (p.ds * p.ds);
        eps[i] = du + state.w[i] / p.R0 + 0.5 * Math.pow(dw - state.u[i] / p.R0, 2);
        chi[i] = d2 - du / p.R0;
        duf[i] = -du / Math.max(p.ds, 1e-9) - state.u[i] / (p.R0 * p.R0);
        maxE = Math.max(maxE, Math.abs(eps[i]));
      }
      return { eps: eps, chi: chi, duf: duf, maxE: maxE, L: Math.max(geometry.xmax - geometry.xmin, 1e-9) };
    }
  };
})();
