import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { RefreshCcw } from "lucide-react"; // Importing an icon from Lucide



function Photobooth() {
     const navigate = useNavigate();
    const webcamRef = useRef(null);
    const [images, setImages] = useState([]);
    const [countdown, setCountdown] = useState(null);
    const [numPhotos, setNumPhotos] = useState(3);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isCaptured, setIsCaptured] = useState(false);
    const [timer, setTimer] = useState(3);
    const [filter, setFilter] = useState("none");
    const [step, setStep] = useState(1);
    const [isPortrait, setIsPortrait] = useState(window.innerWidth < window.innerHeight);
    

    const videoConstraints = { facingMode: "user" };

    const startCaptureSequence = () => {
        setImages([]);
        setIsCaptured(false);
        setIsModalOpen(false);
    
        if (timer === 0) {
            // Manual Capture Mode
            return;
        }
    
        setCountdown(timer);
    
        setTimeout(() => {
            let count = timer;
            let capturedCount = 0;
    
            const capturePhotos = () => {
                if (count === 0 && capturedCount < numPhotos) {
                    const screenshot = webcamRef.current?.getScreenshot();
                    if (screenshot) {
                        setImages((prev) => [...prev, screenshot]);
                    }
                    capturedCount++;
                    if (capturedCount < numPhotos) {
                        count = timer;
                        setCountdown(timer);
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
        }, 100);
    };
    
    // Function to capture manually
    const captureManualPhoto = () => {
        if (timer === 0) {
            const screenshot = webcamRef.current?.getScreenshot();
            if (screenshot) {
                setImages((prev) => [...prev, screenshot]);
            }
            if (images.length + 1 >= numPhotos) {
                setIsCaptured(true);
            }
        }
    };
    

    const filters = [
        { name: "None", value: "none" },
        { name: "Grayscale", value: "grayscale(100%)" },
        { name: "Sepia", value: "sepia(100%)" },
        { name: "Invert", value: "invert(100%)" },
    ];


    const createPhotoStrip = (format) => {
        if (images.length === 0) return;
    
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
    
        let width, height, blackBottomHeight, padding;
        let photoWidth, photoHeight, rows, cols, aspectRatio;
    
        if (format === "3x2x6") {
            width = 400;
            height = 1200;
            blackBottomHeight = 240;
            padding = 30;
            rows = 3;
            cols = 1;
            aspectRatio = 4 / 3;
        } else if (format === "4x2x6") {
            width = 400;
            height = 1200;
            blackBottomHeight = 70;
            padding = 20;
            rows = 4;
            cols = 1;
            aspectRatio = 3 / 3;
        } else if (format === "6x4x6") {
            width = 800;
            height = 1200;
            blackBottomHeight = 150;
            padding = 30;
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
            photoWidth = (width - (cols + 1) * padding) / cols;
        }
    
        let loadedImages = 0;
    
        images.forEach((imgSrc, index) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imgSrc;
    
            img.onload = () => {
                // Create an offscreen canvas
                const offCanvas = document.createElement("canvas");
                const offCtx = offCanvas.getContext("2d");
    
                offCanvas.width = photoWidth;
                offCanvas.height = photoHeight;
    
                // Apply the selected filter BEFORE drawing
                offCtx.filter = filter;
                offCtx.drawImage(img, 0, 0, photoWidth, photoHeight);
    
                // Draw the processed image onto the main canvas
                const col = index % cols;
                const row = Math.floor(index / cols);
                const x = padding + col * (photoWidth + padding);
                const y = padding + row * (photoHeight + padding);
    
                ctx.drawImage(offCanvas, x, y);
    
                loadedImages++;
                if (loadedImages === images.length) {
                    saveCanvas(canvas);
                }
            };
        });
    
        // Add bottom section
        ctx.fillStyle = "white";
        ctx.fillRect(0, height - blackBottomHeight, width, blackBottomHeight);
    };
    
    
    
    
    

    const saveCanvas = (canvas) => {
        const dataURL = canvas.toDataURL("image/png"); // Save as base64 string
        localStorage.setItem("photoStrip", dataURL);  // Store in localStorage
        navigate("/preview");
    };
    useEffect(() => {
        const handleOrientationChange = () => {
            setIsPortrait(window.innerWidth < window.innerHeight);
        };

        window.addEventListener("resize", handleOrientationChange);
        return () => window.removeEventListener("resize", handleOrientationChange);
    }, []);

    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 ">
            <div>
                <img src="images/click-n-pose.png" className="w-36" alt="" />
            </div>
            <div className="relative w-full lg:max-w-lg sm:max-w-sm md:max-w-sm lg:aspect-[4/3] md:aspect-[4/3] sm:aspect-[4/3] rounded-lg shadow-lg" style={{ filter: filter }}>
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
                {timer === 0 && !isCaptured && (
                    <button
                        onClick={captureManualPhoto}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2  px-6 py-2 rounded-full transition">
                        <img src="images/camera.png" className="w-8" alt="" />
                    </button>
                )}

            </div>

            {/* Modal for Setup */}
            {isModalOpen && (
               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-2 md:px-4">
                <div className="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg text-center w-full max-w-md sm:max-w-lg md:max-w-xl">
                    {step === 1 && (
                        <>
                            <div className="p-4">
                                <h2 className="text-xs md:text-sm font-bold mb-4 uppercase">Select Number of Photos</h2>
                                <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                                    {[3, 4, 6].map((num) => (
                                        <button key={num} onClick={() => { 
                                            setNumPhotos(num); 
                                            setStep(2);
                                        
                                            let format = "";
                                            if (num === 3) format = "3x2x6";
                                            else if (num === 4) format = "4x2x6";
                                            else if (num === 6) format = "6x4x6";
                                        
                                            localStorage.setItem("photoFormat", format);
                                        }}>
                                            <img src={`/images/${num}.png`} alt={`${num} Photos`} className="w-32 md:w-32 lg:w-48 rounded-md shadow-md hover:opacity-80" />
                                        </button>
                                        
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="p-4 md:p-6">
                                <h2 className="text-xs md:text-sm font-bold mb-4 uppercase">Select Timer</h2>
                                <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                                     <button onClick={() => { setTimer(0); setStep(3); }}>
                                        <p className="w-32 h-32 md:w-24 md:h-24 lg:w-32 lg:h-32 flex items-center justify-center rounded-md shadow-lg hover:opacity-80">None</p>
                                    </button>
                                    <button onClick={() => { setTimer(3); setStep(3); }}>
                                        <p className="w-32 h-32 md:w-24 md:h-24 lg:w-32 lg:h-32 flex items-center justify-center rounded-md shadow-lg hover:opacity-80">3 sec.</p>
                                    </button>
                                    <button onClick={() => { setTimer(5); setStep(3); }}>
                                        <p className="w-32 h-32 md:w-24 md:h-24 lg:w-32 lg:h-32 flex items-center justify-center rounded-md shadow-lg hover:opacity-80">5 sec.</p>
                                    </button>
                                    <button onClick={() => { setTimer(10); setStep(3); }}>
                                        <p className="w-32 h-32 md:w-24 md:h-24 lg:w-32 lg:h-32 flex items-center justify-center rounded-md shadow-lg hover:opacity-80">10 sec.</p>
                                    </button>


                                </div>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="p-4 md:p-6">
                                <h2 className="text-xs md:text-sm font-bold mb-4 uppercase">Select Filter</h2>
                                <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                                    {filters.map((f) => (
                                        <button
                                            key={f.value}
                                            onClick={() => { setFilter(f.value); startCaptureSequence(); }}
                                            className="relative w-32 h-32 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden shadow-md hover:opacity-80">
                                            <Webcam
                                                className="absolute inset-0 w-full h-full object-cover"
                                                videoConstraints={videoConstraints}
                                                style={{ filter: f.value }}
                                                mirrored={videoConstraints.facingMode === "user"}
                                            />
                                            <div className="absolute bottom-0 bg-black bg-opacity-50 text-white w-full text-center text-xs md:text-sm py-1">
                                                {f.name}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    
                </div>
            </div>
            )}

            {images.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {images.map((img, index) => (
                        <img 
                            key={index} 
                            src={img} 
                            alt={`Captured ${index + 1}`} 
                            className="w-32 h-24 sm:w-36 sm:h-27 md:w-40 md:h-30 rounded-lg shadow-lg object-cover"
                            style={{ filter: filter }} // Apply the selected filter
                        />
                    ))}
                </div>
            )}

            {isCaptured && (
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => { 
                            setImages([]); 
                            setIsCaptured(false);
                            setStep(1); // Reset the modal steps
                            setIsModalOpen(true); // Reopen the modal
                        }}
                        className="px-6 py-2 border-2 border-black rounded-full transition uppercase text-sm hover:bg-green-200">
                        <p className="text-xs">Retake</p>
                    </button>

                    <button 
                        onClick={() => {
                            console.log("Images array:", images); // Debugging

                            let format = "";
                            if (images.length === 3) {
                                format = "3x2x6"; 
                            } else if (images.length === 4) {
                                format = "4x2x6"; 
                            } else if (images.length === 6) {
                                format = "6x4x6"; 
                            }

                            if (format) {
                                console.log("Selected format:", format); // Debugging
                                createPhotoStrip(format);
                            } else {
                                alert("Invalid number of images for formatting.");
                            }
                        }}
                        className="px-5 py-2 border-2 border-black rounded-full transition uppercase text-sm hover:bg-green-200">
                        <p className="text-xs">Preview</p>
                    </button>


                </div>
            )}

            {isPortrait && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white text-lg font-bold text-center p-4">
                    <img src="images/landscape.png" className="w-12 mb-4" alt="" />
                    Please rotate your device for the best experience.
                </div>
            )}

        </div>
    );
}

export default Photobooth;
