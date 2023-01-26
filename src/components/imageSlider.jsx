import React, { useState, useEffect } from "react"

const ImageSlider = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [intervalId, setIntervalId] = useState(null)

  const handlePrevClick = () => {
    if (currentImage === 0) {
      setCurrentImage(images.length - 1)
    } else {
      setCurrentImage(currentImage - 1)
    }
  }

  const handleNextClick = () => {
    if (currentImage === images.length - 1) {
      setCurrentImage(0)
    } else {
      setCurrentImage(currentImage + 1)
    }
  }

  useEffect(() => {
    setIntervalId(setInterval(() => handleNextClick(), 1800))
    return () => clearInterval(intervalId)
  }, [currentImage])

  const handleMouseEnter = () => {
    clearInterval(intervalId)
  }

  const handleMouseLeave = () => {
    setIntervalId(setInterval(() => handleNextClick(), 1800))
  }

  return (
    <div className="relative">
      <img
        src={images[currentImage]}
        alt="Slider Image"
        className="w-2/5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <button
        className="absolute top-0 left-0 -ml-8 -mt-8 p-2 rounded-full bg-gray-600 text-white hover:bg-gray-800"
        onClick={handlePrevClick}
      >
        Prev
      </button>
      <button
        className="absolute top-0 right-0 -mr-8 -mt-8 p-2 rounded-full bg-gray-600 text-white hover:bg-gray-800"
        onClick={handleNextClick}
      >
        Next
      </button>
    </div>
  )
}

export default ImageSlider
