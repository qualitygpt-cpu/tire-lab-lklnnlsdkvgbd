window.WheelView = {
  drawWheel: function (ctx, state) {
    var cx = 180, cy = 180, r = Math.max((state.params.radiusM - state.geometry.deflectionM) * 250, 20);
    ctx.strokeStyle = window.RenderColors.tire;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
};
