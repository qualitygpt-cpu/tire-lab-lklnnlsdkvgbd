(function () {
  function metric(label, value) { return '<div class="stat"><div class="k">' + label + '</div><div class="v">' + value + '</div></div>'; }
  function renderVisuals(state) {
    window.TireLabWheelView.render(document.getElementById('wheelCanvas'), state);
    window.TireLabContactPatchView.render(document.getElementById('contactPatchCanvas'), state);
    window.TireLabPlotView.renderStrain(document.getElementById('strainCanvas'), state);
    window.TireLabPlotView.renderPressure(document.getElementById('pressureCanvas'), state);
    window.TireLabPlotView.renderShear(document.getElementById('shearCanvas'), state);
  }

  function setStatus(text) { document.getElementById('statusText').textContent = text; }

  function renderPresetChecks(preset) {
    var host = document.getElementById('presetChecks');
    host.innerHTML = '';
    (preset.checks || []).slice(0, 4).forEach(function (check) {
      var li = document.createElement('li');
      li.textContent = check;
      host.appendChild(li);
    });
  }

  function runAndRender(statusSuffix) {
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
    setStatus(statusSuffix ? ('Готово: ' + statusSuffix) : 'Готово: расчет выполнен');
    renderVisuals(state);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var defs = window.TireLabParams.getDefaultParameterDefinitions(), raw = window.TireLabPresets.getDefaults();
    var presetSelect = document.getElementById('presetSelect');

    window.TireLabControls.render(document.getElementById('controls'), defs, raw);
    window.TireLabControls.write(defs, raw);
    window.TireLabControls.updateLabels(defs);

    window.TireLabPresets.getAll().forEach(function (preset) {
      var option = document.createElement('option');
      option.value = preset.id;
      option.textContent = preset.name;
      presetSelect.appendChild(option);
    });

    function applyPreset(id, runImmediately) {
      var applied = window.TireLabPresets.applyToRaw(id, window.TireLabPresets.getDefaults());
      window.TireLabControls.write(defs, applied.raw);
      window.TireLabControls.updateLabels(defs);
      renderPresetChecks(applied.preset);
      setStatus('Выбран сценарий: ' + applied.preset.name);
      if (runImmediately) {
        runAndRender('сценарий «' + applied.preset.name + '»');
      }
    }

    defs.forEach(function (d) {
      document.getElementById(d.key).addEventListener('input', function () {
        window.TireLabControls.updateLabels(defs);
        setStatus('Параметры изменены. Нажмите «Рассчитать».');
      });
    });
    document.getElementById('nodes').addEventListener('change', function () {
      window.TireLabControls.updateLabels(defs);
      setStatus('Параметры изменены. Нажмите «Рассчитать».');
    });
    document.getElementById('run').addEventListener('click', function () { runAndRender('ручной запуск'); });
    document.getElementById('reset').addEventListener('click', function () {
      var defaults = window.TireLabPresets.getDefaults();
      window.TireLabControls.write(defs, defaults);
      window.TireLabControls.updateLabels(defs);
      presetSelect.value = window.TireLabPresets.getAll()[0].id;
      applyPreset(presetSelect.value, true);
    });

    presetSelect.addEventListener('change', function () { applyPreset(presetSelect.value, true); });

    presetSelect.value = window.TireLabPresets.getAll()[0].id;
    applyPreset(presetSelect.value, true);
  });
})();
