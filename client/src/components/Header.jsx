import React, { useContext } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "../context/AuthContext";
import { House, LogIn, LogOut, LayoutDashboard, Search } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="w-full px-4 md:px-8 py-3 bg-gradient-to-r from-purple-900/80 to-black/80 backdrop-blur-md  shadow-xl">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-center gap-4">
          <div className="flex items-center space-x-3 md:space-x-6">
            <Button
              onClick={() => navigate(`/`)}
              className="bg-white/10 text-white px-3 md:px-5 py-2 text-sm md:text-base rounded-full transition-all duration-300 hover:bg-white/20"
            >
              <House size={20} />
            </Button>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            <Button
              onClick={() => navigate(`/hostel`)}
              className="bg-white/10 text-white px-3 md:px-5 py-2 text-sm md:text-base rounded-full transition-all duration-300 hover:bg-white/20"
            >
              <Search size={20} />
            </Button>

            {user?.role === "admin" && (
              <Button
                onClick={() => navigate("/dashboard")}
                variant="ghost"
                className=" bg-white/10 text-white px-3 md:px-5 py-2 text-sm md:text-base rounded-full transition-all duration-300 hover:bg-white/20 hover:text-white"
              >
                <LayoutDashboard size={20} className="" />
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            {user ? (
              <>
                <Button
                  onClick={logout}
                  className="bg-red-600 text-white px-3 md:px-6 py-2 text-sm md:text-base rounded-full transition-all duration-300 hover:bg-red-700"
                >
                  <LogOut size={20} />
                </Button>
                <Button
                  onClick={() => navigate("/profile")}
                  variant="ghost"
                  className="p-0 m-0 hover:bg-transparent"
                >
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-white/20 shadow-sm transition-all duration-300 transform hover:scale-110">
                    <AvatarImage
                      src={user.avatar || "/icon.png"}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-gray-600 text-white text-sm md:text-lg font-semibold">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-purple-600 text-white px-3 md:px-6 py-2 text-sm md:text-base rounded-full transition-all duration-300 hover:bg-purple-700"
              >
                <LogIn size={20} />
              </Button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
