/**
 * Key tag ZPL template config. Used by key-tag.js keyTagToZpl().
 * Portrait: 1.5" wide × 2" tall (printable area); padding keeps content inside.
 * Printer config (192.168.1.74): 8/MM (203 DPI), ZPL II.
 */
window.ZplKeyTagTemplate = {
  dpi: 203,
  widthIn: 1.5,
  heightIn: 2,
  marginX: 12,
  marginY: 12,
  lineH: 24,
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
