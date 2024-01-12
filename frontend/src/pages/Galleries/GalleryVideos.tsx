import axios from 'axios'
import { useEffect, useState } from 'react'
import Carosal from '../../components/Carosal/Carosal'
import Modal from '../../components/Modal/Modal'
import UploadImages from '../../components/UploadImages/UploadImages'
import { useAuth } from '../../hooks/useAuth'

type GalleryItem = {
  _id: string
  video: string
  createdAt: Date
}

export default function GalleryVideos() {
  const { user } = useAuth().state

  //FIXME: if gallery is empty then delete whole gallery

  const [showModal, setShowModal] = useState(false)
  const [deleteGalleryId, setDeleteGalleryId] = useState('')
  const [galleries, setGalleries] = useState<GalleryItem[]>([])

  const [showCarosal, setShowCarosal] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  const openCarosal = (index: number) => {
    setImageIndex(index)
    setShowCarosal(true)
  }

  const uploadGalleryHandler = async (formData: FormData) => {
    const newFormData = new FormData()

    for (const [key, value] of formData.entries()) {
      if (key === 'files') {
        // Change key from 'files' to 'gallery'
        newFormData.append('gallery', value)
      } else {
        // Append other entries as is
        newFormData.append(key, value)
      }
    }
    if (!user) {
      throw new Error('user._id is null cant upload')
    }

    newFormData.append('userId', user?._id)
    try {
      const response = await axios.post(
        'http://localhost:8080/api/galleries/videos',
        newFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response.data.status !== 'ok') {
        throw new Error('videos are not uploaded!')
      }
      const { data }: { data: GalleryItem[] } = response.data

      setGalleries((prev) => [
        ...prev,
        ...data.map((item) => ({
          _id: item._id,
          video: item.video,
          createdAt: item.createdAt,
        })),
      ])

      console.log(response)
    } catch (error) {
      //FIXME:L handle error and success
      console.log(error)
    }
  }

  const deleteGalleryHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/galleries/${deleteGalleryId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (response.data.status !== 'ok') {
        throw new Error('request is not sending to api!')
      }

      setGalleries((prev) =>
        prev.filter((gallery) => gallery._id !== deleteGalleryId)
      )
      setShowModal(false)
    } catch (error) {
      //FIXME: handle error and success
      console.log(error)
    }
  }

  useEffect(() => {
    const sendReq = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/galleries/videos'
        )
        if (response.data.status !== 'ok') {
          throw new Error('galleries are not fetched')
        }

        const { data }: { data: GalleryItem[] } = response.data
        setGalleries(data)
      } catch (error) {
        //FIXME: handle error and success
        console.log(error)
      }
    }

    sendReq()
  }, [])

  return (
    <>
      <div className="flex justify-end mb-4">
        <UploadImages
          className="text-lg"
          onSubmit={uploadGalleryHandler}
          buttonTxt="create new gallery"
          fileTye="video"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {galleries &&
          galleries.map((gallery, index) => {
            const options: Intl.DateTimeFormatOptions = {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }
            const date = new Date(gallery.createdAt)
              .toLocaleString('en-US', options)
              .replace(/(\d+)\/(\d+)\/(\d+),\s(\d+:\d+\s[APM]+)/, '$2/$1/$3 $4')

            return (
              <div
                key={gallery._id}
                className="relative cursor-pointer"
                onClick={() => openCarosal(index)}
              >
                <video
                  className="object-cover object-center w-full h-56 max-w-full rounded-lg"
                  src={`http://localhost:8080/uploads/gallery/${gallery.video}`}
                ></video>

                <div className="z-10 absolute inset-0 bg-black bg-opacity-35 flex flex-col rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                  <div
                    onClick={(event) => {
                      event.stopPropagation()
                      setShowModal(true)
                      setDeleteGalleryId(gallery._id)
                    }}
                    title="delete gallery"
                    className="self-end p-1 hover:rounded-full hover:bg-red-800 hover:bg-opacity-35 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#DC2626"
                      width="24"
                      height="24"
                      id="bin"
                    >
                      <path d="M9 3H7c0-1.7 1.3-3 3-3v2c-.6 0-1 .4-1 1zm8 0h-2c0-.6-.4-1-1-1V0c1.7 0 3 1.3 3 3zm0 3H7V3h2v1h6V3h2zm-7-6h4v2h-4z"></path>
                      <path d="M21 6H3c-.6 0-1-.4-1-1s.4-1 1-1h18c.6 0 1 .4 1 1s-.4 1-1 1zm-2 18H5c-.6 0-1-.4-1-1V9c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1zM6 22h12V10H6v12z"></path>
                      <path d="M10 20c-.6 0-1-.4-1-1v-6c0-.6.4-1 1-1s1 .4 1 1v6c0 .6-.4 1-1 1zm4 0c-.6 0-1-.4-1-1v-6c0-.6.4-1 1-1s1 .4 1 1v6c0 .6-.4 1-1 1z"></path>
                    </svg>
                  </div>
                  <div className=" flex flex-col justify-center items-center my-auto">
                    <p className="text-white">{date}</p>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
      <Carosal
        showCarosal={showCarosal}
        setShowCarosal={setShowCarosal}
        firstIndex={imageIndex}
        imageType="video"
        images={galleries}
      />
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <form
          onSubmit={deleteGalleryHandler}
          className="lg:w-[30rem] p-6"
          method="POST"
        >
          <h1 className="font-bold text-3xl text-center text-black">
            Delete Gallery
          </h1>
          <p className="font-regular text-center mt-4 text-black">
            Are you sure you want to delete the gallery?
          </p>
          <button
            type="submit"
            className="mt-11 block border-0 w-full p-2 text-title-xsml bg-primary text-white font-semibold rounded-md"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="block border-0 w-full p-2 text-title-xsml bg-gray-200 text-primary mt-4 font-semibold rounded-md"
          >
            Cancel
          </button>
        </form>
      </Modal>
    </>
  )
}
