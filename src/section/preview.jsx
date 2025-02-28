import React, { useEffect, useState } from "react";

function Preview() {
    const [image, setImage] = useState(null);
    const [widthPercentage, setWidthPercentage] = useState("25%");

    useEffect(() => {
        const storedImage = localStorage.getItem("photoStrip");
        if (storedImage) {
            const img = new Image();
            img.src = storedImage;
            img.onload = () => {
                if (img.width === 400 && img.height === 1200) {
                    setWidthPercentage("13%"); // Set your desired width percentage here
                }
                setImage(storedImage);
            };
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 ">
            <h1 className="text-lg font-bold mb-4">Photo Strip Preview</h1>
            {image ? (
                <img src={image} alt="Photo Strip Preview" className="border shadow-lg rounded-lg" style={{ width: widthPercentage }} />
            ) : (
                <p>No photo strip available</p>
            )}
            <button onClick={() => window.history.back()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Back
            </button>
        </div>
    );
}

export default Preview;
