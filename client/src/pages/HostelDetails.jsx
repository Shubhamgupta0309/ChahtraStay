import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const mockHostels = [
  {
    _id: "1",
    name: "Cozy Stay PG",
    location: "Mumbai",
    price: 5000,
    amenities: ["WiFi", "Laundry", "AC"],
    rating: 4.5,
    images: [
      "https://th.bing.com/th/id/OIP.5p9OtrcjCxpU5QzlzlrmJAHaE7?pid=ImgDet&w=178&h=118&c=7&dpr=1.3",
      "https://source.unsplash.com/600x400/?room",
      "https://th.bing.com/th/id/OIP.mNjWJetLkRZdpoVsjfPDPwHaE8?w=276&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7"
    ],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Mumbai",
  },
  {
    _id: "2",
    name: "Elite Hostel",
    location: "Delhi",
    price: 7000,
    amenities: ["WiFi", "Parking", "Gym"],
    rating: 4.2,
    images: [
      "https://th.bing.com/th/id/OIP.mNjWJetLkRZdpoVsjfPDPwHaE8?w=276&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      "https://th.bing.com/th/id/OIP.5p9OtrcjCxpU5QzlzlrmJAHaE7?pid=ImgDet&w=178&h=118&c=7&dpr=1.3",
      "https://th.bing.com/th/id/OIP.pNPkTJm1h-h10laXOybTfQHaE7?pid=ImgDet&w=178&h=118&c=7&dpr=1.3"
    ],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Delhi",
  },
];

export default function HostelDetails() {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);

  useEffect(() => {
    const foundHostel = mockHostels.find((h) => h._id === id);
    setHostel(foundHostel);
  }, [id]);

  if (!hostel) {
    return <div className="text-center mt-20 text-xl">Hostel not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">{hostel.name}</h1>
        
        {/* Image Carousel */}
        <Carousel className="max-w-4xl mx-auto mb-6">
          <CarouselContent>
            {hostel.images.map((image, index) => (
              <CarouselItem key={index}>
                <img src={image} alt={`Image ${index + 1}`} className="w-full h-80 object-cover rounded-lg shadow-md" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <Card className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <CardContent>
            <p className="text-lg font-semibold">Location: {hostel.location}</p>
            <p className="text-xl font-bold text-primary">₹{hostel.price}/month</p>
            <p className="text-sm">⭐ {hostel.rating} / 5</p>
            <p className="mt-4 font-semibold">Amenities:</p>
            <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
              {hostel.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
            <div className="flex justify-between items-center mt-6">
              <a
                href={hostel.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                📍 View on Google Maps
              </a>
              <Button className="bg-primary text-white px-6 py-2 rounded-lg shadow-md">Book Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
