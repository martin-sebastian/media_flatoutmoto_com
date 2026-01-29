const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

// Optimize chromium for serverless
chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

/**
 * Vercel serverless function to generate PDF using headless Chrome.
 */
module.exports = async (req, res) => {
  const { s: stockNumber } = req.query;

  if (!stockNumber) {
    return res.status(400).json({ error: "Missing stock number parameter (s)" });
  }

  // Always use the main domain to avoid hitting old deployment URLs
  const baseUrl = "https://media-flatoutmoto.vercel.app";

  const printUrl = `${baseUrl}/print/?s=${encodeURIComponent(stockNumber)}`;

  let browser = null;

  try {
    console.log("Starting browser...");
    
    browser = await puppeteer.launch({
      args: [...chromium.args, "--no-sandbox", "--disable-gpu"],
      defaultViewport: { width: 816, height: 1056 }, // Letter size at 96dpi
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    console.log("Browser started, creating page...");
    const page = await browser.newPage();

    console.log("Navigating to:", printUrl);
    await page.goto(printUrl, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait a bit for JS to execute
    await new Promise((r) => setTimeout(r, 5000));
    
    // Debug: get page content
    const content = await page.content();
    console.log("Page content length:", content.length);
    console.log("Has print-header:", content.includes("print-header"));
    console.log("Has Loading:", content.includes("Loading print layout"));
    
    // If still showing loading message, wait more
    if (content.includes("Loading print layout")) {
      console.log("Still loading, waiting more...");
      await new Promise((r) => setTimeout(r, 5000));
    }

    console.log("Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0.35in", right: "0.35in", bottom: "0.35in", left: "0.35in" },
    });

    console.log("PDF generated, size:", pdfBuffer.length);

    const filename = `${stockNumber}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send as binary
    res.end(pdfBuffer);
    return;
  } catch (error) {
    console.error("PDF generation error:", error.message);
    return res.status(500).json({
      error: "Failed to generate PDF",
      details: error.message,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
