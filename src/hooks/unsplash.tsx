import { useEffect, useState, useCallback } from "react"
import { getRandomKeyword } from "../util"

export interface ImgReturn {
  url: string
  width: number
  id: string
}

export function useUnsplashImage() {
  const [img, setImg] = useState<ImgReturn | undefined>()
  const key = process.env.REACT_APP_UNSPLASH

  const performSearch = useCallback(
    (query = getRandomKeyword()) => {
      fetch(
        `https://api.unsplash.com/photos/random?query=${query}&client_id=${key}&count=1&orientation=landscape`
      )
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData)
          setImg({
            url: responseData[0].urls.full,
            width: responseData[0].width,
            id: responseData[0].id,
          })
        })
        .catch((error) => {
          console.log("Error fetching and parsing unsplash img", error)
        })
    },
    [key]
  )

  useEffect(() => {
    performSearch()
  }, [performSearch])

  return img
}
