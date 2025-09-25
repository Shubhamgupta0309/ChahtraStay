import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
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
  BookOpen,
  School,
  Bed,
  Phone,
  Mail,
  ChevronRight,
  Landmark,
  Building,
  Zap,
  ShowerHead,
  Tv,
  UtensilsCrossed,
  Bike,
  GraduationCap,
  Footprints,
  HeartPulse,
  BellRing,
  Contact,
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import api from "@/api";
import { toast } from "@/hooks/use-toast";
import Loading from "./Loading";
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HostelDetails() {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const collegesList = [
    { label: "Thakur College of Engineering and Technology", value: "tcet" },
    { label: "Thakur Polytechnic", value: "tpoly" },
    { label: "Mukesh Patel School of Technology", value: "mpstme" },
    { label: "DJ Sanghvi College of Engineering", value: "djsce" },
    { label: "KJ Somaiya College of Engineering", value: "kjsce" },
    { label: "VJTI Mumbai", value: "vjti" },
    { label: "Sardar Patel Institute of Technology", value: "spit" },
    { label: "IIT Bombay", value: "iitb" },
    { label: "NMIMS University", value: "nmims" },
    { label: "Xavier Institute of Engineering", value: "xavier" },
    { label: "Don Bosco Institute of Technology", value: "dbit" },
    { label: "SIES Graduate School of Technology", value: "siesgst" },
    { label: "RAIT (Ramrao Adik Institute of Technology)", value: "rait" },
    { label: "St. Francis Institute of Technology", value: "sfit" },
  ];

  const getCollegeName = (value) => {
    const college = collegesList.find((c) => c.value === value);
    return college ? college.label : value;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/hostel/${id}`);
        setHostel(res.data);
      } catch (error) {
        console.error("Error fetching hostel data:", error);
        setHostel(null);
      } finally {
        setLoading(false);
      }
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
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  if (!hostel && !loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Hostel not found</p>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  const availableFacilities = [];
  if (hostel.facilities) {
    if (hostel.facilities.security) {
      if (hostel.facilities.security.cctv)
        availableFacilities.push({
          name: "CCTV",
          icon: <ShieldCheck className="w-4 h-4 text-red-500" />,
        });
      if (hostel.facilities.security.biometricEntry)
        availableFacilities.push({
          name: "Biometric Entry",
          icon: <Footprints className="w-4 h-4 text-indigo-500" />,
        });
      if (hostel.facilities.security.securityGuards)
        availableFacilities.push({
          name: "Security Guards",
          icon: <User className="w-4 h-4 text-slate-500" />,
        });
      if (hostel.facilities.security.fireSafety)
        availableFacilities.push({
          name: "Fire Safety",
          icon: <Zap className="w-4 h-4 text-red-500" />,
        });
    }

    if (hostel.facilities.wifi)
      availableFacilities.push({
        name: "WiFi",
        icon: <Wifi className="w-4 h-4 text-blue-500" />,
      });
    if (hostel.facilities.airConditioning)
      availableFacilities.push({
        name: "Air Conditioning",
        icon: <Sparkles className="w-4 h-4 text-blue-500" />,
      });
    if (hostel.facilities.heater)
      availableFacilities.push({
        name: "Heater",
        icon: <Zap className="w-4 h-4 text-orange-500" />,
      });
    if (hostel.facilities.powerBackup)
      availableFacilities.push({
        name: "Power Backup",
        icon: <Zap className="w-4 h-4 text-yellow-500" />,
      });
    if (hostel.facilities.laundryService)
      availableFacilities.push({
        name: "Laundry",
        icon: <Coffee className="w-4 h-4 text-blue-500" />,
      });
    if (hostel.facilities.housekeeping)
      availableFacilities.push({
        name: "Housekeeping",
        icon: <Home className="w-4 h-4 text-green-500" />,
      });
    if (hostel.facilities.studyRoom)
      availableFacilities.push({
        name: "Study Room",
        icon: <BookOpen className="w-4 h-4 text-purple-500" />,
      });
    if (hostel.facilities.gym)
      availableFacilities.push({
        name: "Gym",
        icon: <HeartPulse className="w-4 h-4 text-red-500" />,
      });
    if (hostel.facilities.commonRoom)
      availableFacilities.push({
        name: "Common Room",
        icon: <Users className="w-4 h-4 text-indigo-500" />,
      });
    if (hostel.facilities.parking)
      availableFacilities.push({
        name: "Parking",
        icon: <ParkingCircle className="w-4 h-4 text-blue-500" />,
      });
    if (hostel.facilities.bikeRental)
      availableFacilities.push({
        name: "Bike Rental",
        icon: <Bike className="w-4 h-4 text-green-500" />,
      });
    if (hostel.facilities.canteen)
      availableFacilities.push({
        name: "Canteen",
        icon: <Utensils className="w-4 h-4 text-orange-500" />,
      });
    if (hostel.facilities.vendingMachine)
      availableFacilities.push({
        name: "Vending Machine",
        icon: <Coffee className="w-4 h-4 text-amber-500" />,
      });
    if (hostel.facilities.tv)
      availableFacilities.push({
        name: "TV",
        icon: <Tv className="w-4 h-4 text-gray-500" />,
      });
  }

  document.title = `${hostel.name} | TravelTribe`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>
      <div className="max-w-5xl mx-auto p-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {hostel.name}
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <p className="truncate max-w-lg">{hostel.location}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-full bg-purple-100 hover:bg-purple-400 hover:text-white transition-all duration-500 ease-in-out"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* Carousel with navigation */}
        <div className="relative mb-8 rounded-xl overflow-hidden bg-black/5">
          <Carousel className="w-full">
            <CarouselContent>
              {hostel.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-64 sm:h-96 w-full">
                    <img
                      src={image}
                      alt={`${hostel.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {activeImageIndex + 1} / {hostel.images.length}
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="details" className="mb-8">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Building className="w-5 h-5 text-purple-500 mr-2" />
                      Hostel Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <AlignVerticalJustifyCenterIcon className="w-4 h-4 text-purple-500 mr-2" />
                        <span className="text-gray-700">
                          <span className="font-medium">Type:</span>{" "}
                          {hostel.hostelType.charAt(0).toUpperCase() +
                            hostel.hostelType.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="text-gray-700">
                          <span className="font-medium">Rating:</span>{" "}
                          {hostel.rating <= 0
                            ? "Not rated yet"
                            : `${hostel.rating}/5`}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Landmark className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-gray-700">
                          <span className="font-medium">ID:</span>{" "}
                          {hostel.hostelId}
                        </span>
                      </div>
                      {hostel.roomTypes && hostel.roomTypes.length > 0 && (
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 text-indigo-500 mr-2" />
                          <span className="text-gray-700">
                            <span className="font-medium">Rooms:</span>{" "}
                            {hostel.roomTypes.reduce(
                              (total, room) => total + room.availability,
                              0
                            )}{" "}
                            available
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Contact className="w-5 h-5 text-purple-500 mr-2" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      {hostel.contactDetails?.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-700">
                            <span className="font-medium">Phone:</span>{" "}
                            {hostel.contactDetails.phone}
                          </span>
                        </div>
                      )}
                      {hostel.contactDetails?.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-gray-700">
                            <span className="font-medium">Email:</span>{" "}
                            {hostel.contactDetails.email}
                          </span>
                        </div>
                      )}
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 rounded-full"
                          onClick={() => window.open(hostel.mapLink, "_blank")}
                        >
                          <MapPin className="w-4 h-4" />
                          View on Maps
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {hostel.colleges && hostel.colleges.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <GraduationCap className="w-5 h-5 text-blue-500 mr-2" />
                    Nearby Colleges
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hostel.colleges.map((collegeCode, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg transition-all hover:bg-blue-100"
                      >
                        <School className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-blue-800 font-medium">
                          {getCollegeName(collegeCode)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {hostel.rules && hostel.rules.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ShieldCheck className="w-5 h-5 text-red-500 mr-2" />
                    House Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <ul className="space-y-2">
                    {hostel.rules.map((rule, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 border-b border-gray-100 pb-2 last:border-0"
                      >
                        {rule.toLowerCase().includes("music") ? (
                          <Music className="w-4 h-4 text-gray-500 mt-1" />
                        ) : rule.toLowerCase().includes("time") ||
                          rule.includes("10") ? (
                          <Clock className="w-4 h-4 text-gray-500 mt-1" />
                        ) : rule.toLowerCase().includes("food") ||
                          rule.toLowerCase().includes("eat") ? (
                          <UtensilsCrossed className="w-4 h-4 text-gray-500 mt-1" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500 mt-1" />
                        )}
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Bed className="w-5 h-5 text-purple-500 mr-2" />
                  Available Room Types
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {hostel.roomTypes && hostel.roomTypes.length > 0 ? (
                  <div className="grid gap-6">
                    {hostel.roomTypes.map((room, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="bg-purple-100 p-4 md:w-1/3 flex flex-col justify-center items-center">
                          <Bed className="w-8 h-8 text-purple-600 mb-2" />
                          <h3 className="font-bold text-lg text-purple-800">
                            {room.type} Room
                          </h3>
                          <p className="text-sm text-purple-700 text-center">
                            Capacity: {room.capacity}{" "}
                            {room.capacity > 1 ? "persons" : "person"}
                          </p>
                        </div>
                        <div className="p-4 md:w-2/3 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 mb-2"
                                >
                                  {room.availability} rooms available
                                </Badge>
                              </div>
                              <div className="text-xl font-bold text-gray-800">
                                ₹{room.pricePerMonth}
                                <span className="text-sm font-normal">
                                  /month
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              This {room.type.toLowerCase()} room accommodation
                              includes basic furnishings and access to common
                              facilities.
                            </p>
                          </div>
                          <Button
                            className="w-full md:w-auto self-end bg-purple-600 hover:bg-purple-700 text-white rounded-full"
                            onClick={() =>
                              navigate(
                                `/hostel/${hostel.hostelId}/book?roomType=${room.type}`
                              )
                            }
                          >
                            Book This Room
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Room information not available
                  </p>
                )}
              </CardContent>
            </Card>

            {hostel.food && hostel.food.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Utensils className="w-5 h-5 text-orange-500 mr-2" />
                    Food Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {hostel.food.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg"
                      >
                        <Utensils className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="facilities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
                  Facilities
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {availableFacilities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {availableFacilities.map((facility, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                      >
                        {facility.icon}
                        <span className="text-gray-800">{facility.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">
                      This hostel doesn't have any listed facilities or
                      amenities.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Contact the hostel directly for more information about
                      available services.
                    </p>
                    {hostel.contactDetails?.phone && (
                      <div className="mt-4 inline-flex items-center justify-center gap-2 text-purple-600">
                        <Phone className="w-4 h-4" />
                        <span>{hostel.contactDetails.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  Guest Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!hostel.reviews || hostel.reviews.length === 0 ? (
                  <div className="text-center py-6">
                    <Star className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">
                      No reviews yet for this hostel.
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Be the first to share your experience!
                    </p>
                    <Button
                      className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() =>toast({
                        title:"This feature is comming soon..."
                      })
                        // navigate(`/hostel/${hostel.hostelId}/review`)
                      }
                    >
                      Write a Review
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hostel.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <img
                          src={review.img}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                            <h3 className="font-semibold text-gray-800">
                              {review.name}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 sm:mt-0">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Posted on {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-0 left-0 right-0 bg-white p-4 shadow-lg rounded-lg border-t z-10 md:relative md:shadow-none md:p-0 md:border-0">
          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-between items-center max-w-5xl mx-auto">
            <div className="text-center sm:text-left">
              {hostel.roomTypes && hostel.roomTypes.length > 0 && (
                <div className="ml-4 m-2">
                  <p className="text-sm text-gray-500">Starts from</p>
                  <p className="text-xl font-bold text-gray-800">
                    ₹
                    {Math.min(
                      ...hostel.roomTypes.map((room) => room.pricePerMonth)
                    )}
                    /month
                  </p>
                </div>
              )}
            </div>
            <Button
              onClick={() => navigate(`/hostel/${hostel.hostelId}/book`)}
              className="w-full sm:w-auto flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-full"
            >
              <Calendar className="w-5 h-5" />
              Book Now
            </Button>
          </div>
        </div>

        <Toaster />
      </div>
      <Footer />
    </div>
  );
}

const Users = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
