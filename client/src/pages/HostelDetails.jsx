import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  MapPin,
  Utensils,
  ShieldCheck,
  Home,
  Wifi,
  ParkingCircle,
  Share2,
  Star,
  User,
  Calendar,
  Clock,
  Music,
  Sparkles,
  Coffee,
  AlignVerticalJustifyCenterIcon,
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import api from "@/api";

export default function HostelDetails() {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/api/hostel/${id}`);
      setHostel(res.data);
    };
    fetchData();
  }, [id]);

  const navigate = useNavigate();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hostel.name,
          text: `Check out ${hostel.name} in ${hostel.location}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!hostel) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Hostel not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{hostel.name}</h1>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        <Carousel className="w-full mb-8">
          <CarouselContent>
            {hostel.images.map((image, index) => (
              <CarouselItem key={index}>
                <img
                  src={image}
                  alt={`${hostel.name} - Image ${index + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="text-lg">{hostel.location}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">
                  ₹{hostel.price}/month
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-lg">
                  {hostel.rating <= 0 ? "Not rated yet" : `${hostel.rating}/5`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlignVerticalJustifyCenterIcon className="w-5 h-5 text-purple-500" />
                <span className="text-lg">
                  Hostel Type: {hostel.hostelType}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Essential Information
              </h2>
              <p className="text-gray-600">
                {hostel.rules && hostel.rules.length > 0 ? (
                  <ul>
                    {hostel.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                ) : (
                  "Welcome to your potential & temporary home. Please check all the details before booking"
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hostel.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  {amenity === "WiFi" && (
                    <Wifi className="w-4 h-4 text-blue-500" />
                  )}
                  {amenity === "Parking" && (
                    <ParkingCircle className="w-4 h-4 text-blue-500" />
                  )}
                  {amenity === "AC" && (
                    <Sparkles className="w-4 h-4 text-blue-500" />
                  )}
                  {amenity === "Laundry" && (
                    <Coffee className="w-4 h-4 text-blue-500" />
                  )}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-500" />
              House Rules
            </h2>
            <ul className="grid gap-3">
              {hostel.rules.map((rule, index) => (
                <li key={index} className="flex items-center gap-2">
                  {rule.includes("Music") && (
                    <Music className="w-4 h-4 text-gray-500" />
                  )}
                  {rule.includes("10") && (
                    <Clock className="w-4 h-4 text-gray-500" />
                  )}
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Guest Reviews
            </h2>
            <div className="space-y-4">
              {hostel.reviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                hostel.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={review.img}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{review.name}</h3>
                      <p className="text-gray-600">{review.comment}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.open(hostel.mapLink, "_blank")}
          >
            <MapPin className="w-4 h-4" />
            View on Google Maps
          </Button>
          <Button
            onClick={() => navigate(`/hostel/${hostel.id}/book`)}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
