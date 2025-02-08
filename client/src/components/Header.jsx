import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full p-2 bg-gradient-to-r from-purple-900/80 to-black/80 backdrop-blur-sm rounded-full">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-center space-x-4">
          <Button 
            onClick={() => navigate("/Home")}
            className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-2 transition-all duration-300"
          >
            Home
          </Button>
          <Button 
            onClick={() => navigate("/about")}
            className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-2 transition-all duration-300"
          >
            About
          </Button>
          <Button 
            onClick={() => navigate("/contact")}
            className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-2 transition-all duration-300"
          >
            Contact
          </Button>
          <Button 
            onClick={() => navigate("/login")}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2 transition-all duration-300"
          >
            Login
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default Header;