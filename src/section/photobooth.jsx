import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

function Photobooth() {
    const webcamRef = useRef(null);
    const [images, setImages] = useState([]); // Store multiple images
    const [countdown, setCountdown] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const videoConstraints = {
        facingMode: "user", // "user" for front camera (laptops), "environment" for rear (mobile)
    };

    const startCaptureSequence = () => {
        setImages([]); // Clear previous images
        setIsCapturing(true);

        let count = 3;
        const capturePhotos = () => {
            if (count === 0) {
                const screenshot = webcamRef.current.getScreenshot();
                setImages((prev) => [...prev, screenshot]);

                if (images.length < 2) { // Continue capturing until 3 images
                    count = 3; // Reset countdown
                    setCountdown(3);
                    setTimeout(capturePhotos, 1000); // Delay for next capture
                } else {
                    setIsCapturing(false);
                }
                return;
            }

            setCountdown(count);
            count--;
            setTimeout(capturePhotos, 1000);
        };

        setCountdown(3);
        setTimeout(capturePhotos, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-lg shadow-lg">
                <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    className="w-full h-full rounded-lg object-cover"
                    mirrored={videoConstraints.facingMode === "user"}
                    videoConstraints={videoConstraints}
                />

                {/* Countdown Display */}
                {countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold bg-black bg-opacity-50">
                        {countdown}
                    </div>
                )}

                {/* Capture Button */}
                {!isCapturing && images.length === 0 && (
                    <button
                        onClick={startCaptureSequence}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 rounded-full transition">
                        <img src="/images/camera.png" className="w-10" alt="Capture" />
                    </button>
                )}
            </div>

            {/* Display captured images */}
            {images.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {images.map((img, index) => (
                        <img key={index} src={img} alt={`Captured ${index + 1}`} className="w-24 sm:w-28 md:w-32 h-auto rounded-lg shadow-lg" />
                    ))}
                </div>
            )}

            {/* Retake Button */}
            {images.length === 3 && (
                <button
                    onClick={() => setImages([])}
                    className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-sm sm:text-base">
                    Retake
                </button>
            )}
        </div>
    );
}

export default Photobooth;
