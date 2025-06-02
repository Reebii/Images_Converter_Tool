import React, { useState } from "react";
import * as FileSaver from "file-saver";
import "./App.css";

const App = () => {
  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);
  const [format, setFormat] = useState("png");
  const [convertedImage, setConvertedImage] = useState(null);
  const [mergedImage, setMergedImage] = useState(null);

  // New state for image sizes
  const [size1, setSize1] = useState({ width: "", height: "" });
  const [size2, setSize2] = useState({ width: "", height: "" });

  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile1(file);
  };

  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile2(file);
  };

  const handleConvert = () => {
    if (!imageFile1) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            setConvertedImage(blob);
          },
          `image/${format}`
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(imageFile1);
  };

  const handleDownload = () => {
    if (convertedImage) {
      FileSaver.saveAs(convertedImage, `converted.${format}`);
    }
  };

  const handleMerge = () => {
    if (!imageFile1 || !imageFile2) return;

    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = (e1) => {
      const img1 = new Image();
      img1.onload = () => {
        reader2.onload = (e2) => {
          const img2 = new Image();
          img2.onload = () => {
            // Use user sizes if valid, else fallback to original image size
            const w1 = parseInt(size1.width) || img1.width;
            const h1 = parseInt(size1.height) || img1.height;
            const w2 = parseInt(size2.width) || img2.width;
            const h2 = parseInt(size2.height) || img2.height;

            // Merge side by side, width = sum of widths, height = max height
            const canvas = document.createElement("canvas");
            canvas.width = w1 + w2;
            canvas.height = Math.max(h1, h2);

            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img1, 0, 0, w1, h1);
            ctx.drawImage(img2, w1, 0, w2, h2);

            canvas.toBlob(
              (blob) => {
                setMergedImage(blob);
              },
              `image/${format}`
            );
          };
          img2.src = e2.target.result;
        };
        reader2.readAsDataURL(imageFile2);
      };
      img1.src = e1.target.result;
    };
    reader1.readAsDataURL(imageFile1);
  };

  const handleDownloadMerged = () => {
    if (mergedImage) {
      FileSaver.saveAs(mergedImage, `merged.${format}`);
    }
  };

  // Helper to update sizes
  const handleSizeChange = (e, imgNumber, dimension) => {
    const val = e.target.value;
    if (imgNumber === 1) {
      setSize1((prev) => ({ ...prev, [dimension]: val }));
    } else {
      setSize2((prev) => ({ ...prev, [dimension]: val }));
    }
  };

  return (
    <div className="app-container">
      <div className="converter-box">
        <h1>Image Converter & Merger</h1>

        <div>
          <label>Choose First Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange1}
            className="file-input"
          />
          <div className="size-input-container">
            <label>Width:</label>
            <input
              type="number"
              min="1"
              value={size1.width}
              onChange={(e) => handleSizeChange(e, 1, "width")}
              placeholder="auto"
            />
            <label>Height:</label>
            <input
              type="number"
              min="1"
              value={size1.height}
              onChange={(e) => handleSizeChange(e, 1, "height")}
              placeholder="auto"
            />
          </div>
        </div>

        <div>
          <label>Choose Second Image (for merge):</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange2}
            className="file-input"
          />
          <div className="size-input-container">
            <label>Width:</label>
            <input
              type="number"
              min="1"
              value={size2.width}
              onChange={(e) => handleSizeChange(e, 2, "width")}
              placeholder="auto"
            />
            <label>Height:</label>
            <input
              type="number"
              min="1"
              value={size2.height}
              onChange={(e) => handleSizeChange(e, 2, "height")}
              placeholder="auto"
            />
          </div>
        </div>

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
          Convert First Image
        </button>

        {convertedImage && (
          <button onClick={handleDownload} className="download-button">
            Download Converted Image
          </button>
        )}

        <hr />

        <button onClick={handleMerge} className="merge-button">
          Merge Two Images Side by Side
        </button>

        {mergedImage && (
          <button onClick={handleDownloadMerged} className="download-button">
            Download Merged Image
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
