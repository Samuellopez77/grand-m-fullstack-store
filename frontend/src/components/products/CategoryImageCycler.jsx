import { useEffect, useState } from 'react'

function CategoryImageCycler({ images }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length)
    }, 2800)

    return () => window.clearInterval(intervalId)
  }, [images])

  const image = images[activeIndex] ?? images[0]
  return <img alt="" className="collection-category-image" key={image} loading="lazy" src={image} />
}

export default CategoryImageCycler