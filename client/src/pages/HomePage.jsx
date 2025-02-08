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
import React, { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomePage() {
  const testimonial = [
    {
      id: 1,
      img: "/icon.png",
      name: "Krishna Gupta",
      review:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis consequatur nam expedita ea atque asperiores",
    },
    {
      id: 2,
      img: "/icon.png",
      name: "Krishna Gupta",
      review:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis consequatur nam expedita ea atque asperiores ",
    },
    {
      id: 3,
      img: "/icon.png",
      name: "Krishna Gupta",
      review:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis consequatur nam expedita ea atque asperiores",
    },
    {
      id: 4,
      img: "/icon.png",
      name: "Krishna Gupta",
      review:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis consequatur nam expedita ea atque asperiores",
    },
    {
      id: 5,
      img: "/icon.png",
      name: "Krishna Gupta",
      review:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis consequatur nam expedita ea atque asperiores",
    },
    {
      id: 6,
      img: "/icon.png",
      name: "Krishna Gupta",
      review:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis consequatur nam expedita ea atque asperiores",
    },
  ];
  const hostels = [
    {
      name: "H1",
      img: "/hero-page.png",
      hostelId: "212",
    },
    {
      name: "H2",
      img: "/hero-page.png",
      hostelId: "213",
    },
    {
      name: "H3",
      img: "/hero-page.png",
      hostelId: "214",
    },
    {
      name: "H4",
      img: "/hero-page.png",
      hostelId: "215",
    },
  ];
  const plugin = useRef(Autoplay({ delay: 1500, stopOnInteraction: false }));
  return (
    <div className="flex flex-col items-center">
      <section className="h-screen flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-16 py-20">
        <div className="flex flex-col items-end ">
          <h1 className="text-5xl font-bold">Find Your Perfect Stay!</h1>
          <p className="text-lg text-gray-600 mt-4 mx-auto">
            Easily browse & book hostels tailored for students.
          </p>
          <Button className="mt-6 mx-auto">Find a Hostel</Button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/hero-page.svg"
            alt="Hostel"
            className="w-auto h-100 object-cover"
          />
        </div>
      </section>

      <section className="bg-blue-50 py-12 md:py-24 w-screen">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Wide Network",
                description: "Access to hostels in Mumbai",
              },
              {
                icon: Users,
                title: "Community",
                description: "Connect with like-minded students",
              },
              {
                icon: CheckCircle,
                title: "Verified Listings",
                description: "Quality assured accommodations",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <item.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-6 ">Top Hostels</h2>
        <div className="relative w-full max-w-4xl mx-auto">
          <Carousel>
            <CarouselContent>
              {hostels.map((hostel, index) => (
                <CarouselItem key={index} className="">
                  <Card className="p-2">
                    <CardTitle className="text-lg font-semibold text-center">
                      {hostel.name}
                    </CardTitle>
                    <CardContent className="flex flex-col items-center">
                      <img
                        src={hostel.img}
                        alt={hostel.name}
                        className="w-full h-60 object-cover rounded-lg"
                      />
                      <Button className="px-8 text-lg  rounded-full mt-2">
                        Visit
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md" />
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md" />
          </Carousel>
        </div>
      </section>
      <section className="py-12 w-full bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6">
          What Our Users Say
        </h2>
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[plugin.current]}
          className=" mx-auto"
          onMouseEnter={() => plugin.current?.stop()}
          onMouseLeave={() => plugin.current?.play()}
        >
          <CarouselContent>
            {testimonial.map((data, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-3">
                  <Card className="shadow-lg border rounded-lg">
                    <CardContent className="p-6 flex flex-col items-center">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={data.img} alt={data.name} />
                        <AvatarFallback>{data.name[0]}</AvatarFallback>
                      </Avatar>
                      <h3 className="mt-4 text-lg font-semibold">
                        {data.name}
                      </h3>
                      <p className="mt-2 text-gray-600 text-center">
                        {data.review}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
      <section className="max-w-3xl mx-auto py-12">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium">
              How do I get started?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Simply sign up, complete your profile, and start exploring the
              features. No technical knowledge is required!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium">
              Is my data secure?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes! We use industry-standard encryption and security practices to
              keep your data safe.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium">
              Can I use it for free?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes, we offer a free plan with essential features. You can upgrade
              anytime for more advanced tools.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium">
              Do you offer customer support?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Absolutely! Our support team is available 24/7 to assist you with
              any questions or issues.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <div className="fixed bottom-4 z-10">
        <Header />
      </div>
      <Footer />
    </div>
  );
}
