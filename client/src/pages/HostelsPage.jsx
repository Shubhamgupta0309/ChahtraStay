import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Star, MapPin, Wifi, Car, Dumbbell } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

const mockHostels = [
  {
    id: "1",
    name: "Cozy Stay PG",
    location: "Mumbai",
    price: 5000,
    amenities: ["WiFi", "Laundry", "AC"],
    rating: 4.5,
    reviews: 128,
    image: "/api/placeholder/400/300",
    distance: "2.5 km from center"
  },
  {
    id: "2",
    name: "Elite Hostel",
    location: "Delhi",
    price: 7000,
    amenities: ["WiFi", "Parking", "Gym"],
    rating: 4.2,
    reviews: 95,
    image: "/api/placeholder/400/300",
    distance: "1.8 km from center"
  }
];

const amenityIcons = {
  WiFi: <Wifi className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  Gym: <Dumbbell className="h-4 w-4" />,
};

export default function FindHostel() {
  const [hostels, setHostels] = useState(mockHostels);
  const [filteredHostels, setFilteredHostels] = useState(mockHostels);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [price, setPrice] = useState("none");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredHostels.length / itemsPerPage);
  const navigate = useNavigate()
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = hostels.filter((hostel) => {
        return (
          (search === "" || 
           hostel.name.toLowerCase().includes(search.toLowerCase()) ||
           hostel.location.toLowerCase().includes(search.toLowerCase())) &&
          (location === "all" || hostel.location === location) &&
          (price === "none" || hostel.price <= parseInt(price))
        );
      });
      setFilteredHostels(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, location, price, hostels]);

  const paginatedHostels = filteredHostels.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>
      
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
          Find Your Perfect Stay
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Browse through our curated selection of hostels and PGs designed for students
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-12 max-w-4xl mx-auto">
          <Input
            placeholder="Search by name or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 rounded-full border-purple-200 focus:ring-purple-500"
          />
          
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-48 rounded-full">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
            </SelectContent>
          </Select>

          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger className="w-48 rounded-full">
              <SelectValue placeholder="Max Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Limit</SelectItem>
              <SelectItem value="5000">Under ₹5,000</SelectItem>
              <SelectItem value="10000">Under ₹10,000</SelectItem>
              <SelectItem value="15000">Under ₹15,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-center mb-6">
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setLocation("all");
              setPrice("none");
            }}
            className="text-sm"
          >
            Reset Filters
          </Button>
        </div>

        <div className="mb-6 text-gray-600 text-center">
          Found {filteredHostels.length} properties
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </CardContent>
              </Card>
            ))
          ) : paginatedHostels.length > 0 ? (
            paginatedHostels.map((hostel) => (
              <Card
                key={hostel._id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white"
              >
                <div className="relative">
                  <img
                    src={hostel.image}
                    alt={hostel.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-purple-600">
                    ₹{hostel.price.toLocaleString()}/month
                  </div>
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">
                    {hostel.name}
                  </h2>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{hostel.location} • {hostel.distance}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">{renderStars(hostel.rating)}</div>
                    <span className="text-sm text-gray-600">
                      ({hostel.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {hostel.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center bg-purple-50 px-2 py-1 rounded-full text-xs text-purple-600"
                      >
                        {amenityIcons[amenity]}
                        <span className="ml-1">{amenity}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={()=>{
                    navigate(`/hostel/${hostel.id}`)
                  }} className="w-full bg-purple-600 hover:bg-purple-700 transition-colors">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">
                No properties found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearch("");
                  setLocation("");
                  setPrice("");
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredHostels.length > itemsPerPage && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={page === 1 ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Previous
                </PaginationLink>
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setPage(i + 1)}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationLink
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={page === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Next
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>

      <Footer />
    </div>
  );
}