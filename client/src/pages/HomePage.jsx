import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import { Toaster } from "@/components/ui/toaster";

export default function HomePage() {
  const testimonials = [
    {
      id: 1,
      img: "/dheeru.png",
      name: "Dheeru Gupta",
      review:
        "ChahtraStay made my hostel search so much easier! The website is user-friendly, and I found the perfect place near my college within minutes.",
    },
    {
      id: 2,
      img: "/krsna.png",
      name: "Krishna Gupta",
      review:
        "A fantastic platform for students! The detailed listings and Google Maps integration helped me find a comfortable and affordable hostel quickly.",
    },
    {
      id: 3,
      img: "/harshal.png",
      name: "Harshal Dangela",
      review:
        "I was struggling to find a good hostel near my college, but ChahtraStay provided me with great options. The reviews and amenities section were really helpful!",
    },
    {
      id: 4,
      img: "/shubham.png",
      name: "Shubham Gupta",
      review:
        "ChahtraStay saved me so much time! I could easily compare hostels, check prices, and choose the best one that suited my budget and needs.",
    },
    {
      id: 5,
      img: "/vidya.png",
      name: "Vidya Bhaskar",
      review:
        "An amazing website for students looking for hostels. The platform provides all the necessary details, making the hostel search process smooth and stress-free.",
    },
  ];

  const [hostels, setHostels] = useState([]);
  useEffect(() => {
    const fetchHostels = async () => {
      const res = await api.get("/api/hostel");
      setHostels(res.data);
    };
    fetchHostels();
  }, []);
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Toaster />
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center w-full px-6 md:px-16 pt-20 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="flex flex-col items-start md:w-1/2 space-y-6 z-10">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl text-purple-600 font-bold tracking-tight">
              ChahtraStay
            </h1>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              Find Your Perfect Stay!
            </h3>
            <p className="text-lg text-gray-600 max-w-lg">
              Easily browse & book hostels tailored for students. Find your
              ideal accommodation with our verified listings and supportive
              community.
            </p>
          </div>
          <Button
            onClick={() => navigate("/hostel")}
            className="rounded-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg shadow-lg"
          >
            Find a Hostel
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
          <img
            src="/hero-page.svg"
            alt="Hostel Illustration"
            className="w-full max-w-2xl h-auto object-contain transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 w-full bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: MapPin,
                title: "Wide Network",
                description:
                  "Access to premium hostels across Mumbai's top locations",
              },
              {
                icon: Users,
                title: "Vibrant Community",
                description:
                  "Connect with like-minded students and build lasting friendships",
              },
              {
                icon: CheckCircle,
                title: "Verified Listings",
                description:
                  "Every hostel is personally verified for quality assurance",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-purple-100 p-4 rounded-full mb-6 group-hover:bg-purple-200 transition-colors duration-300">
                  <item.icon className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Hostels Section */}
      <section className="py-20 w-full bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Featured Hostels
          </h2>
          <div className="relative max-w-6xl mx-auto px-8">
            <Carousel className="cursor-grab active:cursor-grabbing">
              <CarouselContent>
                {hostels.map((hostel, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3 pl-4"
                  >
                    <Card className="p-4 hover:shadow-xl transition-all duration-300 bg-white">
                      <CardTitle className="text-xl font-semibold text-center mb-4">
                        {hostel.name}
                      </CardTitle>
                      <CardContent className="flex flex-col items-center p-0">
                        <img
                          src={hostel.images[0]}
                          alt={hostel.name}
                          className="w-full h-64 object-cover rounded-lg hover:opacity-90 transition-opacity duration-300"
                        />
                        <Button
                          onClick={() => navigate(`/hostel/${hostel.hostelId}`)}
                          className="mt-6 bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md rounded-full"
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-purple-50 shadow-md" />
              <CarouselNext className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-purple-50 shadow-md" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 w-full bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            What Our Users Say
          </h2>
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[plugin.current]}
            className="max-w-6xl mx-auto"
            onMouseEnter={() => plugin.current?.stop()}
            onMouseLeave={() => plugin.current?.play()}
          >
            <CarouselContent>
              {testimonials.map((data, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 pl-4"
                >
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-110  hover:bg-purple-50">
                    <CardContent className="p-8 flex flex-col items-center">
                      <Avatar className="w-20 h-20 ring-2 ring-purple-200">
                        <AvatarImage src={data.img} alt={data.name} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {data.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="mt-6 text-xl font-semibold text-gray-900">
                        {data.name}
                      </h3>
                      <p className="mt-4 text-gray-600 text-center leading-relaxed">
                        "{data.review}"
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      <section className="py-20 bg-purple-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              {
                question: "How do I book a hostel room?",
                answer:
                  "Simply search for your preferred location, select a hostel, choose your room type, and complete the booking process by providing your details and payment.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept major credit/debit cards, UPI, net banking, and digital wallets. Some hostels may also offer cash payment at check-in.",
              },
              {
                question: "Can I cancel or modify my booking?",
                answer:
                  "Yes, you can cancel or modify your booking from your account. Cancellation policies vary by hostel, so check the terms before canceling.",
              },
              {
                question: "Is there a security deposit?",
                answer:
                  "Security deposit requirements vary by hostel. The specific amount will be clearly indicated during the booking process.",
              },
            ].map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="bg-white rounded-lg"
              >
                <AccordionTrigger className=" text-lg font-medium px-6 hover:text-purple-600 transition-colors duration-500">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 px-6 pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>

      <Footer />
    </div>
  );
}
