import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
document.title="Not Found | ChahtraStay"
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white px-4">
      <div className="max-w-3xl w-full text-center space-y-6">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto mb-6 animate-floating">
          <img
            src="/error.svg"
            alt="404 Error Illustration"
            className="w-full h-auto"
          />
        </div>

        <div className="mt-6">
          <Button
            onClick={() => navigate("/")}
            className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 px-5 py-3 sm:px-6 sm:py-4 text-base sm:text-lg shadow-lg group"
          >
            <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
