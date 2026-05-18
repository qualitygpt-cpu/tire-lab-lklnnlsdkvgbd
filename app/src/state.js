(function () {
  window.TireLabState = {
    createInitialState: function (params) {
      var N = params.N, M = params.M;
      var phi = new Float64Array(N);
      var w = new Float64Array(N);
      var u = new Float64Array(N);
      var y = new Float64Array(N);
      for (var i = 0; i < N; i++) phi[i] = i * params.dphi;
      var dz = Math.min(0.06, Math.max(0.004, params.Ntarget / 230000));
      var state = { p: params, phi: phi, w: w, u: u, y: y, Cz: params.R0 - dz, iteration: 0, residual: 0 };
      if (M > 1) {
        var NM = N * M;
        state.w2 = new Float64Array(NM);
        state.u2 = new Float64Array(NM);
        state.v2 = new Float64Array(NM);
        state.eta = new Float64Array(NM);
        for (var ii = 0; ii < N; ii++) for (var j = 0; j < M; j++) state.eta[ii * M + j] = params.eta[j];
      }
      return state;
    }
  };
})();
