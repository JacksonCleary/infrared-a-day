import { useUnsplashImage, ImgReturn } from "../../hooks"
import styles from "./infrared.module.scss"
export const Infrared = (): JSX.Element => {
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
    <div className={styles.container}>
      {img && (
        <>
          <img className={styles.infraBack} src={img.url} />
          <img
            className={styles.infraFront}
            src={img.url}
            style={{
              filter: `invert(${invert}) saturate(${saturate}) hue-rotate(${hueRotate}deg)`,
            }}
          />
        </>
      )}
    </div>
  )
}
