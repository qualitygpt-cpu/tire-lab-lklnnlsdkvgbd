(function(){
  var PRESETS = [
    {
      id: 'base-passenger',
      name: 'Базовый легковой автомобиль',
      values: { nodes: 96, mass: 350, slopeDeg: 10, bankDeg: 3, pressureKPa: 220, mu: 0.85, slipDeg: 4, slipRatio: 0.03 },
      checks: [
        'пятно контакта и деформация должны быть стабильными и непрерывными',
        'график давления p(x) должен быть ограничен зоной контакта',
        'значения Fx/Fy должны быть конечными и физически правдоподобными'
      ]
    },
    {
      id: 'low-pressure',
      name: 'Низкое давление',
      values: { pressureKPa: 170, mass: 350, slipDeg: 4, slipRatio: 0.03 },
      checks: [
        'при низком давлении пятно контакта должно увеличиться',
        'минимальный прогиб w должен стать более выраженным',
        'максимальное контактное давление должно перераспределиться по большей длине пятна'
      ]
    },
    {
      id: 'high-pressure',
      name: 'Высокое давление',
      values: { pressureKPa: 300, mass: 350, slipDeg: 4, slipRatio: 0.03 },
      checks: [
        'при высоком давлении пятно контакта должно уменьшиться',
        'прогиб шины должен уменьшиться',
        'пик p(x) может стать более локализованным'
      ]
    },
    {
      id: 'high-load',
      name: 'Большая нагрузка',
      values: { mass: 700, pressureKPa: 220, slipDeg: 4, slipRatio: 0.03 },
      checks: [
        'при большой нагрузке должна расти длина и площадь пятна контакта',
        'прогиб w должен увеличиться по модулю',
        'расчетная нормальная сила должна возрасти'
      ]
    },
    {
      id: 'longitudinal-slope',
      name: 'Продольный уклон',
      values: { slopeDeg: 20, bankDeg: 0, slipDeg: 4, slipRatio: 0.03 },
      checks: [
        'на продольном уклоне должен измениться продольный баланс сил Fx',
        'контактное пятно может сместиться по длине',
        'распределение tau_x должно качественно отличаться от базового режима'
      ]
    },
    {
      id: 'lateral-slope',
      name: 'Боковой уклон',
      values: { bankDeg: 12, slopeDeg: 0, slipDeg: 4, slipRatio: 0.03 },
      checks: [
        'на боковом уклоне должен появиться заметный вклад в Fy',
        'должна наблюдаться асимметрия бокового сдвига',
        'tau_y должен меняться относительно базового сценария'
      ]
    },
    {
      id: 'cornering-slip-angle',
      name: 'Поворот с углом увода',
      values: { slipDeg: 8, slipRatio: 0.0, slopeDeg: 0, bankDeg: 0 },
      checks: [
        'при угле увода должен появиться боковой сдвиг tau_y',
        'Fy должен возрастать по модулю относительно прямолинейного режима',
        'распределение tau_x должно оставаться вторичным при нулевом κ'
      ]
    },
    {
      id: 'slippery-road',
      name: 'Скользкое покрытие',
      values: { mu: 0.3, slipDeg: 6, slipRatio: 0.08, slopeDeg: 0, bankDeg: 0 },
      checks: [
        'при малом μ отношение tau/(mu·p) должно стремиться к насыщению',
        'ограничение по трению должно уменьшать доступные Fx/Fy',
        'кривые сдвиговых напряжений должны иметь более раннее насыщение'
      ]
    },
    {
      id: 'braking',
      name: 'Торможение',
      values: { slipRatio: -0.12, slipDeg: 0, slopeDeg: 0, bankDeg: 0, mu: 0.9 },
      checks: [
        'при торможении должен доминировать продольный сдвиг tau_x',
        'Fx должен меняться в сторону тормозной реакции (по знаку модели)',
        'картина tau_y должна быть близкой к нулевому режиму при α=0'
      ]
    },
    {
      id: 'acceleration',
      name: 'Разгон',
      values: { slipRatio: 0.12, slipDeg: 0, slopeDeg: 0, bankDeg: 0, mu: 0.9 },
      checks: [
        'при разгоне должен доминировать продольный сдвиг tau_x противоположного знака к торможению',
        'Fx должен измениться относительно базового режима (по знаку модели)',
        'по модулю Fx и tau_x должны быть сопоставимы с торможением при равном |κ|'
      ]
    }
  ];

  function cloneRaw(raw){ return JSON.parse(JSON.stringify(raw)); }
  function byId(id){ for(var i=0;i<PRESETS.length;i+=1){ if(PRESETS[i].id===id){ return PRESETS[i]; }} return PRESETS[0]; }

  window.TireLabPresets = {
    getDefaults: function(){ return window.TireLabParams.createRawDefaults(); },
    getAll: function(){ return PRESETS.slice(); },
    getById: byId,
    applyToRaw: function(id, baseRaw){
      var preset = byId(id);
      var next = cloneRaw(baseRaw || window.TireLabParams.createRawDefaults());
      Object.keys(preset.values).forEach(function(key){ next[key] = preset.values[key]; });
      return { preset: preset, raw: next };
    }
  };
})();
