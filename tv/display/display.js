const XML_FEED_URL = "https://www.flatoutmotorcycles.com/unitinventory_univ.xml";
const PORTAL_API_BASE = "https://newportal.flatoutmotorcycles.com/portal/public/api/majorunit/stocknumber/";

const ROOT = document.getElementById("displayRoot");

/**
 * Read query parameters for the display page.
 * @returns {{layout: string, stockNumber: string, category: string, imageUrl: string, note: string}}
 */
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    layout: params.get("layout") || "portrait",
    stockNumber: (params.get("s") || params.get("search") || "").trim(),
    category: (params.get("category") || "").trim().toLowerCase(),
    imageUrl: (params.get("img") || "").trim(),
    note: (params.get("note") || "").trim(),
  };
}

/**
 * Normalize stock numbers for consistent comparisons.
 * @param {string} value Raw stock number.
 * @returns {string} Normalized string.
 */
function normalizeStockNumber(value) {
  return (value || "").trim().toUpperCase();
}

/**
 * Fetch selected image overrides from JSON.
 * @returns {Promise<object>} Selected images map.
 */
async function fetchSelectedImages() {
  try {
    const response = await fetch("../selected-images.json", { cache: "no-cache" });
    if (!response.ok) return {};
    return response.json();
  } catch (error) {
    console.error("Selected images load failed:", error);
    return {};
  }
}

/**
 * Get saved picks for a stock number.
 * @param {object} map Selected images map.
 * @param {string} stockNumber Stock number key.
 * @returns {{images: string[], text: string}} Saved picks.
 */
function getSavedPicks(map, stockNumber) {
  if (!map || !stockNumber) return { images: [], text: "" };
  const direct = map[stockNumber];
  const upper = map[stockNumber.toUpperCase()];
  const lower = map[stockNumber.toLowerCase()];
  const entry = direct || upper || lower || {};
  return {
    images: Array.isArray(entry.images) ? entry.images.filter(Boolean) : [],
    text: typeof entry.text === "string" ? entry.text : "",
  };
}

/**
 * Fetch XML feed text.
 * @returns {Promise<string>} XML text.
 */
async function fetchXmlText() {
  const response = await fetch(XML_FEED_URL, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`XML fetch failed: ${response.status}`);
  }
  return response.text();
}

/**
 * Parse XML text into item elements.
 * @param {string} xmlText XML feed text.
 * @returns {Element[]} Parsed item nodes.
 */
function parseItems(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  return Array.from(xmlDoc.getElementsByTagName("item"));
}

/**
 * Read text content for a tag name on an XML item.
 * @param {Element} item XML item element.
 * @param {string} tagName Tag name.
 * @returns {string} Text content.
 */
function getItemText(item, tagName) {
  return item.getElementsByTagName(tagName)[0]?.textContent?.trim() || "";
}

/**
 * Extract image URLs from an XML item.
 * @param {Element} item XML item element.
 * @returns {string[]} Image URLs.
 */
function getItemImages(item) {
  return Array.from(item.getElementsByTagName("imageurl"))
    .map((node) => node.textContent?.trim() || "")
    .filter(Boolean);
}

/**
 * Format price as currency.
 * @param {string} value Raw price value.
 * @returns {string} Formatted price.
 */
function formatPrice(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "N/A";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(numeric);
}

/**
 * Build a normalized data object from XML item fields.
 * @param {Element} item XML item element.
 * @returns {object} Data object.
 */
function buildXmlData(item) {
  return {
    title: getItemText(item, "title"),
    webURL: getItemText(item, "link"),
    stockNumber: getItemText(item, "stocknumber"),
    vin: getItemText(item, "vin"),
    price: getItemText(item, "price"),
    manufacturer: getItemText(item, "manufacturer"),
    year: getItemText(item, "year"),
    modelName: getItemText(item, "model_name"),
    modelType: getItemText(item, "model_type"),
    usage: getItemText(item, "usage"),
    updated: getItemText(item, "updated"),
    images: getItemImages(item),
  };
}

/**
 * Filter items based on category heuristics.
 * @param {object} itemData Normalized item data.
 * @param {string} category Category from query params.
 * @returns {boolean} Match result.
 */
function matchesCategory(itemData, category) {
  if (!category) return true;
  const haystack = `${itemData.modelType} ${itemData.title} ${itemData.manufacturer}`.toLowerCase();
  if (category === "boats") {
    return haystack.includes("boat") || haystack.includes("pontoon") || haystack.includes("sea-doo");
  }
  if (category === "vehicles") {
    return !haystack.includes("boat") && !haystack.includes("pontoon");
  }
  return haystack.includes(category);
}

/**
 * Fetch portal API data for a stock number.
 * @param {string} stockNumber Stock number to query.
 * @returns {Promise<object|null>} API response or null on failure.
 */
async function fetchPortalData(stockNumber) {
  if (!stockNumber) return null;
  try {
    const response = await fetch(`${PORTAL_API_BASE}${encodeURIComponent(stockNumber)}`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Portal API error:", error);
    return null;
  }
}

/**
 * Merge XML and API data, preferring API fields where available.
 * @param {object} xmlData XML-derived data.
 * @param {object|null} apiData API-derived data.
 * @returns {object} Combined data object.
 */
function mergeData(xmlData, apiData) {
  if (!apiData) return xmlData;
  return {
    ...xmlData,
    manufacturer: apiData.Manufacturer || xmlData.manufacturer,
    year: apiData.ModelYear || xmlData.year,
    modelName: apiData.ModelName || xmlData.modelName,
    modelType: apiData.ModelType || xmlData.modelType,
    usage: apiData.Usage || xmlData.usage,
    vin: apiData.VIN || xmlData.vin,
  };
}

/**
 * Render a QR code for a target URL.
 * @param {string} url Target URL for QR code.
 */
function renderQrCode(url) {
  if (!window.QRCode || !url) return;
  const qrContainer = document.getElementById("qrCode");
  if (!qrContainer) return;
  qrContainer.innerHTML = "";
  new QRCode(qrContainer, {
    text: url,
    width: 120,
    height: 120,
    correctLevel: QRCode.CorrectLevel.M,
  });
}

/**
 * Render a single vehicle in portrait layout.
 * @param {object} data Vehicle data.
 * @param {string} imageUrl Preferred image URL.
 * @param {string} customText Custom text line.
 */
function renderPortrait(data, imageUrl, customText) {
  const secondaryImage = data.images[1] || "";
  const heroMarkup = imageUrl
    ? `<img class="tv-hero" src="${imageUrl}" alt="${data.title || "Vehicle"}" />`
    : `<div class="tv-panel p-5 text-center">Image not available</div>`;
  ROOT.innerHTML = `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <img src="../../img/fom-app-logo-01.svg" alt="Flatout Motorsports" width="180" height="27" />
        <span class="badge text-bg-danger">${data.year || ""}</span>
      </div>

      <div class="mb-3">
        ${heroMarkup}
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <div class="tv-panel p-3 h-100">
            <div class="text-uppercase text-danger fw-semibold mb-2">Show Special</div>
            <div class="display-6 fw-bold">${formatPrice(data.price)}</div>
            <div class="text-secondary mt-2">${data.title || ""}</div>
            ${customText ? `<div class="mt-3 fw-semibold">${customText}</div>` : ""}
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="tv-panel p-3 h-100">
            <div class="fw-semibold mb-2">Details</div>
            <div>Stock: ${data.stockNumber || "N/A"}</div>
            <div>Make: ${data.manufacturer || "N/A"}</div>
            <div>Model: ${data.modelName || "N/A"}</div>
            <div>Type: ${data.modelType || "N/A"}</div>
            <div>Usage: ${data.usage || "N/A"}</div>
          </div>
        </div>
      </div>

      <div class="row g-3 mt-1">
        <div class="col-12 col-lg-8">
          ${secondaryImage ? `<img class="tv-hero" src="${secondaryImage}" alt="Secondary image" />` : ""}
        </div>
        <div class="col-12 col-lg-4">
          <div class="tv-panel p-3 h-100 d-flex align-items-center justify-content-center">
            <div id="qrCode" class="tv-qr"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  renderQrCode(data.webURL);
}

/**
 * Render a single vehicle in landscape layout.
 * @param {object} data Vehicle data.
 * @param {string} imageUrl Preferred image URL.
 * @param {string} customText Custom text line.
 */
function renderLandscapeSingle(data, imageUrl, customText) {
  const heroMarkup = imageUrl
    ? `<img class="tv-hero" src="${imageUrl}" alt="${data.title || "Vehicle"}" />`
    : `<div class="tv-panel p-5 text-center">Image not available</div>`;
  ROOT.innerHTML = `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <img src="../../img/fom-app-logo-01.svg" alt="Flatout Motorsports" width="180" height="27" />
        <span class="badge text-bg-danger">${data.year || ""}</span>
      </div>

      <div class="row g-4 align-items-center">
        <div class="col-12 col-lg-7">
          ${heroMarkup}
        </div>
        <div class="col-12 col-lg-5">
          <div class="tv-panel p-3 mb-3">
            <div class="h4 fw-semibold">${data.title || ""}</div>
            <div class="text-secondary">${data.manufacturer || ""} ${data.modelName || ""}</div>
            <div class="display-6 fw-bold text-danger mt-2">${formatPrice(data.price)}</div>
            ${customText ? `<div class="mt-2 fw-semibold">${customText}</div>` : ""}
          </div>
          <div class="tv-panel p-3">
            <div>Stock: ${data.stockNumber || "N/A"}</div>
            <div>Type: ${data.modelType || "N/A"}</div>
            <div>Usage: ${data.usage || "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render a grid of vehicles for landscape mode.
 * @param {object[]} items Vehicle data list.
 */
function renderLandscapeGrid(items) {
  const cards = items
    .slice(0, 6)
    .map(
      (item) => `
        <div class="col">
          <div class="tv-panel p-2 tv-grid-card h-100">
            ${
              item.images[0]
                ? `<img src="${item.images[0]}" alt="${item.title || "Vehicle"}" />`
                : `<div class="tv-panel p-4 text-center">Image not available</div>`
            }
            <div class="mt-2">
              <div class="fw-semibold">${item.year || ""} ${item.manufacturer || ""}</div>
              <div class="text-secondary small">${item.modelName || item.title || ""}</div>
              <div class="fw-bold text-danger">${formatPrice(item.price)}</div>
              <div class="small text-secondary">Stock: ${item.stockNumber || "N/A"}</div>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  ROOT.innerHTML = `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <img src="../../img/fom-app-logo-01.svg" alt="Flatout Motorsports" width="180" height="27" />
        <span class="badge text-bg-danger">TV Display</span>
      </div>
      <div class="row row-cols-1 row-cols-md-3 g-3">
        ${cards}
      </div>
    </div>
  `;
}

/**
 * Render a fallback message.
 * @param {string} message Message to display.
 */
function renderMessage(message) {
  ROOT.innerHTML = `<div class="text-center text-secondary">${message}</div>`;
}

/**
 * Initialize the display with XML data and optional API enrichment.
 */
async function initDisplay() {
  const { layout, stockNumber, category, imageUrl, note } = getQueryParams();

  try {
    const [xmlText, selectedMap] = await Promise.all([fetchXmlText(), fetchSelectedImages()]);
    const items = parseItems(xmlText).map(buildXmlData).filter((item) => matchesCategory(item, category));

    if (!items.length) {
      renderMessage("No vehicles found for this filter.");
      return;
    }

    if (stockNumber) {
      const normalized = normalizeStockNumber(stockNumber);
      const match = items.find((item) => normalizeStockNumber(item.stockNumber) === normalized);
      if (!match) {
        renderMessage("Stock number not found in XML feed.");
        return;
      }

      const saved = getSavedPicks(selectedMap, normalized);
      const apiData = await fetchPortalData(normalized);
      const merged = mergeData(match, apiData);
      const preferredImage = imageUrl || saved.images[0] || merged.images[0] || "";
      const customText = note || saved.text || "";

      if (layout === "landscape") {
        renderLandscapeSingle(merged, preferredImage, customText);
      } else {
        renderPortrait(merged, preferredImage, customText);
      }
      return;
    }

    if (layout === "landscape") {
      renderLandscapeGrid(items);
      return;
    }

    renderMessage("Provide a stock number for portrait display.");
  } catch (error) {
    console.error("Display error:", error);
    renderMessage("Failed to load display data.");
  }
}

initDisplay();
