const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://localhost:8000');
  await new Promise(r => setTimeout(r, 2000));
  
  await page.click('#hamburger');
  await new Promise(r => setTimeout(r, 1000));
  
  const links = await page.$$eval('.mobile-nav a', els => els.map(el => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return {
      text: el.innerText,
      rect: {x: rect.x, y: rect.y, width: rect.width, height: rect.height},
      opacity: style.opacity,
      display: style.display,
      visibility: style.visibility,
      color: style.color
    };
  }));
  
  console.log(JSON.stringify(links, null, 2));
  await browser.close();
})();
