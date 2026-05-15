window.ControlsUI = {
  collectParams: function (form) {
    var data = new FormData(form);
    return {
      loadN: data.get('loadN'),
      pressureKpa: data.get('pressureKpa'),
      radiusM: data.get('radiusM'),
      widthM: data.get('widthM')
    };
  }
};
