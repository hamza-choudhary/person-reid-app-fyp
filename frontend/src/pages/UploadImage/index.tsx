import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function UploadImage() {
  const [queryFile, setQueryFile] = useState<any>(null);
  const [queryPreview, setQueryPreview] = useState<null | string>("");
  const [galleryFiles, setGalleryFiles] = useState<any>([]);
  const [galleryPreview, setGalleryPreview] = useState<null | string[]>([]);
  const [resultPaths, setResultPaths] = useState<null | string[]>([]);

  // create a queryPreview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!queryFile) {
      setQueryPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(queryFile);
    setQueryPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [queryFile]);

  useEffect(() => {
    if (!galleryFiles) {
      setQueryPreview(null);
      return;
    }

    const objectUrl = Array.from(galleryFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setGalleryPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () =>
      Array.from(galleryFiles).map((file) => URL.createObjectURL(file));
  }, [galleryFiles]);

  const onSelectQueryFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setQueryFile(null);
      return;
    }

    setQueryFile(e.target.files[0]);
  };
  const onSelectGalleryFiles = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setQueryFile(null);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setGalleryFiles(e.target.files);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!queryFile || !galleryFiles || galleryFiles.length === 0) {
      console.error("Please select both query and gallery images.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("query", queryFile);

      // Append gallery images, assuming your server expects them as an array
      for (let i = 0; i < galleryFiles.length; i++) {
        formData.append("gallery", galleryFiles[i]);
      }

      const response = await fetch("http://localhost:8080/prediction/upload", {
        method: "POST",
        body: formData,
      });

      // console.log(response); // Add this line to inspect the response

      const result = await response.json();
      // Handle the server's response as needed
      console.log("Server Response:", result);

      setResultPaths(result.data.result);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Layout>
      <section className="my-4">
        <h1 className="text-white">Upload Images</h1>
        <form
          onSubmit={submitHandler}
          method="post"
          encType="multipart/form-data"
          className="mt-7"
        >
          <div className="flex flex-wrap mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                htmlFor="query"
              >
                Upload Query
              </label>
              <input
                type="file"
                id="query"
                className="text-sm text-grey-500 text-white file:mr-5 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:cursor-pointer hover:file:bg-amber-50 hover:file:text-amber-700"
                onChange={onSelectQueryFile}
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                htmlFor="gallery"
              >
                Upload Gallery
              </label>
              <input
                type="file"
                id="gallery"
                className="text-sm text-grey-500 text-white file:mr-5 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:cursor-pointer hover:file:bg-amber-50 hover:file:text-amber-700"
                onChange={onSelectGalleryFiles}
                multiple
                required
              />
            </div>
            <div className="flex justify-center w-full mt-32">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 border border-blue-700 rounded"
              >
                Make Predictions
              </button>
            </div>
          </div>
        </form>

        {/* Query Image */}
        {queryFile && (
          <div className="my-7">
            <h1 className="text-white">Query Image</h1>
            <div className="flex flex-wrap justify-center">
              <img
                className="h-auto w-1/3 rounded-lg"
                src={queryPreview}
                alt=""
              />
            </div>
          </div>
        )}

        {/* Gallery Images */}

        {galleryFiles && (
          <div className="my-7">
            <h1 className="text-white">Gallery Images</h1>
            <div className="m-5 grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryPreview?.map((preview, index) => (
                <img
                  key={index}
                  className="h-auto max-w-full rounded-lg"
                  src={preview}
                  alt=""
                />
              ))}
            </div>
          </div>
        )}

        {/* Result Images */}
        {resultPaths && (
          <div className="my-7">
            <h1 className="text-white">Results</h1>
            <div className="m-5 grid grid-cols-2 md:grid-cols-3 gap-4">
              {resultPaths?.map((preview, index) => (
                <img
                  key={index}
                  className="h-auto max-w-full rounded-lg"
                  src={preview}
                  alt=""
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
