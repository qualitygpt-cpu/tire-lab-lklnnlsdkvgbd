window.ContactPatchView = {
  drawPatch: function (ctx, state) {
    var px = 80, py = 260;
    var w = state.contact.patchLengthM * 300;
    var h = Math.max(state.contact.patchWidthM * 250, 10);
    ctx.fillStyle = window.RenderColors.contact;
    ctx.fillRect(px, py, w, h * 0.2);
  }
};
