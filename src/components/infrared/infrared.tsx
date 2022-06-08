import { useState } from "react"
import { useUnsplashImage, ImgReturn } from "../../hooks"
import styles from "./infrared.module.scss"
export const Infrared = (): JSX.Element => {
  const [readyImgBase, setReadyImgBase] = useState<boolean>(false)
  const [readyImgStyled, setReadyImgStyled] = useState<boolean>(false)

  const img: ImgReturn | undefined = useUnsplashImage()
  // const img: ImgReturn | undefined = {
  //   url: "https://images.unsplash.com/photo-1448375240586-882707db888b?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMzU0MDR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTQ1ODg5MDk&ixlib=rb-1.2.1&q=80",
  //   width: 3936,
  // }

  const invert = 1
  const saturate = 0.75
  const hueRotate = Math.floor(Math.random() * (360 - 275 + 1) + 275)

  console.log("img", img)
  return (
    <div id="wrapper">
      <div className={styles.container} id="render">
        {img ? (
          <>
            <img
              className={styles.infraBack}
              src={img.url}
              alt="base"
              onLoad={() => setReadyImgBase(true)}
            />
            <img
              className={styles.infraFront}
              src={img.url}
              style={{
                filter: `invert(${invert}) saturate(${saturate}) hue-rotate(${hueRotate}deg)`,
              }}
              alt="styled"
              onLoad={() => setReadyImgStyled(true)}
            />
          </>
        ) : (
          <p style={{ margin: 100 }}>
            Either the image is being fetched or the API limit is exhausted
            :&#40; <br />
            If it happens again check back in an hour.{" "}
          </p>
        )}
      </div>
      {readyImgBase && readyImgStyled && <div id="puppeteer-catch"></div>}
    </div>
  )
}
