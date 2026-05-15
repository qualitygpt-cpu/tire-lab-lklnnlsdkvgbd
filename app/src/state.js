(function () {
  window.TireLabState = {
    createInitialState: function (params) {
      var N = params.N;
      var phi = new Float64Array(N);
      var w = new Float64Array(N);
      var u = new Float64Array(N);
      var y = new Float64Array(N);
      for (var i = 0; i < N; i++) phi[i] = i * params.dphi;
      var dz = Math.min(0.06, Math.max(0.004, params.Ntarget / 230000));
      return { p: params, phi: phi, w: w, u: u, y: y, Cz: params.R0 - dz, iteration: 0, residual: 0 };
    }
  };
})();
