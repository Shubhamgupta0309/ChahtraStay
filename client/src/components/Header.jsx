import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-600 to-gray-800 shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-white text-xl font-bold">ChhatraStay</div>
            <div className="animate-pulse bg-white/20 h-8 w-24 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-600 to-gray-800 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            className="text-white text-xl font-bold cursor-pointer focus:outline-none"
            onClick={() => navigate("/")}
          >
            ChhatraStay
          </button>
          
          <div className="hidden md:flex space-x-6">
            <Button 
              onClick={() => navigate("/hostel")} 
              className="text-white bg-transparent hover:bg-white/10"
            >
              Explore Hostel
            </Button>
            <Button 
              onClick={() => navigate("/about")} 
              className="text-white bg-transparent hover:bg-white/10"
            >
              About Us
            </Button>
            <Button 
              onClick={() => navigate("/contact")} 
              className="text-white bg-transparent hover:bg-white/10"
            >
              Contact
            </Button>
            
            {user?.role === "admin" && (
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="text-white bg-transparent hover:bg-white/10"
              >
                Dashboard
              </Button>
            )}
            
            {user ? (
              <>
                <Button 
                  onClick={logout} 
                  className="text-red-400 hover:bg-red-600 hover:text-white"
                >
                  Logout
                </Button>
                <Button 
                  onClick={() => navigate("/profile")} 
                  className="p-0 m-0 hover:bg-transparent"
                >
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 shadow-sm transition-all duration-300 transform hover:scale-110">
                    <AvatarImage src={user.avatar || "/icon.png"} alt={user.name} />
                    <AvatarFallback className="bg-gray-600 text-white text-sm md:text-lg font-semibold">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate("/login")} 
                className="text-purple-400 hover:bg-purple-600 hover:text-white"
              >
                Login
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="text-white focus:outline-none"
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-black/70 backdrop-blur-md text-white rounded-lg shadow-lg p-3 space-y-2 z-[9999] transition-all duration-300">
          <Button 
            onClick={() => { 
              navigate("/hostel"); 
              setMenuOpen(false); 
            }} 
            className="w-full text-left bg-transparent hover:bg-white/10"
          >
            Explore Hostel
          </Button>
          <Button 
            onClick={() => { 
              navigate("/about"); 
              setMenuOpen(false); 
            }} 
            className="w-full text-left bg-transparent hover:bg-white/10"
          >
            About Us
          </Button>
          <Button 
            onClick={() => { 
              navigate("/contact"); 
              setMenuOpen(false); 
            }} 
            className="w-full text-left bg-transparent hover:bg-white/10"
          >
            Contact
          </Button>
          
          {user?.role === "admin" && (
            <Button 
              onClick={() => { 
                navigate("/dashboard"); 
                setMenuOpen(false); 
              }} 
              className="w-full text-left bg-transparent hover:bg-white/10"
            >
              Dashboard
            </Button>
          )}
          
          {user ? (
            <>
              <Button 
                onClick={() => { 
                  logout(); 
                  setMenuOpen(false); 
                }} 
                className="w-full text-left text-red-400 hover:bg-red-600 hover:text-white"
              >
                Logout
              </Button>
              <Button 
                onClick={() => { 
                  navigate("/profile"); 
                  setMenuOpen(false); 
                }} 
                className="w-full text-left bg-transparent hover:bg-white/10"
              >
                Profile
                <Avatar className="ml-2 h-8 w-8 border-2 border-white/20 shadow-sm">
                  <AvatarImage src={user.avatar || "/icon.png"} alt={user.name} />
                  <AvatarFallback className="bg-gray-600 text-white text-sm font-semibold">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => { 
                navigate("/login"); 
                setMenuOpen(false); 
              }} 
              className="w-full text-left text-purple-400 hover:bg-purple-600 hover:text-white"
            >
              Login
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;