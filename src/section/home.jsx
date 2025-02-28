import React from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react"; 
import Footer from "./footer"; 

function Home() {
    const navigate = useNavigate();

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-500">
            <div className="absolute top-4 right-4 flex items-center space-x-4">
                <button>
                    <HelpCircle className="w-6 h-6" />
                </button>
            </div>

            <div className="flex flex-col items-center">
                <img src="/images/click-n-pose.png" alt="Logo" className="w-[40rem]" />

                <button
                    onClick={() => navigate("/photobooth")}
                    className="px-12 py-3 text-xs font-bold border-2 border-black rounded-full hover:bg-gray-300 transition">
                    START
                </button>
            </div>

            <Footer />
        </div>
    );
}

export default Home;
