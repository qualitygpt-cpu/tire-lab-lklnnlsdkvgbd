(function () {
  const target = document.getElementById('load-timestamp');
  if (!target) return;

  const now = new Date();
  target.textContent = now.toLocaleString('ru-RU');
})();
