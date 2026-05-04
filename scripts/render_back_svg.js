const sharp = require('sharp');
const fs = require('fs');

async function render(svgPath, outPng) {
  const svg = fs.readFileSync(svgPath, 'utf-8');
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outPng);
  console.log('Rendered', outPng);
}

(async () => {
  await render('public/man_back_side.svg', 'scripts/output/man_back_rendered.png');
  await render('public/women_back_side.svg', 'scripts/output/woman_back_rendered.png');
})();
