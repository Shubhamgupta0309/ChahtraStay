import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "../context/AuthContext";
import { House, LogIn, LogOut, LayoutDashboard, Search } from "lucide-react";
import { Dock, DockIcon } from "./magicui/dock";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { Separator } from "@/components/ui/separator"


const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="relative">
      <TooltipProvider>
        <Dock direction="middle">
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={() => navigate("/")} className="cursor-pointer">
                  <House className="size-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          <Separator orientation="vertical" />
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() => navigate("/hostel")}
                  className="cursor-pointer"
                >
                  <Search className="size-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          {user?.role === "admin" && (<DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => navigate("/dashboard")}
                      className="cursor-pointer"
                    >
                      <LayoutDashboard className="size-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>)}

          {user ? (
            <>
              <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer"
                    >
                      <Avatar className="size-7">
                        <AvatarImage
                          src={user.avatar || "/vite.svg"}
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-gray-600 text-white text-sm md:text-lg font-semibold">
                          {user.name ? user.name[0].toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user?.name ? `Profile | ${user.name}` : "user"}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
              <Separator orientation="vertical" />
              <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div onClick={logout} className="cursor-pointer">
                      <LogOut className="size-5 text-red-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            </>
          ) : (
            <>
            <Separator orientation="vertical" />
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => navigate("/login")}
                    className="cursor-pointer"
                  >
                    <LogIn className="size-5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Login</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
            </>
          )}
        </Dock>
      </TooltipProvider>
    </div>
  );
};

export default Header;
