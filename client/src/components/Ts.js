import { createWorker } from "tesseract.js"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// OCR Statuses
const STATUSES = {
  IDLE: "",
  FAILED: "Failed to perform OCR",
  PENDING: "Processing...",
  SUCCEEDED: "Completed",
}

export default function Ts({onReadOcrData, onRemoveClicked}) {
    // const navigate = useNavigate();
    // const [active, setActive] = useState("1");
    const [selectedImage, setSelectedImage] = useState(4)
    const [ocrState, setOcrState] = useState(STATUSES.IDLE)
    const worker = createWorker()
    // const [ocrData, setOcrData] = useState("1")

  // Receive OCR data as a prop from the child component
    
    // Process image with OCR
    const readImageText = async() => {
      setOcrState(STATUSES.PENDING)
      try {
        await worker.load()
        // Set the language to recognize
        await worker.loadLanguage("eng")
        await worker.initialize("eng")
        const { data: { text } }= await worker.recognize(selectedImage) 
        await worker.terminate()
  
        onReadOcrData(text)
        setOcrState(STATUSES.SUCCEEDED)
      } catch (err) {
        setOcrState(STATUSES.FAILED)
      }
    }


// Executed when "Use another image" is selected
const handleRemoveClicked = () => {
    setSelectedImage(null)
    onRemoveClicked()
    setOcrState(STATUSES.IDLE)
  }

  return (
    <div className="pt-2 lg:pt-0 pb-10 lg:pb-0 ">
    
      {selectedImage && (
        <div>
          <img src={URL.createObjectURL(selectedImage)} alt="scanned file"  />
        </div>
      )}
      <div className="bg-rp-black lg:w-3/4 w-[86%] p-5 flex lg:m-auto ml-5 lg:mt-28  rounded-md justify-center">
        {selectedImage?
          <div className="button-container">
            <button onClick={readImageText}>Process the image with OCR</button>
            <button
              className="remove-button"
              disabled={ocrState === STATUSES.PENDING}
              onClick={handleRemoveClicked}
            >
                Use another image
            </button>
          </div>
          :
          <>
            <p>Upload an image to process</p>
            <input
              type="file"
              name="ocr-image"
              onChange={(event) => {
                setSelectedImage(event.target.files[0])
              }}
            />
            <p>Supported formats:bmp, jpg, png, pbm</p>
          </>
        }
      </div>
      <div className="status">
        {ocrState}
      </div>
      <br />
    </div>
    
  )  

 }
