import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";


function PhotoPreview() {
    const [photoStrip, setPhotoStrip] = useState(null);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [selectedBg, setSelectedBg] = useState(null);
    const [photoFormat, setPhotoFormat] = useState(null);
    const [isDateEnabled, setIsDateEnabled] = useState(true);
    const [isLogoEnabled, setIsLogoEnabled] = useState(true); // Default: Logo is added



    const navigate = useNavigate();
    const canvasRef = useRef(null);

    const stickerOptions = {
        "3x2x6": [
            "images/sticker/sparkle.png",
            "images/sticker/Cat.png",
            "images/sticker/Pink.png",
        ],
        // "4x2x6": [],
        "6x4x6": [
            "images/sticker/Flower.png",
            "images/sticker/Ribbon.png",
            "images/sticker/Butterfly.png",
        ],
    };

    const colorOptions = {
        "3x2x6": [
            "/images/color/3x2x6/Green.png",
            "/images/color/3x2x6/Pink.png",
            "/images/color/3x2x6/Purple.png",
            "/images/color/3x2x6/Yellow.png",
            "/images/color/3x2x6/Purple.png",
            "/images/color/3x2x6/Yellow.png",

            
        ],
    };

    useEffect(() => {
        const storedImage = localStorage.getItem("photoStrip");
        const storedFormat = localStorage.getItem("photoFormat");

        if (storedImage) setPhotoStrip(storedImage);
        if (storedFormat) setPhotoFormat(storedFormat);
    }, []);

    const downloadImage = () => {
        if (!photoStrip) return;
    
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const image = new Image();
    
        image.src = photoStrip;
        image.crossOrigin = "anonymous";
    
        image.onload = () => {
            // Set canvas size
            canvas.width = image.width;
            canvas.height = image.height;
    
            // Draw base photo strip
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
            const renderExtras = () => {
                if (isDateEnabled) {
                    ctx.font = "24px monospace"; // Match the font-mono, text-xs
                    ctx.textAlign = "center";
                    ctx.fillText(new Date().toISOString().split("T")[0], canvas.width / 2, canvas.height - 40);
                }
    
                if (isLogoEnabled && localStorage.getItem("photoFormat") !== "4x2x6") {
                    const logo = new Image();
                    logo.src = "images/click-n-pose.png";
                    logo.crossOrigin = "anonymous";
                    logo.onload = () => {
                        const logoWidth = 390.75; // Approximate "w-40"
                        const logoHeight = 179.25; // Keep aspect ratio
                        const marginBottom = 100; // Add margin from the bottom
                        ctx.drawImage(logo, (canvas.width - logoWidth) / 2, canvas.height - logoHeight - marginBottom, logoWidth, logoHeight);
                        saveCanvas();
                    };
                } else {
                    saveCanvas();
                }
               
            };
    
            if (selectedBg) {
                const bg = new Image();
                bg.src = selectedBg;
                bg.crossOrigin = "anonymous";
                bg.onload = () => {
                    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
                    if (selectedSticker) {
                        const sticker = new Image();
                        sticker.src = selectedSticker;
                        sticker.crossOrigin = "anonymous";
                        sticker.onload = () => {
                            ctx.drawImage(sticker, 0, 0, canvas.width, canvas.height);
                            renderExtras();
                        };
                    } else {
                        renderExtras();
                    }
                };
            } else if (selectedSticker) {
                const sticker = new Image();
                sticker.src = selectedSticker;
                sticker.crossOrigin = "anonymous";
                sticker.onload = () => {
                    ctx.drawImage(sticker, 0, 0, canvas.width, canvas.height);
                    renderExtras();
                };
            } else {
                renderExtras();
            }
        };
    };
    

    

    const saveCanvas = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "photo_strip.png";
        link.click();
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="m-2 w-1/3 max-h-screen p-4 bg-white shadow-lg rounded-lg overflow-y-auto">
                <div className="flex items-center justify-center mb-4">
                    <img src="images/click-n-pose.png" className=" w-32" alt="" />
                </div>
                <h2 className="text-sm font-bold mb-4 uppercase">Choose a Sticker</h2>
                <div className="grid grid-cols-6 gap-2">
                    {photoFormat && stickerOptions[photoFormat] ? (
                        stickerOptions[photoFormat].map((sticker, index) => (
                            <img
                                key={index}
                                src={sticker}
                                alt={`Sticker ${index + 1}`}
                                className="w-20 object-contain cursor-pointer border-2 rounded-lg hover:border-blue-500 transition"
                                onClick={() => setSelectedSticker(sticker)}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-xs">Stickers not available.</p>
                    )}
                </div>

                <h2 className="text-sm font-bold mt-6 mb-4 uppercase">Choose a Color Overlay</h2>
                <div className="grid grid-cols-6 gap-2">
                    {photoFormat && colorOptions[photoFormat] ? (
                        colorOptions[photoFormat].map((color, index) => (
                            <img
                                key={index}
                                src={color}
                                alt={`Color ${index + 1}`}
                                className="w-20 object-contain cursor-pointer border-2 rounded-lg hover:border-blue-500 transition"
                                onClick={() => setSelectedBg(color)}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-xs">Color overlays not available.</p>
                    )}
                </div>

                <div className="flex items-center space-x-2">

                    <h2 className="text-sm font-bold mt-6 mb-2 uppercase">Add a Date</h2>
                        <Switch 
                            onChange={() => setIsDateEnabled(!isDateEnabled)} 
                            checked={isDateEnabled} 
                            onColor="#BFF3D2"
                            offColor="#EF4444"
                            className="top-2 "
                        />
                </div>

                {localStorage.getItem("photoFormat") !== "4x2x6" && (
                <div className="flex items-center space-x-2">

                    <h2 className="text-sm font-bold mt-6 mb-2 uppercase">Add Logo</h2>
                    <Switch 
                        onChange={() => setIsLogoEnabled(!isLogoEnabled)} 
                        checked={isLogoEnabled} 
                        onColor="#AFF7C9" 
                        offColor="#EF4444"
                        className="top-2"
                    />
                </div>
                )}
            </div>

            <div className="w-2/3 h-screen flex flex-col items-center justify-center flex-shrink-0">
                <p className="text-md font-bold mb-4 uppercase text-center">Photo Strip</p>
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 rounded-lg flex items-center justify-center">
                    {photoStrip ? (
                        <>
                            <img 
                                src={photoStrip} 
                                alt="Photo Strip Preview" 
                                className="rounded-lg w-full h-auto max-h-[600px] object-contain"
                            />

                            {selectedBg && (
                                <img 
                                    src={selectedBg} 
                                    alt="Color Overlay"
                                    className="absolute top-4 left-0 w-full max-h-[600px] object-contain pointer-events-none opacity-80"
                                />
                            )}

                            {selectedSticker && (
                                <img 
                                    src={selectedSticker} 
                                    alt="Sticker"
                                    className="absolute top-4 left-0 w-full max-h-[600px] object-contain pointer-events-none"
                                />
                            )}

                            {isDateEnabled && (
                                <div className={`font-mono absolute ${localStorage.getItem("photoFormat") === "4x2x6" ? "bottom-6" : "bottom-8"} px-2 py-1 rounded-lg text-black text-xs`}>
                                    {new Date().toISOString().split("T")[0]} {/* Auto-display today's date */}
                                </div>
                            )}

                            { localStorage.getItem("photoFormat") !== "4x2x6" && isLogoEnabled && (
                                <div className="font-mono absolute bottom-12 px-2 py-1 rounded-lg text-black text-xs ">
                                    <div className="flex items-center justify-center mb-4">
                                        <img src="images/click-n-pose.png" className=" w-40" alt="" />
                                    </div>
                                </div>
                            )}

                        </>
                    ) : (
                        <p className="text-gray-600 text-center">No photo strip found.</p>
                    )}
                </div>

                <div className="flex justify-center space-x-4">
                <button
                    onClick={() => navigate("/photobooth")}
                    className="px-9 py-2 mt-4 border-2 border-black rounded-full transition uppercase text-sm hover:bg-green-200">
                    <p className="text-xs">Back</p>
                </button>

                <button
                    onClick={downloadImage}
                    className="px-5 py-2 mt-4 border-2 border-black rounded-full transition uppercase text-sm hover:bg-green-200 ">

                    <p className="text-xs">Download</p>

                </button>
                </div>

                <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>
        </div>
    );
}

export default PhotoPreview;
