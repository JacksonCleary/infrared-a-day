require("dotenv").config()
const puppeteer = require("puppeteer")
const { ImgurClient } = require("imgur")
const winston = require("winston")

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "puppeteer" },
  transports: [
    //
    // - Write all logs with importance level of `error` to error.log
    // - Write all logs with importance level of `info` to info.log
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "info.log", level: "info" }),
  ],
})

const development = process.env.INFRARED_DEBUG === "TRUE"

const launchHeadless = true
const viewportWidth = 1920
const viewportHeight = 1080
const selectorToWaitFor = "#puppeteer-catch"
const imgSelectorToQueryDimensions = "#render"
const imgQuality = 90
const imgDirectory = "captures"

;(async () => {
  const browser = await puppeteer.launch({ headless: launchHeadless })
  const page = await browser.newPage()
  await page.setViewport({ width: viewportWidth, height: viewportHeight })
  await page.goto(process.env.INFRARED_PUPPETEER_PAGE)

  try {
    await page.waitForSelector(selectorToWaitFor)
  } catch (e) {
    if (development) {
      logger.log({
        level: "error",
        message: "Failed to grab selector - timeout",
      })
    }
    await browser.close()
  }
  const trigger = await page.$(selectorToWaitFor)
  const id = await trigger.evaluate((el) => el.textContent)
  const elem = await page.$(imgSelectorToQueryDimensions)
  const boundingBox = await elem.boundingBox()
  await page
    .screenshot({
      type: "jpeg",
      quality: imgQuality,
      path: `${imgDirectory}/${id}.jpeg`,
      fullPage: false,
      clip: {
        x: boundingBox.x,
        y: boundingBox.y,
        width: Math.floor(boundingBox.width),
        height: Math.floor(boundingBox.height),
      },
    })
    .then((stream) => {
      const client = new ImgurClient({
        clientId: process.env.INFRARED_IMGUR_CLIENT_ID,
        clientSecret: process.env.INFRARED_IMGUR_CLIENT_SECRET,
        refreshToken: process.env.INFRARED_IMGUR_REFRESH_TOKEN,
      })
      try {
        client
          .upload({
            image: stream,
            title: `Infrared-esque: ${id}`,
            description: `Source Image: https://unsplash.com/photos/${id}`,
            type: "stream",
            album: process.env.INFRARED_IMGUR_ALBUM_ID,
          })
          .then((response) => {
            if (development) {
              if (response.success) {
                logger.log({
                  level: "info",
                  message: `success - ${response.status} - ${response.data.link}`,
                })
              } else {
                logger.log({
                  level: "error",
                  message: `error - ${response.status} - ${response.data}`,
                })
              }
            }
          })
      } catch (e) {
        if (development) {
          logger.log({
            level: "error",
            message: "error - " + JSON.stringify(e),
          })
        }
      }
    })
  await browser.close()
})()
