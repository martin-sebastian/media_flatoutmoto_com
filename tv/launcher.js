const XML_FEED_URL = "https://www.flatoutmotorcycles.com/unitinventory_univ.xml";

const DOM = {
  stockInput: document.getElementById("stockInput"),
  layoutOptions: Array.from(document.querySelectorAll("input[name='layoutOption']")),
  categorySelect: document.getElementById("categorySelect"),
  imageUrlInput: document.getElementById("imageUrlInput"),
  customTextInput: document.getElementById("customTextInput"),
  colorPickerInput: document.getElementById("colorPickerInput"),
  accentColorOneInput: document.getElementById("accentColorOneInput"),
  accentColorTwoInput: document.getElementById("accentColorTwoInput"),
  slideStartInput: document.getElementById("slideStartInput"),
  slideEndInput: document.getElementById("slideEndInput"),
  urlOutput: document.getElementById("urlOutput"),
  imageResults: document.getElementById("imageResults"),
  loadImagesBtn: document.getElementById("loadImagesBtn"),
  buildUrlBtn: document.getElementById("buildUrlBtn"),
  copyUrlBtn: document.getElementById("copyUrlBtn"),
  toggleThemeButton: document.getElementById("toggleThemeButton"),
  themeIcon: document.getElementById("theme-icon"),
};

let cachedXmlText = "";
let cachedSelectedImages = null;

/**
 * Build the base URL for the display page.
 * @returns {string} Absolute URL to /tv/display/
 */
function getDisplayBaseUrl() {
  const displayUrl = new URL("display/", window.location.href);
  return displayUrl.toString();
}

/**
 * Normalize a stock number for comparisons.
 * @param {string} value Raw stock number string.
 * @returns {string} Normalized value.
 */
function normalizeStockNumber(value) {
  return (value || "").trim().toUpperCase();
}

/**
 * Read the launcher stock number from URL params.
 * @returns {string} Stock number from the query string.
 */
function getLauncherStockFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return normalizeStockNumber(params.get("stockInput") || params.get("s") || "");
}

/**
 * Read a number param from the launcher URL.
 * @param {string} key Query param key.
 * @param {number} fallback Default value.
 * @returns {number} Parsed number.
 */
function getLauncherNumberParam(key, fallback) {
  const params = new URLSearchParams(window.location.search);
  const value = Number.parseInt(params.get(key), 10);
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Read text param from the launcher URL.
 * @param {string} key Query param key.
 * @returns {string} Param value.
 */
function getLauncherTextParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || "";
}

/**
 * Fetch selected-images JSON for curated picks.
 * @returns {Promise<object>} Selected images map.
 */
async function fetchSelectedImages() {
  if (cachedSelectedImages) return cachedSelectedImages;
  try {
    const response = await fetch("./selected-images.json", { cache: "no-cache" });
    if (!response.ok) {
      cachedSelectedImages = {};
      return cachedSelectedImages;
    }
    cachedSelectedImages = await response.json();
    return cachedSelectedImages;
  } catch (error) {
    console.error("Selected images load failed:", error);
    cachedSelectedImages = {};
    return cachedSelectedImages;
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
 * Read the selected layout option from the launcher.
 * @returns {string} Selected layout value.
 */
function getSelectedLayout() {
  const selected = DOM.layoutOptions.find((option) => option.checked);
  return selected ? selected.value : "portrait";
}

/**
 * Fetch the XML feed text, with simple in-memory caching.
 * @returns {Promise<string>} XML feed text.
 */
async function fetchXmlText() {
  if (cachedXmlText) return cachedXmlText;
  const response = await fetch(XML_FEED_URL);
  if (!response.ok) {
    throw new Error(`XML fetch failed: ${response.status}`);
  }
  cachedXmlText = await response.text();
  return cachedXmlText;
}

/**
 * Parse XML and return item nodes.
 * @param {string} xmlText XML string.
 * @returns {Element[]} Array of item nodes.
 */
function parseItems(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  return Array.from(xmlDoc.getElementsByTagName("item"));
}

/**
 * Extract text content from an XML item tag.
 * @param {Element} item XML item element.
 * @param {string} tagName Tag to read.
 * @returns {string} Tag text or empty string.
 */
function getItemText(item, tagName) {
  return item.getElementsByTagName(tagName)[0]?.textContent?.trim() || "";
}

/**
 * Return image URLs from an XML item.
 * @param {Element} item XML item element.
 * @returns {string[]} Array of image URLs.
 */
function getItemImages(item) {
  return Array.from(item.getElementsByTagName("imageurl"))
    .map((node) => node.textContent?.trim() || "")
    .filter(Boolean);
}

/**
 * Render image choices in the UI.
 * @param {string[]} urls Image URLs to display.
 */
function renderImageChoices(urls) {
  DOM.imageResults.innerHTML = "";

  if (!urls.length) {
    DOM.imageResults.innerHTML = `<div class="col-12"><div class="alert alert-secondary">No images found.</div></div>`;
    return;
  }

  DOM.imageResults.innerHTML = urls
    .map(
      (url) => `
        <div class="col-6 col-md-4">
          <div class="tv-panel p-2">
            <img class="tv-thumb mb-2" src="${url}" alt="Vehicle image" />
            <button class="btn btn-sm btn-outline-light w-100" data-image-url="${url}">Use Image</button>
          </div>
        </div>
      `
    )
    .join("");
}

/**
 * Build the display URL from current form values.
 * @returns {string} URL string.
 */
function buildDisplayUrl() {
  const layout = getSelectedLayout();
  const category = DOM.categorySelect.value;
  const stockNumber = normalizeStockNumber(DOM.stockInput.value);
  const imageUrl = DOM.imageUrlInput.value.trim();
  const customText = DOM.customTextInput.value.trim();
  const swatchColor = DOM.colorPickerInput?.value?.trim();
  const accentOne = DOM.accentColorOneInput?.value?.trim();
  const accentTwo = DOM.accentColorTwoInput?.value?.trim();
  const slideStart = Number.parseInt(DOM.slideStartInput?.value, 10);
  const slideEnd = Number.parseInt(DOM.slideEndInput?.value, 10);
  const theme = document.body.getAttribute("data-bs-theme") || "dark";

  const url = new URL(getDisplayBaseUrl());
  url.searchParams.set("layout", layout);

  if (stockNumber) url.searchParams.set("s", stockNumber);
  if (category) url.searchParams.set("category", category);
  if (imageUrl) url.searchParams.set("img", imageUrl);
  if (customText) url.searchParams.set("note", customText);
  if (swatchColor) url.searchParams.set("swatch", swatchColor);
  if (accentOne) url.searchParams.set("accent1", accentOne);
  if (accentTwo) url.searchParams.set("accent2", accentTwo);
  if (Number.isFinite(slideStart)) url.searchParams.set("slideStart", slideStart);
  if (Number.isFinite(slideEnd)) url.searchParams.set("slideEnd", slideEnd);
  if (theme) url.searchParams.set("theme", theme);

  return url.toString();
}

/**
 * Copy the output URL to the clipboard if possible.
 */
async function copyUrlToClipboard() {
  const url = DOM.urlOutput.value.trim();
  if (!url) return;

  try {
    await navigator.clipboard.writeText(url);
    DOM.copyUrlBtn.innerHTML = `<i class="bi bi-clipboard-check me-2"></i>Copied`;
    setTimeout(() => {
      DOM.copyUrlBtn.innerHTML = `<i class="bi bi-clipboard-check me-2"></i>Copy URL`;
    }, 1200);
  } catch (error) {
    console.error("Clipboard copy failed:", error);
  }
}

/**
 * Load images for a given stock number from the XML feed.
 */
async function handleLoadImages() {
  const stockNumber = normalizeStockNumber(DOM.stockInput.value);
  if (!stockNumber) {
    DOM.imageResults.innerHTML = `<div class="col-12"><div class="alert alert-warning">Enter a stock number first.</div></div>`;
    return;
  }

  try {
    const [xmlText, selectedMap] = await Promise.all([fetchXmlText(), fetchSelectedImages()]);
    const items = parseItems(xmlText);
    const match = items.find((item) => normalizeStockNumber(getItemText(item, "stocknumber")) === stockNumber);
    if (!match) {
      DOM.imageResults.innerHTML = `<div class="col-12"><div class="alert alert-danger">Stock number not found in XML.</div></div>`;
      return;
    }
    const saved = getSavedPicks(selectedMap, stockNumber);
    if (saved.text) {
      DOM.customTextInput.value = saved.text;
    }
    const mergedImages = [...saved.images, ...getItemImages(match).filter((url) => !saved.images.includes(url))];
    renderImageChoices(mergedImages);
  } catch (error) {
    console.error("Image load error:", error);
    DOM.imageResults.innerHTML = `<div class="col-12"><div class="alert alert-danger">Failed to load images.</div></div>`;
  }
}

/**
 * Handle clicks on image selection buttons.
 * @param {MouseEvent} event Click event.
 */
function handleImageSelection(event) {
  const button = event.target.closest("[data-image-url]");
  if (!button) return;
  const url = button.getAttribute("data-image-url");
  DOM.imageUrlInput.value = url;
}

/**
 * Initialize launcher event listeners.
 */
/**
 * Update the theme icon for the current theme.
 * @param {string} theme Theme name.
 */
function updateThemeIcon(theme) {
  if (!DOM.themeIcon) return;
  if (theme === "dark") {
    DOM.themeIcon.classList.remove("bi-brightness-high");
    DOM.themeIcon.classList.add("bi-moon-stars");
  } else {
    DOM.themeIcon.classList.remove("bi-moon-stars");
    DOM.themeIcon.classList.add("bi-brightness-high");
  }
}

/**
 * Toggle between light and dark themes.
 */
function toggleTheme() {
  const currentTheme = document.body.getAttribute("data-bs-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
}

function initLauncher() {
  if (!DOM.stockInput) return;
  const initialStock = getLauncherStockFromUrl();
  if (initialStock) {
    DOM.stockInput.value = initialStock;
    DOM.stockInput.dispatchEvent(new Event("input", { bubbles: true }));
  }
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.setAttribute("data-bs-theme", savedTheme);
  updateThemeIcon(savedTheme);
  if (DOM.slideStartInput) {
    DOM.slideStartInput.value = getLauncherNumberParam("slideStart", 2);
  }
  if (DOM.slideEndInput) {
    DOM.slideEndInput.value = getLauncherNumberParam("slideEnd", 6);
  }
  if (DOM.customTextInput) {
    DOM.customTextInput.value = getLauncherTextParam("note");
  }
  if (DOM.colorPickerInput) {
    DOM.colorPickerInput.value = getLauncherTextParam("swatch") || "#4bd2b1";
  }
  if (DOM.accentColorOneInput) {
    DOM.accentColorOneInput.value = getLauncherTextParam("accent1") || "#1f6feb";
  }
  if (DOM.accentColorTwoInput) {
    DOM.accentColorTwoInput.value = getLauncherTextParam("accent2") || "#f97316";
  }
  if (DOM.toggleThemeButton) {
    DOM.toggleThemeButton.addEventListener("click", toggleTheme);
  }
  DOM.loadImagesBtn.addEventListener("click", handleLoadImages);
  DOM.buildUrlBtn.addEventListener("click", () => {
    DOM.urlOutput.value = buildDisplayUrl();
  });
  DOM.copyUrlBtn.addEventListener("click", copyUrlToClipboard);
  DOM.imageResults.addEventListener("click", handleImageSelection);
}

initLauncher();
