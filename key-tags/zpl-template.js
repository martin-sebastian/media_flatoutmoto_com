/**
 * Key tag ZPL template config. Used by key-tag.js keyTagToZpl().
 * Edit this file to change label size, margins, font, or which fields print and in what order.
 */
window.ZplKeyTagTemplate = {
  dpi: 203,
  widthIn: 1.625,
  heightIn: 2.125,
  marginX: 10,
  marginY: 15,
  lineH: 22,
  fontH: 18,
  fontW: 18,
  /** Data keys in display order (must match keys on the vehicle data object). */
  fields: [
    "Usage",
    "StockNumber",
    "ModelYear",
    "Manufacturer",
    "ModelName",
    "ModelCode",
    "Color",
    "VIN",
  ],
};
