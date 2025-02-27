import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

function Photobooth() {
    const webcamRef = useRef(null);
    const [images, setImages] = useState([]);
    const [countdown, setCountdown] = useState(null);
    const [numPhotos, setNumPhotos] = useState(3);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isCaptured, setIsCaptured] = useState(false);

    const videoConstraints = { facingMode: "user" };

    const startCaptureSequence = (selectedNum) => {
        setNumPhotos(selectedNum);
        setImages([]);
        setIsCaptured(false);
        setCountdown(3);
        setIsModalOpen(false);

        let count = 3;
        let capturedCount = 0;

        const capturePhotos = () => {
            if (count === 0 && capturedCount < selectedNum) {
                const screenshot = webcamRef.current.getScreenshot();
                setImages((prev) => [...prev, screenshot]);
                capturedCount++;

                if (capturedCount < selectedNum) {
                    count = 3;
                    setCountdown(3);
                    setTimeout(capturePhotos, 1000);
                } else {
                    setCountdown(null);
                    setIsCaptured(true);
                }
                return;
            }
            setCountdown(count);
            count--;
            setTimeout(capturePhotos, 1000);
        };

        setTimeout(capturePhotos, 1000);
    };

    const createPhotoStrip = (format) => {
        if (images.length === 0) return;
    
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
    
        let width, height, blackBottomHeight, padding;
        let photoWidth, photoHeight, rows, cols, aspectRatio;
    
        if (format === "3x2x6") {
            // 2x6 (3 photos, aspect ratio 4:3)
            width = 400;
            height = 1200;
            blackBottomHeight = 250;
            padding = 15;
            rows = 3;
            cols = 1;
            aspectRatio = 4 / 3;
        } else if (format === "4x2x6") {
            // 2x6 (4 photos, aspect ratio 3:2)
            width = 400;
            height = 1200;
            blackBottomHeight = 150;
            padding = 15;
            rows = 4;
            cols = 1;
            aspectRatio = 3 / 2;
        } else if (format === "6x4x6") {
            // 4x6 (6 photos, 2 columns & 3 rows)
            width = 600;
            height = 900;
            blackBottomHeight = 150;
            padding = 15;
            rows = 3;
            cols = 2;
            aspectRatio = 4 / 3;
        } else {
            return;
        }
    
        canvas.width = width;
        canvas.height = height;
    
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
    
        photoWidth = (width - (cols + 1) * padding) / cols;
        photoHeight = photoWidth / aspectRatio;
    
        if (rows * (photoHeight + padding) + blackBottomHeight > height) {
            photoHeight = (height - blackBottomHeight - (rows + 1) * padding) / rows;
            photoWidth = photoHeight * aspectRatio;
        }
    
        images.forEach((imgSrc, index) => {
            const img = new Image();
            img.src = imgSrc;
            img.onload = () => {
                const col = index % cols;
                const row = Math.floor(index / cols);
                const x = padding + col * (photoWidth + padding);
                const y = padding + row * (photoHeight + padding);
    
                ctx.drawImage(img, x, y, photoWidth, photoHeight);
            };
        });
    
        // Add black bottom section
        ctx.fillStyle = "white";
        ctx.fillRect(0, height - blackBottomHeight, width, blackBottomHeight);
    
        setTimeout(() => saveCanvas(canvas), 1000);
    };
    
    const saveCanvas = (canvas) => {
        canvas.toBlob((blob) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "photo_strip_2x6.png";
            link.click();
            URL.revokeObjectURL(link.href);
        }, "image/png");
    };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 md:px-4">
                    <div className="bg-white p-6 rounded-lg  shadow-lg text-center p-14">
                    <h2 className="text-lg font-bold mb-4">Select Number of Photos</h2>

                        <div className="flex justify-center gap-4 ">

                            <button 
                                onClick={() => startCaptureSequence(3)} 
                                className="text-white  rounded-lg hover:bg-blue-600 transition">
                                <img src="/images/3.png" alt="3 Photos" className="w-80 rounded-md shadow-md hover:opacity-80" />

                            </button>
                            <button 
                                onClick={() => startCaptureSequence(4)} 
                                className=" text-white rounded-lg hover:bg-green-600 transition">
                                <img src="/images/4.png" alt="3 Photos" className="w-80 rounded-md shadow-md hover:opacity-80" />
                            </button>
                            <button 
                                onClick={() => startCaptureSequence(6)} 
                                className="text-white rounded-lg hover:bg-purple-600 transition">
                                <img src="/images/6.png" alt="3 Photos" className="w-80 rounded-md shadow-md hover:opacity-80" />

                            </button>
                        </div>
                    </div>
            </div>
            )}

            <div className="relative w-full max-w-lg aspect-[4/3] rounded-lg shadow-lg">
                <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    className="w-full h-full rounded-lg object-cover"
                    mirrored={videoConstraints.facingMode === "user"}
                    videoConstraints={videoConstraints}
                />

                {countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl rounded-lg font-bold bg-black bg-opacity-50">
                        {countdown}
                    </div>
                )}
            </div>

            {images.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {images.map((img, index) => (
                        <img 
                            key={index} 
                            src={img} 
                            alt={`Captured ${index + 1}`} 
                            className="w-32 h-24 sm:w-36 sm:h-27 md:w-40 md:h-30 rounded-lg shadow-lg object-cover"
                        />
                    ))}
                </div>
            )}

            {isCaptured && (
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => { setImages([]); setIsModalOpen(true); setIsCaptured(false); }}
                        className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition">
                        Retake
                    </button>
                    
                    <button 
                        onClick={() => createPhotoStrip("3x2x6")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        3-Pic (2x6)
                    </button>

                    <button 
                        onClick={() => createPhotoStrip("4x2x6")}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                        4-Pic (2x6)
                    </button>

                    <button 
                        onClick={() => createPhotoStrip("6x4x6")}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
                        6-Pic (4x6)
                    </button>
                </div>
            )}
        </div>
    );
}

export default Photobooth;
