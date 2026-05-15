window.BrushModel = {
  computeBrushForces: function computeBrushForces(state) {
    state.brush = {
      mu: state.p.mu,
      maxLongitudinalForceN: state.f ? state.f.Fx : 0,
      maxLateralForceN: state.f ? state.f.Fy : 0
    };
    return state.brush;
  }
};
