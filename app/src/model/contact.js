window.ContactModel = {
  computeContact: function computeContact(state) {
    var p = state.params;
    var g = state.geometry;
    var N = p.N;
    var eps = new Float64Array(N);
    var chi = new Float64Array(N);
    var duf = new Float64Array(N);
    var maxE = 0;
    var i;

    for (i = 0; i < N; i++) {
      var im = (i - 1 + N) % N;
      var ip = (i + 1) % N;
      var du = (state.u[ip] - state.u[im]) / (2 * p.ds);
      var dw = (state.w[ip] - state.w[im]) / (2 * p.ds);
      var d2 = (state.w[ip] - 2 * state.w[i] + state.w[im]) / (p.ds * p.ds);
      eps[i] = du + state.w[i] / p.R0 + 0.5 * Math.pow(dw - state.u[i] / p.R0, 2);
      chi[i] = d2 - du / p.R0;
      duf[i] = -du / Math.max(p.ds, 1e-9) - state.u[i] / (p.R0 * p.R0);
      maxE = Math.max(maxE, Math.abs(eps[i]));
    }

    state.contact = { eps: eps, chi: chi, duf: duf, maxE: maxE, patchLengthM: g.c ? g.xmax - g.xmin : 0, patchWidthM: p.b };
    return state.contact;
  }
};
