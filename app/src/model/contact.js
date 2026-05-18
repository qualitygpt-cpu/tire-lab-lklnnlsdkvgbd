(function () {
  function idx(i, j, M) { return i * M + j; }
  window.TireLabContact = {
    computeContact: function (state, geometry) {
      if (state.p.M > 1) return this.computeContact2D(state, geometry);
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
    },
    computeContact2D: function (state, geometry) {
      var p = state.p, N = p.N, M = p.M, NM = N * M;
      var eps = new Float64Array(NM), chi = new Float64Array(NM), duf = new Float64Array(NM), maxE = 0;
      for (var i = 0; i < N; i++) for (var j = 0; j < M; j++) {
        var im = (i - 1 + N) % N, ip = (i + 1) % N, k = idx(i, j, M);
        var km = idx(im, j, M), kp = idx(ip, j, M);
        var du = (state.u2[kp] - state.u2[km]) / (2 * p.ds), dw = (state.w2[kp] - state.w2[km]) / (2 * p.ds), d2 = (state.w2[kp] - 2 * state.w2[k] + state.w2[km]) / (p.ds * p.ds);
        // 2.5D approximation: circumferential strain/curvature are computed independently for each width strip.
        eps[k] = du + state.w2[k] / p.R0 + 0.5 * Math.pow(dw - state.u2[k] / p.R0, 2);
        chi[k] = d2 - du / p.R0;
        duf[k] = -du / Math.max(p.ds, 1e-9) - state.u2[k] / (p.R0 * p.R0);
        maxE = Math.max(maxE, Math.abs(eps[k]));
      }
      return { eps: eps, chi: chi, duf: duf, maxE: maxE, contactPatchLength: Math.max(geometry.xmax - geometry.xmin, 1e-9), contactPatchWidth: Math.max(geometry.ymax - geometry.ymin, 0), contactPatchArea: geometry.c * geometry.dA };
    }
  };
})();
