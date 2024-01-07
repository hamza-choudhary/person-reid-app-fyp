import React, { useState } from "react"
import Button from "../../../components/UI/Button"

enum Step {
  SelectQuery,
  SelectGallery,
  ShowHelloWorld,
}

//TODO: dont show start again until result response is done

type QueryItem = {
  imageName: string
  name: string
  description?: string
  createdAt?: string
}

interface ImageResultsProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>
  query: QueryItem
}

const ImageResults: React.FC<ImageResultsProps> = ({
  setCurrentStep,
  query,
}) => {
  const [results, setResults] = useState<string[]>([])
  // setCurrentStep(Step.SelectGallery)

  return (
    <>
      <h1 className="text-3xl font-bold text-center">Results</h1>
      <p className="mt-2 text-center">
        <strong>Note:</strong> Results will be refreshed after every 5 seconds
      </p>

      <div className="flex justify-center items-center my-12">
        <Button
          className="font-medium w-40 py-3"
          onClick={() => setCurrentStep(Step.SelectQuery)}
        >
          Start again
        </Button>
      </div>

      {/* Query Description */}
      <>
        <div className="flex">
          <img
            className="max-w-80 object-top object-cover rounded-sm max-h-[30rem]"
            src={`http://localhost:8080/uploads/query/${query.imageName}`}
            alt="query image"
          />
          <div className="flex flex-col pl-8">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold text-lg">Name: </h2>
              <p>{query.name}</p>
            </div>
            {query.createdAt && (
              <div className="flex items-center gap-4">
                <h2 className="font-semibold text-lg">Created At: </h2>
                <p>{query.createdAt}</p>
              </div>
            )}
            {query.description && (
              <div className="flex items-center gap-4">
                <h2 className="font-semibold text-lg">Description: </h2>
                <p>{query.description}</p>
              </div>
            )}
          </div>
        </div>
      </>
      {/* Results */}
      <>
        {results.length ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {results &&
                results?.map((image) => (
                  <div
                    key={image.substring(0, image.length - 4)}
                    className="relative cursor-pointer"
                  >
                    <img
                      className="object-cover object-center w-full h-56 max-w-full rounded-lg"
                      src={`http://localhost:8080/uploads/results/${image}`}
                    />
                    <div className="z-10 absolute inset-0 bg-black bg-opacity-35 flex flex-col rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                      {/* <div className=" flex flex-col justify-center items-center my-auto">
											<p className="text-white text-xl">
												{gallery.size} images
											</p>
											<p>{date}</p>
										</div> */}
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div>
            <h1 className="mt-4 text-center text-xl font-semibold">
              No Results Found {":("}
            </h1>
          </div>
        )}
      </>
    </>
  )
}

export default ImageResults
