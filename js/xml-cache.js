/**
 * Shared XML cache endpoint exposed by the service worker.
 */
const XML_CACHE_ENDPOINT = "/xml-data";

/**
 * Fetch cached XML text from the service worker cache endpoint.
 * @returns {Promise<string>} Cached XML string.
 */
async function fetchCachedXmlText() {
  const response = await fetch(XML_CACHE_ENDPOINT, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Cached XML fetch failed: ${response.status}`);
  }
  return response.text();
}

/**
 * Parse XML text into a DOM document.
 * @param {string} xmlText Raw XML string.
 * @returns {Document|null} Parsed XML document or null on parse error.
 */
function parseXmlText(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const parseError = xmlDoc.querySelector("parsererror");
  if (parseError) {
    console.error("Cached XML parse error:", parseError.textContent);
    return null;
  }
  return xmlDoc;
}

/**
 * Get the first non-empty text value from a list of tag names.
 * @param {Element} item XML item element.
 * @param {string[]} tagNames Tag names to check in order.
 * @returns {string} Matched text or empty string.
 */
function getXmlText(item, tagNames) {
  for (const tagName of tagNames) {
    const value = item.getElementsByTagName(tagName)[0]?.textContent;
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

/**
 * Find a vehicle entry in the cached XML by stock number.
 * @param {Document} xmlDoc Parsed XML document.
 * @param {string} stockNumber Stock number to search for.
 * @returns {Element|null} Matching XML item element.
 */
function findXmlItemByStockNumber(xmlDoc, stockNumber) {
  const items = xmlDoc.getElementsByTagName("item");
  const target = stockNumber.trim().toUpperCase();
  for (const item of items) {
    const xmlStockNumber = getXmlText(item, ["stocknumber", "stock_number", "stock"]);
    if (xmlStockNumber.toUpperCase() === target) {
      return item;
    }
  }
  return null;
}

/**
 * Build a baseline vehicle data object from XML data.
 * @param {Element} xmlItem Matching XML item element.
 * @returns {object} Normalized vehicle data.
 */
function buildXmlVehicleData(xmlItem) {
  return {
    StockNumber: getXmlText(xmlItem, ["stocknumber", "stock_number", "stock"]),
    Usage: getXmlText(xmlItem, ["usage", "newused", "condition"]),
    ModelYear: getXmlText(xmlItem, ["year", "model_year"]),
    Manufacturer: getXmlText(xmlItem, ["manufacturer", "make"]),
    ModelName: getXmlText(xmlItem, ["model_name", "model", "modelname"]),
    ModelCode: getXmlText(xmlItem, ["model_code", "modelcode"]),
    Color: getXmlText(xmlItem, ["color", "colour"]),
    VIN: getXmlText(xmlItem, ["vin", "vin_number"]),
    Price: getXmlText(xmlItem, ["price", "msrp"]),
    ImageUrl: getXmlText(xmlItem, ["imageurl", "image_url"]),
  };
}

/**
 * Fetch and return baseline vehicle data from cached XML.
 * @param {string} stockNumber Stock number to lookup.
 * @returns {Promise<object|null>} Baseline XML data or null.
 */
async function getCachedXmlVehicle(stockNumber) {
  if (!stockNumber || !stockNumber.trim()) {
    return null;
  }
  const xmlText = await fetchCachedXmlText();
  const xmlDoc = parseXmlText(xmlText);
  if (!xmlDoc) {
    return null;
  }
  const xmlItem = findXmlItemByStockNumber(xmlDoc, stockNumber);
  if (!xmlItem) {
    return null;
  }
  return buildXmlVehicleData(xmlItem);
}

window.getCachedXmlVehicle = getCachedXmlVehicle;
