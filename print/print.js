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
 * Fetch portal API data for a stock number.
 * @param {string} stockNumber Stock number to query.
 * @returns {Promise<object|null>} API response or null on failure.
 */
async function fetchPortalData(stockNumber) {
  if (!stockNumber) return null;
  try {
    const timestamp = Date.now();
    const response = await fetch(`${PORTAL_API_BASE}${encodeURIComponent(stockNumber)}?_t=${timestamp}`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Portal API error:", error);
    return null;
  }
}

/**
 * Build display data from API response.
 * @param {object} apiData Portal API response.
 * @returns {object} Normalized data object.
 */
function buildDisplayData(apiData) {
  // Keep full image URLs exactly as returned from API
  const images = (apiData?.Images || []).map((img) => img.ImgURL).filter(Boolean);
  const uniqueImages = [...new Set(images)];
  
  console.log("API Images:", apiData?.Images);
  console.log("Processed images:", uniqueImages);

  return {
    title: [apiData?.ModelYear, apiData?.Manufacturer, apiData?.ModelName].filter(Boolean).join(" "),
    webURL: apiData?.DetailUrl || "",
    stockNumber: apiData?.StockNumber || "",
    vin: apiData?.VIN || "",
    price: apiData?.Price || apiData?.SalePrice || apiData?.QuotePrice || "",
    msrp: apiData?.MSRPUnit || apiData?.MSRP || "",
    manufacturer: apiData?.Manufacturer || "",
    year: apiData?.ModelYear || "",
    modelName: apiData?.ModelName || "",
    modelType: apiData?.ModelType || "",
    usage: apiData?.Usage || "",
    description: apiData?.B50Desc || "",
    images: uniqueImages,
    phone: apiData?.Phone || "",
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
 * @param {object} data Normalized display data.
 * @param {object} apiData Raw API data.
 * @param {string} overrideImage Optional override image.
 */
function renderPrint(data, apiData, overrideImage) {
  const priceValue = apiData?.QuotePrice || apiData?.SalePrice || apiData?.Price || data.price;
  const msrpValue = apiData?.MSRPUnit || apiData?.MSRP || data.msrp;
  const paymentValue = apiData?.Payment || apiData?.PaymentAmount;
  const totalValue = apiData?.OTDPrice;
  const heroImage = overrideImage || data.images[0] || "../img/fallback.jpg";
  const thumbnails = data.images.slice(0, 12);
  const descriptionText = stripHtml(data.description);
  const featureMarkup = renderFeatureCards(apiData?.AccessoryItems || apiData?.MUItems);
  const feesMarkup = renderLineItems(apiData?.OTDItems || []);

  // Pricing logic: if new and MSRP > price, show both
  const isNew = (data.usage || "").toLowerCase() === "new";
  const hasDiscount = msrpValue && priceValue && Number(msrpValue) > Number(priceValue);
  const showBothPrices = isNew && hasDiscount;

  ROOT.innerHTML = `
    <div class="print-header">
      <img src="../img/fom-app-logo-01.svg" alt="Flatout Motorsports" />
      <div class="print-title">${data.title || "Vehicle"}</div>
    </div>

    <div class="row g-3 mt-3">
      <div class="col-8">
        ${heroImage ? `<img class="print-hero" src="${heroImage}" alt="Vehicle image" />` : ""}
      </div>
      <div class="col-4">
        <div class="print-panel">
          ${showBothPrices ? `<div class="print-msrp">${formatPrice(msrpValue)}</div>` : ""}
          <div class="print-price">${formatPrice(showBothPrices ? priceValue : (priceValue || msrpValue))}</div>
          ${paymentValue ? `<div class="print-sub mt-2">Payment ${formatPrice(paymentValue)}/mo</div>` : ""}
          <div class="print-meta mt-3">Stock: ${data.stockNumber || "N/A"}</div>
          <div class="print-meta">VIN: ${data.vin || "N/A"}</div>
          <div class="print-meta">Condition: ${data.usage || "N/A"}</div>
        </div>
        <div class="print-panel mt-3">
          <div class="print-panel-title">Fees & Taxes</div>
          ${feesMarkup || '<div class="print-list"><span class="text-secondary">No fees data available</span></div>'}
          ${totalValue ? `<div class="print-total">Total ${formatPrice(totalValue)}</div>` : ""}
        </div>
      </div>
    </div>

    ${featureMarkup ? `<div class="mt-3">${featureMarkup}</div>` : ""}

    <div class="row g-3 mt-3">
      <div class="col-9">
        <div class="print-panel">
          <div class="print-panel-title">Description & Dealer Notes</div>
          <div class="print-description">${descriptionText ? descriptionText.replace(/\n/g, "<br />") : "No description available."}</div>
        </div>
      </div>
      <div class="col-3">
        <div class="print-panel h-100 d-flex flex-column align-items-center justify-content-center">
          <div id="printQrCode"></div>
          ${data.phone ? `<div class="print-phone mt-2">${data.phone}</div>` : ""}
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

  renderQrCode(data.webURL);
}

/**
 * Initialize the print page.
 */
async function initPrint() {
  const { stockNumber, imageUrl } = getQueryParams();
  if (!stockNumber) {
    ROOT.innerHTML = `<div class="text-center text-secondary py-5">Provide a stock number via <code>?s=STOCKNUMBER</code></div>`;
    return;
  }

  try {
    const apiData = await fetchPortalData(stockNumber);
    if (!apiData) {
      ROOT.innerHTML = `<div class="text-center text-secondary py-5">Stock number "${stockNumber}" not found.</div>`;
      return;
    }

    const data = buildDisplayData(apiData);
    renderPrint(data, apiData, imageUrl);
  } catch (error) {
    console.error("Print error:", error);
    ROOT.innerHTML = `<div class="text-center text-secondary py-5">Failed to load print data.</div>`;
  }
}

initPrint();
