window.ContactModel = {
  computeContact: function computeContact(state) {
    // TODO: Перенести часть fields(), связанную с пятном контакта и распределениями давления.
    var lengthM = Math.max(state.geometry.deflectionM * 4, 0.01);
    state.contact = { patchLengthM: lengthM, patchWidthM: state.params.widthM };
    return state.contact;
  }
};
