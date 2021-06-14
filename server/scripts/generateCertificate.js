const { PDFDocument, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const certFile = fs.readFileSync("assets/EMCC-certificate.pdf");

async function genCertificate(name) {
  const pdfDoc = await PDFDocument.load(certFile);
  const font = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const pages = pdfDoc.getPages();
  const { width, height } = pages[0].getSize();

  const textSize = 24;
  const textWidth = font.widthOfTextAtSize(name, textSize);
  const textHeight = font.heightAtSize(textSize);

  pages[0].drawText(name, {
    x: width / 2 - textWidth / 2,
    y: height - 270,
    size: textSize,
    font
  });
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
  //   await fs.writeFileSync("../assets/new-certificate.pdf", pdfBytes);
}

module.exports = genCertificate;
