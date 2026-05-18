(function () {
  var DEFINITIONS = [
    { key: 'mass', label: 'Нагрузка на колесо', min: 150, max: 750, step: 10, defaultValue: 350, unit: 'кг' },
    { key: 'slopeDeg', label: 'Продольный уклон', min: -20, max: 25, step: 1, defaultValue: 10, unit: '°' },
    { key: 'bankDeg', label: 'Боковой уклон', min: -15, max: 15, step: 1, defaultValue: 3, unit: '°' },
    { key: 'pressureKPa', label: 'Давление в шине', min: 160, max: 320, step: 5, defaultValue: 220, unit: 'кПа' },
    { key: 'radius', label: 'Внешний радиус R0', min: 0.28, max: 0.42, step: 0.005, defaultValue: 0.34, unit: 'м' },
    { key: 'rimRadius', label: 'Радиус диска', min: 0.14, max: 0.25, step: 0.005, defaultValue: 0.19, unit: 'м' },
    { key: 'widthMM', label: 'Ширина шины', min: 165, max: 315, step: 5, defaultValue: 225, unit: 'мм' },
    { key: 'mu', label: 'Коэффициент трения μ', min: 0.25, max: 1.15, step: 0.05, defaultValue: 0.85, unit: '' },
    { key: 'slipDeg', label: 'Угол увода α', min: -12, max: 12, step: 0.5, defaultValue: 4, unit: '°' },
    { key: 'slipRatio', label: 'Продольное скольжение κ', min: -0.2, max: 0.2, step: 0.01, defaultValue: 0.03, unit: '' },
    { key: 'EAkN', label: 'Окружная жесткость EA', min: 250, max: 2500, step: 50, defaultValue: 1100, unit: 'кН' },
    { key: 'EI', label: 'Изгибная жесткость EI', min: 5, max: 160, step: 5, defaultValue: 55, unit: 'Нм²' },
    { key: 'krkN', label: 'Радиальная связь kr', min: 80, max: 850, step: 10, defaultValue: 340, unit: 'кН/м²' },
    { key: 'kykN', label: 'Боковая связь ky', min: 50, max: 700, step: 10, defaultValue: 260, unit: 'кН/м²' },
    { key: 'treadMPa', label: 'Сдвиговая жесткость протектора kb', min: 1, max: 22, step: 0.5, defaultValue: 8, unit: 'МПа/м' },
    { key: 'contactMPa', label: 'Penalty контакт kc', min: 10, max: 120, step: 5, defaultValue: 55, unit: 'МПа/м' },
    { key: 'iterations', label: 'Итераций решателя', min: 200, max: 1800, step: 100, defaultValue: 900, unit: '' },
    { key: 'widthNodes', label: 'Узлов по ширине', min: 5, max: 31, step: 2, defaultValue: 15, unit: '' }
  ];

  window.TireLabParams = {
    getDefaultParameterDefinitions: function () { return DEFINITIONS.slice(); },
    createRawDefaults: function () {
      var raw = { nodes: 96, widthNodes: 15 };
      DEFINITIONS.forEach(function (d) { raw[d.key] = d.defaultValue; });
      return raw;
    }
  };
})();
