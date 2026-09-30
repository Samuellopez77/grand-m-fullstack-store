import { useEffect, useState } from 'react'

const landingSlides = [
  { image: 'grandm-look-statement-sneaker.jpg', kicker: 'GRAND_M / 01', title: 'Built to make an entrance.', route: 'sneakers' },
  { image: 'grandm-look-everyday-shirt.jpg', kicker: 'GRAND_M / 02', title: 'Your everyday, elevated.', route: 'tops' },
  { image: 'grandm-look-comfort-hoodie.jpg', kicker: 'GRAND_M / 03', title: 'Comfort that moves with you.', route: 'hoodies' },
  { image: 'grandm-look-tailored-casual.jpg', kicker: 'GRAND_M / 04', title: 'A sharper kind of casual.', route: 'collections' },
  { image: 'grandm-look-next-sneaker.jpg', kicker: 'GRAND_M / 05', title: 'The next pair starts here.', route: 'sneakers' },
  { image: 'grandm-look-designer-dress-shoe.jpg', kicker: 'GRAND_M / 06', title: 'Made for the well dressed.', route: 'sneakers' },
  { image: 'grandm-look-resort-shirt.jpg', kicker: 'GRAND_M / 07', title: 'Easy pieces. Strong point of view.', route: 'tops' },
]

const landingImage = (image) => encodeURI(`/images/landing/${image}`)

function HeroGallery({ navigate }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSlide = landingSlides[activeIndex]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % landingSlides.length)
    }, 4500)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <section aria-label="Featured product gallery" className="hero-gallery">
      <p className="gallery-vertical-label">Always in motion</p>
      <div className="gallery-stage">
        <div className="gallery-frame">
          <img alt={activeSlide.title} className="gallery-image" key={activeSlide.image} src={landingImage(activeSlide.image)} />
          <div className="gallery-overlay">
            <p>{activeSlide.kicker}</p>
            <h2>{activeSlide.title}</h2>
            <button onClick={() => navigate(activeSlide.route)} type="button">Discover piece <span>›</span></button>
          </div>
        </div>
      </div>
      <div className="gallery-controls">
        <button aria-label="Show previous featured image" onClick={() => setActiveIndex((index) => (index - 1 + landingSlides.length) % landingSlides.length)} type="button">←</button>
        <div className="gallery-dots">
          {landingSlides.map((slide, index) => <button aria-label={`Show ${slide.title}`} className={index === activeIndex ? 'active' : ''} key={slide.image} onClick={() => setActiveIndex(index)} type="button" />)}
        </div>
        <button aria-label="Show next featured image" onClick={() => setActiveIndex((index) => (index + 1) % landingSlides.length)} type="button">→</button>
      </div>
    </section>
  )
}

export default HeroGallery