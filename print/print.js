const XML_FEED_URL = "https://www.flatoutmotorcycles.com/unitinventory_univ.xml";
const PORTAL_API_BASE = "https://newportal.flatoutmotorcycles.com/portal/public/api/majorunit/stocknumber/";

const ROOT = document.getElementById("printRoot");

/**
 * Read query parameters for the print page.
 * @returns {{stockNumber: string, imageUrl: string}}
 */
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    stockNumber: (params.get("s") || params.get("search") || "").trim(),
    imageUrl: (params.get("img") || "").trim(),
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
 * Format a number into US currency.
 * @param {number|string} value Price value.
 * @returns {string} Formatted price string.
 */
function formatPrice(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "N/A";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(numeric);
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
    description: getItemText(item, "description"),
    images: getItemImages(item),
  };
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
 * Fetch selected image overrides from JSON.
 * @returns {Promise<object>} Selected images map.
 */
async function fetchSelectedImages() {
  try {
    const response = await fetch("../tv/selected-images.json", { cache: "no-cache" });
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
 * Strip HTML tags and normalize line breaks.
 * @param {string} html HTML string.
 * @returns {string} Plain text string.
 */
function stripHtml(html) {
  if (!html) return "";
  const withBreaks = html.replace(/<br\s*\/?>/gi, "\n");
  const stripped = withBreaks.replace(/<[^>]+>/g, "");
  return stripped.replace(/\n{2,}/g, "\n").trim();
}

/**
 * Render a QR code for a target URL.
 * @param {string} url Target URL for QR code.
 */
function renderQrCode(url) {
  if (!window.QRCode || !url) return;
  const qrContainer = document.getElementById("printQrCode");
  if (!qrContainer) return;
  qrContainer.innerHTML = "";
  new QRCode(qrContainer, {
    text: url,
    width: 110,
    height: 110,
    correctLevel: QRCode.CorrectLevel.M,
  });
}

/**
 * Render feature cards from API items.
 * @param {object[]} items Feature items list.
 * @returns {string} Feature card markup.
 */
function renderFeatureCards(items) {
  const cards = (items || [])
    .filter((item) => item && item.Included === true)
    .filter((item) => item.Description)
    .slice(0, 3)
    .map(
      (item) => `
        <div class="col-4">
          <div class="print-card h-100">
            ${item.ImgURL ? `<img src="${item.ImgURL}" alt="${item.Description}" />` : ""}
            <div class="print-card-body">
              <div class="print-card-title">${item.Description}</div>
              ${item.ImageDescription ? `<div class="print-card-sub">${item.ImageDescription}</div>` : ""}
            </div>
          </div>
        </div>
      `
    )
    .join("");

  if (!cards) return "";
  return `<div class="row g-3">${cards}</div>`;
}

/**
 * Render line items list for fees/taxes.
 * @param {object[]} items Items list.
 * @returns {string} List markup.
 */
function renderLineItems(items) {
  const rows = (items || [])
    .filter((item) => item && item.Description)
    .map(
      (item) => `
        <div class="d-flex justify-content-between">
          <span>${item.Description}</span>
          <span>${formatPrice(item.Amount)}</span>
        </div>
      `
    )
    .join("");
  return rows ? `<div class="print-list">${rows}</div>` : "";
}

/**
 * Render the print layout.
 * @param {object} xmlData XML data.
 * @param {object} apiData API data.
 * @param {string[]} preferredImages Preferred image URLs.
 * @param {string} overrideImage Optional override image.
 */
function renderPrint(xmlData, apiData, preferredImages, overrideImage) {
  const priceValue = apiData?.Price || apiData?.SalePrice || apiData?.QuotePrice || xmlData.price;
  const msrpValue = apiData?.MSRPUnit || apiData?.MSRP;
  const paymentValue = apiData?.Payment || apiData?.PaymentAmount;
  const totalValue = apiData?.OTDPrice;
  const heroImage =
    overrideImage ||
    preferredImages[0] ||
    apiData?.Images?.[0]?.ImgURL ||
    xmlData.images[0] ||
    "";
  const thumbnails = (apiData?.Images || [])
    .map((img) => img.ImgURL)
    .filter(Boolean)
    .slice(0, 12);
  const descriptionText = stripHtml(apiData?.B50Desc || xmlData.description || "");
  const featureMarkup = renderFeatureCards(apiData?.AccessoryItems || apiData?.MUItems);
  const feesMarkup = renderLineItems(apiData?.OTDItems || []);

  ROOT.innerHTML = `
    <div class="print-header">
      <img src="../img/fom-app-logo-01.svg" alt="Flatout Motorsports" />
      <div class="print-title">${xmlData.year || ""} ${xmlData.title || ""}</div>
    </div>

    <div class="row g-3 mt-3">
      <div class="col-8">
        ${heroImage ? `<img class="print-hero" src="${heroImage}" alt="Vehicle image" />` : ""}
      </div>
      <div class="col-4">
        <div class="print-panel">
          <div class="print-price">${formatPrice(priceValue)}</div>
          ${msrpValue ? `<div class="print-sub">MSRP ${formatPrice(msrpValue)}</div>` : ""}
          ${paymentValue ? `<div class="print-sub mt-2">Payment ${formatPrice(paymentValue)}/mo</div>` : ""}
          <div class="print-meta mt-3">Stock: ${xmlData.stockNumber || "N/A"}</div>
          <div class="print-meta">VIN: ${xmlData.vin || apiData?.VIN || "N/A"}</div>
          <div class="print-meta">Usage: ${xmlData.usage || apiData?.Usage || "N/A"}</div>
        </div>
        <div class="print-panel mt-3">
          <div class="print-panel-title">Fees & Taxes</div>
          ${feesMarkup}
          ${totalValue ? `<div class="print-total">Total ${formatPrice(totalValue)}</div>` : ""}
        </div>
      </div>
    </div>

    ${featureMarkup ? `<div class="mt-3">${featureMarkup}</div>` : ""}

    <div class="row g-3 mt-3">
      <div class="col-9">
        <div class="print-panel">
          <div class="print-panel-title">Description & Dealer Notes</div>
          <div class="print-description">${descriptionText.replace(/\n/g, "<br />")}</div>
        </div>
      </div>
      <div class="col-3">
        <div class="print-panel h-100 d-flex align-items-center justify-content-center">
          <div id="printQrCode"></div>
        </div>
      </div>
    </div>

    ${
      thumbnails.length
        ? `
          <div class="print-thumbs mt-3">
            ${thumbnails.map((url) => `<img src="${url}" alt="Thumbnail" />`).join("")}
          </div>
        `
        : ""
    }
  `;

  renderQrCode(xmlData.webURL || apiData?.DetailUrl || "");
}

/**
 * Initialize the print page.
 */
async function initPrint() {
  const { stockNumber, imageUrl } = getQueryParams();
  if (!stockNumber) {
    ROOT.innerHTML = `<div class="text-center text-secondary py-5">Provide a stock number.</div>`;
    return;
  }

  try {
    const [xmlText, selectedMap] = await Promise.all([fetchXmlText(), fetchSelectedImages()]);
    const items = parseItems(xmlText).map(buildXmlData);
    const normalized = normalizeStockNumber(stockNumber);
    const match = items.find((item) => normalizeStockNumber(item.stockNumber) === normalized);
    if (!match) {
      ROOT.innerHTML = `<div class="text-center text-secondary py-5">Stock number not found.</div>`;
      return;
    }

    const apiData = await fetchPortalData(normalized);
    const saved = getSavedPicks(selectedMap, normalized);
    renderPrint(match, apiData, saved.images, imageUrl);
  } catch (error) {
    console.error("Print error:", error);
    ROOT.innerHTML = `<div class="text-center text-secondary py-5">Failed to load print data.</div>`;
  }
}

initPrint();
