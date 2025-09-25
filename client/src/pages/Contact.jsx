import React, { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import api from "@/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectItem } from "@/components/ui/select";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.topic || !formData.message) {
      toast({
        title: "All fields are required",
        description: "Please fill out all the fields before submitting",
        variant: "destructive",
      });
      return;
    }
    try {
      await api.post("/api/support", formData);
      toast({
        title: "Message sent",
        description: "We will get back to you soon",
      });
      setFormData({ name: "", email: "", topic: "", message: "" });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  document.title = "Contact TravelTribe";

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>

      <main className="flex flex-col items-center px-6 md:px-10 lg:px-20 py-16 space-y-8">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl font-bold text-gray-900">Contact & Support</h1>
          <p className="text-gray-600 mt-3">
            Need help? Fill out the form below or email us at
            <a href="mailto:help@TravelTribe.com" className="text-purple-700 font-medium"> help@TravelTribe.com</a>
          </p>
        </div>

        <form
          onSubmit={sendMessage}
          className="w-full max-w-lg bg-white shadow-md rounded-xl p-8 space-y-6 border border-gray-200"
        >
          <div>
            <Label className="text-gray-700 font-medium">Name</Label>
            <Input
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-2"
            />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2"
            />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Topic</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, topic: value })}>
              <SelectTrigger className="w-full mt-2">{formData.topic || "Select a topic"}</SelectTrigger>
              <SelectContent>
                <SelectItem value="help">I need help with my booking</SelectItem>
                <SelectItem value="feedback">I want to provide feedback</SelectItem>
                <SelectItem value="partnership">Business inquiry / Partnership</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Message</Label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              placeholder="Write your message here..."
              className="w-full mt-2"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg bg-purple-600 text-white font-medium py-2 hover:bg-purple-700 transition duration-200"
          >
            Send Message
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
