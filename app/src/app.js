(function () {
  function metric(label, value) { return '<div class="stat"><div class="k">' + label + '</div><div class="v">' + value + '</div></div>'; }
  function runAndRender() {
    var defs = window.TireLabParams.getDefaultParameterDefinitions();
    var raw = window.TireLabControls.read(defs);
    var state = window.TireLabSolver.run(raw, {});
    var r = window.TireLabResults.computeResults(state);
    document.getElementById('iter').textContent = 'Итерация: ' + r.solverIterations + ' / ' + state.p.iterations;
    document.getElementById('res').textContent = 'Остаток: ' + r.residual.toExponential(2);
    document.getElementById('pct').textContent = '100%'; document.getElementById('bar').style.width = '100%';
    document.getElementById('results').innerHTML = [
      metric('F_n цель', r.targetNormalForce.toFixed(0) + ' Н'), metric('F_n расчет', r.calculatedNormalForce.toFixed(0) + ' Н'), metric('Ошибка нормали', r.normalForceError.toFixed(0) + ' Н'),
      metric('Fx', r.Fx.toFixed(0) + ' Н'), metric('Fy', r.Fy.toFixed(0) + ' Н'), metric('Mz', r.Mz.toFixed(1) + ' Нм'),
      metric('мин. w', (r.minimumW * 1000).toFixed(1) + ' мм'), metric('макс. |y|', (r.maximumYAbs * 1000).toFixed(1) + ' мм'),
      metric('длина пятна', (r.contactPatchLength * 1000).toFixed(1) + ' мм'), metric('площадь пятна', (r.contactPatchArea * 1e4).toFixed(1) + ' см²'),
      metric('макс. |epsilon|', (r.maxEpsilonAbs * 100).toFixed(2) + ' %'), metric('p max', (r.maxContactPressure / 1000).toFixed(0) + ' кПа'),
      metric('tau / mu p', r.tauMuPRatio.toFixed(2)), metric('итерации', String(r.solverIterations)), metric('residual', r.residual.toExponential(2))
    ].join('');
  }
  document.addEventListener('DOMContentLoaded', function () {
    var defs = window.TireLabParams.getDefaultParameterDefinitions(), raw = window.TireLabPresets.getDefaults();
    window.TireLabControls.render(document.getElementById('controls'), defs, raw);
    window.TireLabControls.write(defs, raw);
    window.TireLabControls.updateLabels(defs);
    defs.forEach(function (d) { document.getElementById(d.key).addEventListener('input', function () { window.TireLabControls.updateLabels(defs); }); });
    document.getElementById('nodes').addEventListener('change', function () { window.TireLabControls.updateLabels(defs); });
    document.getElementById('run').addEventListener('click', runAndRender);
    document.getElementById('reset').addEventListener('click', function () { var r = window.TireLabPresets.getDefaults(); window.TireLabControls.write(defs, r); window.TireLabControls.updateLabels(defs); });
  });
})();
