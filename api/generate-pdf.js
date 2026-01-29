/**
 * Vercel serverless function to generate PDF using Adobe PDF Services API.
 * Converts a URL to PDF and returns it for download.
 */

const PDFServicesSdk = require("@adobe/pdfservices-node-sdk");
const { Readable } = require("stream");

/**
 * Convert stream to buffer.
 */
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url, filename = "document.pdf" } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Set up credentials from environment variables
    const credentials = PDFServicesSdk.Credentials.servicePrincipalCredentialsBuilder()
      .withClientId(process.env.ADOBE_CLIENT_ID)
      .withClientSecret(process.env.ADOBE_CLIENT_SECRET)
      .build();

    // Create execution context
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

    // Create HTML to PDF operation
    const htmlToPDFOperation = PDFServicesSdk.CreatePDF.Operation.createNew();

    // Set the URL to convert
    const input = PDFServicesSdk.FileRef.createFromURL(url);
    htmlToPDFOperation.setInput(input);

    // Set options for PDF creation
    const options = new PDFServicesSdk.CreatePDF.options.html.CreatePDFFromHtmlOptions.Builder()
      .includeHeaderFooter(false)
      .withPageLayout(
        new PDFServicesSdk.CreatePDF.options.PageLayout.Builder()
          .pageSize(8.5, 11) // Letter size
          .build()
      )
      .build();
    htmlToPDFOperation.setOptions(options);

    // Execute the operation
    const result = await htmlToPDFOperation.execute(executionContext);

    // Get the PDF as a stream
    const resultStream = result.getReadStream();
    const pdfBuffer = await streamToBuffer(resultStream);

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    return res.status(500).json({
      error: "PDF generation failed",
      details: error.message,
    });
  }
};
