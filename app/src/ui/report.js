window.ReportUI = {
  formatResults: function (results) {
    return [
      'Прогиб: ' + results.deflectionMm + ' мм',
      'Длина пятна: ' + results.patchLengthMm + ' мм',
      'Макс. Fx: ' + results.maxFxN + ' Н',
      'Сходимость: ' + (results.converged ? 'да' : 'нет')
    ].join('<br>');
  }
};
