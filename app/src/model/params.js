window.ParamsModel = {
  normalizeParams: function normalizeParams(rawInput) {
    // TODO: Перенести и документировать блок params() из legacy-модели без изменения формул.
    return {
      loadN: Number(rawInput.loadN || 0),
      pressureKpa: Number(rawInput.pressureKpa || 0),
      pressurePa: window.UnitsModel.kpaToPa(Number(rawInput.pressureKpa || 0)),
      radiusM: Number(rawInput.radiusM || 0),
      widthM: Number(rawInput.widthM || 0)
    };
  }
};
