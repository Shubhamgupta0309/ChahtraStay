import React from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function Contact() {
  document.title="Contact ChhatraStay"
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 pt-12">
        <Header />

      <main className="flex flex-col items-center px-6 md:px-20 py-10 space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Contact & Support
        </h1>
        <p className="text-gray-600 text-center">
          Need help? Fill out the form below or email us at{" "}
          <a
            href="mailto:help@ChhatraStay.com"
            className="text-purple-700 font-medium"
          >
            help@ChhatraStay.com
          </a>
        </p>

        <form className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Topic</label>
            <select
              className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            >
              <option value="">Select a topic</option>
              <option value="help">I need help with my booking</option>
              <option value="feedback">I want to provide feedback</option>
              <option value="partnership">
                Business inquiry / Partnership
              </option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              rows="4"
              placeholder="Write your message here..."
              className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-medium py-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Send Message
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;