import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import { Palette, Sticker, MoreHorizontal, Wand } from "lucide-react";




function PhotoPreview() {
    const [photoStrip, setPhotoStrip] = useState(null);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [selectedBg, setSelectedBg] = useState(null);
    const [photoFormat, setPhotoFormat] = useState(null);
    const [isDateEnabled, setIsDateEnabled] = useState(true);
    const [isLogoEnabled, setIsLogoEnabled] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showStickers, setShowStickers] = useState(false);
    const [showColors, setShowColors] = useState(false);
    const [showDateAndLogo, setShowDateAndLogo] = useState(false);
    




    const navigate = useNavigate();
    const canvasRef = useRef(null);

    const stickerOptions = {
        "3x2x6": [
            "/images/sticker/3x2x6/none.png",
            "images/sticker/3x2x6/1.png",
            "images/sticker/3x2x6/2.png",
            "images/sticker/3x2x6/3.png",
            "images/sticker/3x2x6/4.png",
            "images/sticker/3x2x6/6.png",

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
            "/images/color/3x2x6/none.png",

            "/images/color/3x2x6/1.png",
            "/images/color/3x2x6/2.png",
            "/images/color/3x2x6/3.png",
            "/images/color/3x2x6/4.png", 
            "/images/color/3x2x6/5.png",   
            "/images/color/3x2x6/6.png",      
            "/images/color/3x2x6/7.png",      
            "/images/color/3x2x6/8.png",      
            "/images/color/3x2x6/9.png",      
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
                    ctx.font = "24px monospace"; 
                    ctx.textAlign = "center";
                    ctx.fillText(new Date().toISOString().split("T")[0], canvas.width / 2, canvas.height - 40);
                }
    
                if (isLogoEnabled && localStorage.getItem("photoFormat") !== "4x2x6") {
                    const logo = new Image();
                    logo.src = "images/click-n-pose.png";
                    logo.crossOrigin = "anonymous";
                    logo.onload = () => {
                        const logoWidth = 390.75; 
                        const logoHeight = 179.25; 
                        const marginBottom = 100; 
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
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
            <div className="w-full flex flex-col items-center justify-center p-4 ">
                <p className="lg:mt-0 md:mt-20 text-md font-bold mb-4 uppercase text-center">Photo Strip</p>
                    <div className="relative  max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl p-4 rounded-lg flex items-center justify-center">
                        {photoStrip ? (
                            <>
                                <img 
                                    src={photoStrip} 
                                    alt="Photo Strip Preview" 
                                    className="max-h-[600px]  border shadow-lg object-contain w-full"
                                />
                                {selectedBg && (
                                    <img 
                                        src={selectedBg} 
                                        alt="Color Overlay"
                                        className="absolute top-4 left-0 w-full  max-h-[600px] rounded-lg object-contain pointer-events-none"
                                    />
                                )}
                                {selectedSticker && (
                                    <img 
                                        src={selectedSticker} 
                                        alt="Sticker"
                                        className="absolute top-4 left-0 w-full max-h-[600px] rounded-lg object-contain pointer-events-none"
                                    />
                                )}
                                {isDateEnabled && (
                                    <div className={`font-mono absolute ${localStorage.getItem("photoFormat") === "4x2x6" ? "bottom-6" : "bottom-8"} px-2 py-1 rounded-lg text-black text-xs`}>
                                        {new Date().toISOString().split("T")[0]}
                                    </div>
                                )}
                                {localStorage.getItem("photoFormat") !== "4x2x6" && isLogoEnabled && (
                                    <div className="font-mono absolute bottom-12 px-2 py-1 rounded-lg text-black text-xs">
                                        <div className="flex items-center justify-center mb-4">
                                            <img src="images/click-n-pose.png" className="w-40" alt="" />
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-600 text-center">No photo strip found.</p>
                        )}
                    </div>
            {/* start back and download button */}
                <div className="flex flex-wrap justify-center space-x-4 pb-20 md:pb-20 lg:pb-2">
                <button
                        onClick={() => navigate("/photobooth")}
                        className="px-9 py-2 mt-4 border-2 border-black rounded-full transition uppercase text-sm hover:bg-green-200">
                        <p className="text-xs">Back</p>
                    </button>
        
                    <button
                        onClick={downloadImage}
                        className="px-5 py-2 mt-4 border-2 border-black rounded-full transition uppercase text-sm hover:bg-green-200">
                        <p className="text-xs">Download</p>
                    </button>
                </div>
            {/* end back and download button */}

            {/* start sidebar */}

                <div className="hidden rounded-r-2xl lg:block fixed top-0 left-0 h-full bg-white flex justify-center text-center space-y-6 shadow-lg p-4 transition-transform transform">
                    <div className="flex justify-center items-center p-2 border border-black rounded-lg">
                        <Wand className="w-6 h-8" />
                    </div>
                    <button
                        onClick={() => {
                            setShowSidebar(true);
                            setShowStickers(true);
                            setShowColors(false);
                            setShowDateAndLogo(false);
                        }}
                        className="flex flex-col items-center text-xs hover:bg-green-200 p-2 rounded-lg">
                        <Sticker className="w-6 h-6" />
                        <p>Stickers</p>
                    </button>

                    {/* Color Button */}
                    <button
                        onClick={() => {
                            setShowSidebar(true);
                            setShowColors(true);
                            setShowStickers(false);
                            setShowDateAndLogo(false);
                        }}
                        className="flex flex-col items-center text-xs hover:bg-green-200 p-2 rounded-lg">
                        <Palette className="w-10 h-6" />
                        <p>Colors</p>
                    </button>

                    {/* More Button */}
                    <button
                        onClick={() => {
                            setShowSidebar(true);
                            setShowDateAndLogo(true);
                            setShowStickers(false);
                            setShowColors(false);
                        }}
                        className="flex flex-col items-center text-xs hover:bg-green-200 p-2 rounded-lg">
                        <MoreHorizontal className="w-10 h-6" />
                        <p>More</p>
                    </button>
                </div>

             {/* Sidebar Container */}
                <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 transition-transform transform ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}>
                    <button 
                        onClick={() => setShowSidebar(false)} 
                        className="absolute top-2 right-4 text-gray-500 hover:text-black border-black border rounded-lg px-2">
                        ✕ {/* Close Button */}
                    </button>

                    {/* Stickers Section */}
                    {showStickers && (
                        <div>
                            <h2 className="text-lg font-bold mb-3">Stickers</h2>
                            <div className="grid grid-cols-4 gap-2">
                                {stickerOptions[photoFormat]?.map((sticker, index) => (
                                    <img
                                        key={index}
                                        src={sticker}
                                        alt={`Sticker ${index + 1}`}
                                        className="w-12 object-contain cursor-pointer border-2 rounded-lg hover:border-blue-500 transition"
                                        onClick={() => {
                                            setSelectedSticker(sticker);
                                            setShowSidebar(false);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Colors Section */}
                    {showColors && (
                        <div>
                            <h2 className="text-lg font-bold mb-3">Colors</h2>
                            <div className="grid grid-cols-4 gap-2">
                                {colorOptions[photoFormat]?.map((color, index) => (
                                    <img
                                        key={index}
                                        src={color}
                                        alt={`Color ${index + 1}`}
                                        className="w-12 object-contain cursor-pointer border-2 rounded-lg hover:border-blue-500 transition"
                                        onClick={() => {
                                            setSelectedBg(color);
                                            setShowSidebar(false);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Date and Logo Section */}
                    {showDateAndLogo && (
                        <div>
                            <h2 className="text-lg font-bold mb-3">Options</h2>
                            <div className="flex items-center space-x-2 mb-3">
                                <h2 className="text-sm font-bold uppercase">Add Date</h2>
                                <Switch 
                                    onChange={() => setIsDateEnabled(!isDateEnabled)} 
                                    checked={isDateEnabled} 
                                    onColor="#BFF3D2"
                                    offColor="#EF4444"
                                />
                            </div>
                            {localStorage.getItem("photoFormat") !== "4x2x6" && (
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-sm font-bold uppercase">Add Logo</h2>
                                    <Switch 
                                        onChange={() => setIsLogoEnabled(!isLogoEnabled)} 
                                        checked={isLogoEnabled} 
                                        onColor="#AFF7C9" 
                                        offColor="#EF4444"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            {/* end sidebar */}

        {/* start bottombar */}

            <div className="fixed bottom-0 left-0 rounded-t-2xl right-0 bg-white shadow-lg p-3 flex justify-around items-center lg:hidden">
                {/* Sticker Button */}
                <button
                    onClick={() => {
                        setShowStickers(!showStickers);
                        setShowColors(false); // Hide colors when stickers are clicked
                    }}
                    className="flex flex-col items-center text-xs">
                    <Sticker className="w-6 h-6" />
                    <p>Stickers</p>
                </button>

                {/* Color Button */}
                <button
                    onClick={() => {
                        setShowColors(!showColors);
                        setShowStickers(false);
                    }}
                    className="flex flex-col items-center text-xs text-black">
                    <Palette className="w-6 h-6" /> {/* Lucide Icon */}
                    <p>Colors</p>
                </button>
                <button
                    onClick={() => {
                        setShowDateAndLogo(!showDateAndLogo);
                        setShowStickers(false); // Hide stickers when "More" is clicked
                        setShowColors(false); // Hide colors when "More" is clicked
                    }}
                    className="flex flex-col items-center text-xs">
                    <MoreHorizontal className="w-6 h-6" />
                    <p>More</p>
                </button>                
            </div>

            {/* Sticker Panel */}
            {showStickers && (
                <div className="fixed bottom-16 left-0 right-0 bg-white shadow-md p-3 flex justify-around items-center lg:hidden">
                {stickerOptions[photoFormat]?.map((sticker, index) => (
                        <img
                            key={index}
                            src={sticker}
                            alt={`Sticker ${index + 1}`}
                            className="w-12 object-contain cursor-pointer border-2 rounded-lg hover:border-blue-500 transition"
                            onClick={() => {
                                setSelectedSticker(sticker);
                                setShowStickers(false); // Hide panel after selecting
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Color Panel */}
            {showColors && (
                <div className="fixed bottom-16 left-0 right-0 bg-white shadow-md p-3 flex justify-around items-center lg:hidden">
                {colorOptions[photoFormat]?.map((color, index) => (
                        <img
                            key={index}
                            src={color}
                            alt={`Color ${index + 1}`}
                            className="w-10 object-contain cursor-pointer border-2 rounded-lg hover:border-blue-500 transition"
                            onClick={() => {
                                setSelectedBg(color);
                                setShowColors(false); // Hide panel after selecting
                            }}
                        />
                    ))}
                </div>
            )}

            {showDateAndLogo && (
                <div className="fixed bottom-16 left-0 right-0 bg-white shadow-md p-3 flex justify-around items-center lg:hidden">
                {/* Logo */}
                    <div className="flex items-center space-x-2">
                    <h2 className="text-sm font-bold uppercase">Add Date</h2>
                    <Switch 
                        onChange={() => setIsDateEnabled(!isDateEnabled)} 
                        checked={isDateEnabled} 
                        onColor="#BFF3D2"
                        offColor="#EF4444"
                    />
                    </div>
        
                {localStorage.getItem("photoFormat") !== "4x2x6" && (
                    <div className="flex items-center space-x-2">
                        <h2 className="text-sm font-bold uppercase">Add Logo</h2>
                        <Switch 
                            onChange={() => setIsLogoEnabled(!isLogoEnabled)} 
                            checked={isLogoEnabled} 
                            onColor="#AFF7C9" 
                            offColor="#EF4444"
                        />
                    </div>
                )}
                </div>
            )}
        {/* end bottombar */}


            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
    </div>
    
    );
}

export default PhotoPreview;
