window.BrushModel = {
  computeBrushForces: function computeBrushForces(state) {
    // TODO: Перенести фрикционно-щеточную часть fields() из legacy-модели.
    var mu = 0.8;
    var normalForceN = state.params.loadN;
    state.brush = { mu: mu, maxLongitudinalForceN: mu * normalForceN };
    return state.brush;
  }
};
