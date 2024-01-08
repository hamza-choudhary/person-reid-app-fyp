import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface CarosalProps {
  setShowCarosal: (showCarosal: boolean) => void
  showCarosal: boolean
  imageType: string
  images: string[]
  firstIndex: number
}

const Carosal: React.FC<CarosalProps> = ({
  imageType,
  images,
  showCarosal,
  setShowCarosal,
  firstIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setCurrentIndex(firstIndex)
  }, [firstIndex])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    )
  }

  if (!showCarosal) return null

  return createPortal(
    <>
      <div
        className="flex justify-center items-center overflow-x-hidden fixed inset-0 z-[1200]"
        onClick={() => setShowCarosal(false)}
      >
        <div className="relative"></div>
        <div className="z-[1201]" onClick={(e) => e.stopPropagation()}>
          <img
            className="object-cover object-cente max-h-[90vh] max-w-[80vw]"
            src={`http://localhost:8080/uploads/${imageType}/${images[currentIndex]}`}
            alt="Carousel Image"
          />
        </div>

        <div
          className="absolute z-[1204] w-[50vw] h-auto flex justify-between items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="p-2 rounded-full opacity-30 bg-black"
            onClick={goToPrevious}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="p-2 rounded-full opacity-30 bg-black"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        {/* Background overlay */}
        <div className="opacity-25 fixed inset-0 bg-black"></div>
      </div>
      ,
    </>,
    document.getElementById('carosal-root') as HTMLElement
  )
}

export default Carosal
