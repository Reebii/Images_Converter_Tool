// App.jsx
import React, { useState } from "react";
import * as FileSaver from "file-saver";
import "./App.css";

const App = () => {
  const [imageFile, setImageFile] = useState(null);
  const [format, setFormat] = useState("png");
  const [convertedImage, setConvertedImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleConvert = () => {
    if (!imageFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          setConvertedImage(blob);
        }, `image/${format}`);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const handleDownload = () => {
    if (convertedImage) {
      FileSaver.saveAs(convertedImage, `converted.${format}`);
    }
  };

  return (
    <div className="app-container">
      <div className="converter-box">
        <h1>Image Converter</h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />

        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="format-select"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WEBP</option>
          <option value="bmp">BMP</option>
        </select>

        <button onClick={handleConvert} className="convert-button">
          Convert
        </button>

        {convertedImage && (
          <button onClick={handleDownload} className="download-button">
            Download Converted Image
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
