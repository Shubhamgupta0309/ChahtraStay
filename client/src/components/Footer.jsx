import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Toaster } from "./ui/toaster";
import { useState } from "react";
import api from "@/api";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      return toast({
        variant: "destructive",
        title: "Please, Enter your email",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast({
        variant: "destructive",
        title: "Please, Enter a valid email",
      });
    }
    try {
      await api.post("/api/subscribe", {
        email,
      });
      toast({
        title: "Thank you for subscribing to TravelTribe!",
      });
      setEmail("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Subscription failed. Please try again.",
      });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Toaster />
          <h2 className="text-2xl font-bold">TravelTribe</h2>
          <p className="mt-2 text-gray-400">
            Your trusted hostel booking platform. Find budget-friendly stays
            with ease.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="/hostel" className="hover:text-white">
                Find Hostels
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Customer Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/contact" className="hover:text-white">
                Help Center
              </a>
            </li>
            <li>
              <a
                href="mailto:support@TravelTribe.com"
                className="hover:text-white"
              >
                Email Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
          <div className="flex items-center bg-gray-800 rounded-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-transparent text-white outline-none flex-grow px-2 py-1"
            />
            <Button
              onClick={handleSubscribe}
              className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-full"
            >
              Subscribe
            </Button>
          </div>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-blue-400">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-blue-400">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-blue-400">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-blue-400">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-10 text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
        <p>© {new Date().getFullYear()} TravelTribe. All rights reserved.</p>
        <a href="#" className="hover:text-white mx-2">
          Terms of Service
        </a>{" "}
        |
        <a href="#" className="hover:text-white mx-2">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
