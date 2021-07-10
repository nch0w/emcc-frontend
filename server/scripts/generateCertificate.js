const { PDFDocument, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const certFile = fs.readFileSync("assets/EMCC-certificate.pdf");
const awardCertFile = fs.readFileSync("assets/award-certificate-2.pdf");

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

async function genAwardCertificate(name, awardName) {
  const pdfDoc = await PDFDocument.load(awardCertFile);
  const font = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const awardFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const pages = pdfDoc.getPages();
  const { width, height } = pages[0].getSize();

  const textSize = 24;
  const nameWidth = font.widthOfTextAtSize(name, textSize);
  const awardWidth = font.widthOfTextAtSize(awardName, textSize);

  pages[0].drawText(name, {
    x: width / 2 - nameWidth / 2,
    y: height - 270,
    size: textSize,
    font
  });
  pages[0].drawText(awardName, {
    x: width / 2 - awardWidth / 2,
    y: height - 205,
    size: textSize,
    font: font
  });
  const pdfBytes = await pdfDoc.save();
  // await fs.writeFileSync("assets/new-certificate.pdf", pdfBytes);
  return pdfBytes;
}

module.exports = { genCertificate, genAwardCertificate };
