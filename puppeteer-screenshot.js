const puppeteer = require("puppeteer")

;(async () => {
  //   const browser = await puppeteer.launch()
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })
  console.log("before")
  await page.goto("http://localhost:3000/")
  console.log("after")
  await page.waitForSelector("#puppeteer-catch")
  console.log("images rendered")
  const elem = await page.$("#render")
  const boundingBox = await elem.boundingBox()
  console.log("boundingBox", boundingBox)
  await page.screenshot({
    type: "jpeg",
    quality: 90,
    path: "captures/my_screenshot.png",
    fullPage: false,
    clip: {
      x: boundingBox.x,
      y: boundingBox.y,
      width: Math.floor(boundingBox.width),
      height: Math.floor(boundingBox.height) - 30,
    },
  })
  await browser.close()
})()
