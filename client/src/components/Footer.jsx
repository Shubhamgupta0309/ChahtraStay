import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h2 className="text-2xl font-bold">ChahtraStay</h2>
          <p className="mt-2 text-gray-400">
            Your trusted hostel booking platform. Find budget-friendly stays with ease.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/hostels" className="hover:text-white">Find Hostels</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Customer Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/support" className="hover:text-white">Help Center</a></li>
            <li><a href="mailto:support@chahtrastay.com" className="hover:text-white">
              Email Us
            </a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
          <div className="flex items-center bg-gray-800 rounded-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent text-white outline-none flex-grow px-2 py-1"
            />
            <Button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-full">
              Subscribe
            </Button>
          </div>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-blue-400"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-blue-400"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-blue-400"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:text-blue-400"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-10 text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
        <p>© {new Date().getFullYear()} ChahtraStay. All rights reserved.</p>
        <a href="#" className="hover:text-white mx-2">Terms of Service</a> | 
        <a href="#" className="hover:text-white mx-2">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
