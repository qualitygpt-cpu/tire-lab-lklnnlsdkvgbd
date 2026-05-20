(function () {
  function maxAbs(a) { var m = 0; for (var i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i])); return m; }
  function minVal(a) { var m = Infinity; for (var i = 0; i < a.length; i++) m = Math.min(m, a[i]); return m; }
  window.TireLabResults = {
    computeResults: function (state) {
      var g = state.last.geometry, f = state.last.contact, b = state.last.brush, p = state.p, area = p.M > 1 ? g.c * g.dA : (g.c ? g.xmax - g.xmin : 0) * p.b;
      var maxP = maxAbs(g.pc), meanP = area > 0 ? g.Fn / area : 0;
      var lr = 0, fr = 0;
      if (p.M > 1 && g.Fn > 0) {
        for (var i = 0; i < p.N; i++) for (var j = 0; j < p.M; j++) { var k = i * p.M + j, load = g.pc[k] * g.dA; lr += g.y[k] >= 0 ? load : -load; fr += g.x[k] >= g.pressureCenterX ? load : -load; }
        lr /= g.Fn; fr /= g.Fn;
      }
      var post = window.TireLabPostprocess.compute(state);
      return {
        targetNormalForce: p.Ntarget, calculatedNormalForce: g.Fn, normalForceError: g.Fn - p.Ntarget,
        Fx: b.Fx, Fy: b.Fy, Mz: b.Mz, minimumW: p.M > 1 ? minVal(state.w2) : minVal(state.w), maximumYAbs: p.M > 1 ? maxAbs(state.v2) : maxAbs(state.y),
        contactPatchLength: g.c ? g.xmax - g.xmin : 0, contactPatchWidth: p.M > 1 ? (g.c ? g.ymax - g.ymin : 0) : p.b, contactPatchArea: area,
        maxEpsilonAbs: maxAbs(f.eps), maxContactPressure: maxP, maxPressure: maxP, meanPressure: meanP, loadedArea: area,
        pressureCenterX: g.pressureCenterX || 0, pressureCenterY: g.pressureCenterY || 0,
        leftRightPressureImbalance: lr, frontRearPressureImbalance: fr,
        tauMuPRatio: b.maxR,
        corneringStiffness: post.corneringStiffness,
        stickRatio: post.stickRatio, nearLimitRatio: post.nearLimitRatio, slipRatio: post.slipRatio,
        maps: post.maps,
        solverIterations: state.iteration, residual: state.residual
      };
    }
  };
})();
