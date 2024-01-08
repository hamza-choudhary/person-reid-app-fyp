import axios from "axios"
import { useEffect, useState } from "react"
import ResponsiveDrawer from "../../components/Sidebar"
import GallerySelection from "./components/GallerySelection"
import ImageResults from "./components/ImageResults"
import QuerySelection from "./components/QuerySelection"
import Button from "../../components/UI/Button"

interface QueryItem {
  _id: string
  image: string
  name: string
  description?: string
  createdAt?: string
}

interface GalleryItem {
  _id: string
  size: number
  image: string
  createdAt: Date
}
interface MyFormData {
  queryId: string
  galleryId: string
}

enum Step {
  SelectQuery,
  SelectGallery,
  ShowHelloWorld,
}

interface SelectedQueryInterface {
  imageName: string
  name: string
  description?: string
  createdAt?: string
}

export default function InferencePage() {
  const [queries, setQueries] = useState<QueryItem[]>([])
  const [galleries, setGalleries] = useState<GalleryItem[]>([])
  const [error, setError] = useState<string>("")

  const [currentStep, setCurrentStep] = useState<Step>(Step.SelectQuery)
  const [selectedQuery, setSelectedQuery] = useState<SelectedQueryInterface>({
    imageName: "",
    name: "",
    description: "",
    createdAt: "",
  })
  const [formData, setFormData] = useState<MyFormData>({
    queryId: "",
    galleryId: "",
  })

  const handleSubmit = async () => {
    // console.log(formData)

    try {
      const response = await axios.post(
        "http://localhost:8080/api/results",
        {
          queryId: formData.queryId,
          galleryId: formData.galleryId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      console.log("Upload successful", response.data)
    } catch (error) {
      //FIME: handle success and error
      console.error("Upload failed", error)
    }
  }

  const handleContinue = () => {
    if (currentStep === Step.SelectQuery && formData.queryId) {
      setCurrentStep(Step.SelectGallery)
      const query = queries.find((query) => query._id === formData.queryId)

      let date
      if (query?.createdAt) {
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
        date = new Date(query?.createdAt)
          .toLocaleString("en-US", options)
          .replace(/(\d+)\/(\d+)\/(\d+),\s(\d+:\d+\s[APM]+)/, "$2/$1/$3 $4")
      }

      setSelectedQuery({
        imageName: query?.image || "", // assuming query has an `image` property, replace "" with a default value if needed
        name: query?.name || "",
        description: query?.description || "",
        createdAt: date || "",
      })
    } else if (currentStep === Step.SelectGallery && formData.galleryId) {
      setCurrentStep(Step.ShowHelloWorld)
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep === Step.SelectGallery) {
      setCurrentStep(Step.SelectQuery)
      setFormData({ ...formData, galleryId: "" })
    }
  }

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/queries")
        if (response.data.status !== "ok") {
          throw new Error("Failed to fetch queries")
        }
        setQueries(response.data.data)
      } catch (err) {
        setError("Error fetching queries")
      }
    }

    const fetchGalleries = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/galleries")
        if (response.data.status !== "ok") {
          throw new Error("Failed to fetch galleries")
        }
        setGalleries(response.data.data)
      } catch (err) {
        setError("Error fetching galleries")
      }
    }

    fetchQueries()
    fetchGalleries()
  }, [])

  return (
    <ResponsiveDrawer className="p-4">
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          {currentStep === Step.SelectQuery && (
            <QuerySelection
              queries={queries}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {currentStep === Step.SelectGallery && (
            <GallerySelection
              galleries={galleries}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {currentStep === Step.ShowHelloWorld && (
            <ImageResults
              query={selectedQuery}
              setCurrentStep={setCurrentStep}
            />
          )}

          {currentStep !== Step.ShowHelloWorld && (
            <div className="flex justify-center items-center gap-6 mt-16">
              {currentStep !== Step.SelectQuery && (
                <Button
                  className="font-medium bg-yellow-400 w-40 py-3"
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}

              {(currentStep === Step.SelectQuery && formData.queryId) ||
              (currentStep === Step.SelectGallery && formData.galleryId) ? (
                <Button
                  className="font-medium w-40 py-3"
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  className="font-medium w-40 py-3 bg-slate-400 cursor-not-allowed"
                  disabled={true}
                >
                  Continue
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </ResponsiveDrawer>
  )
}
