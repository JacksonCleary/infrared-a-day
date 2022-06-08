const unsplashKeywords: Array<string> = [
  "forest",
  "desert",
  "city",
  "landscape",
  "beach",
  "flowers",
  "plants",
  "mountains",
  "snowtop",
]

export const getRandomKeyword = (): string => {
  return unsplashKeywords[Math.floor(Math.random() * unsplashKeywords.length)]
}
