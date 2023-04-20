import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Segregator } from "../utilities/Categorysegregator";
import DoughnutChart from "./DoughnutChart";
import Investment from "../assets/Investment.svg";

export default function Ocr() {
  const navigate = useNavigate();
  const [active, setActive] = useState("4");
  // const startDate = new Date();
  // const [date, setDate] = useState({
  //   startdate: new Date(
  //     startDate.getFullYear(),
  //     startDate.getMonth() - 1,
  //     startDate.getDate()
  //   ).toDateString(),
  //   enddate: new Date(
  //     startDate.getFullYear(),
  //     startDate.getMonth(),
  //     startDate.getDate() + 1
  //   ).toDateString(),
  // });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault(); // prevent form from submitting

    if (!selectedFile) {
      alert('Please select an image file.');
      return;
    }

    // perform any additional validation or processing on the uploaded image file

    // submit the form to server or perform any further actions here
    console.log('Uploading image file:', selectedFile.name);

    // reset the form after submission (optional)
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div>
      <h1>OCR</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
}

//export default ocr;
