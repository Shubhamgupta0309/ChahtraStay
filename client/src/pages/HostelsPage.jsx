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
import {
  Star,
  MapPin,
  Wifi,
  Car,
  Dumbbell,
  Shield,
  Utensils,
  Tv,
  BookOpen,
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import api from "../api";

// Updated amenity icons based on the facilities in the data
const facilityIcons = {
  wifi: <Wifi className="mr-1 h-4 w-4" />,
  parking: <Car className="mr-1 h-4 w-4" />,
  gym: <Dumbbell className="mr-1 h-4 w-4" />,
  security: <Shield className="mr-1 h-4 w-4" />,
  canteen: <Utensils className="mr-1 h-4 w-4" />,
  tv: <Tv className="mr-1 h-4 w-4" />,
  studyRoom: <BookOpen className="mr-1 h-4 w-4" />,
};

export default function FindHostel() {
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [college, setCollege] = useState("all");
  const [price, setPrice] = useState("none");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/api/hostel/");
        // Filter to only include hostels with available rooms
        const hostelsWithAvailability = res.data.filter((hostel) =>
          hasAvailableRooms(hostel.roomTypes)
        );
        setHostels(hostelsWithAvailability);
        setFilteredHostels(hostelsWithAvailability);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Check if hostel has any available rooms
  const hasAvailableRooms = (roomTypes) => {
    if (!roomTypes || roomTypes.length === 0) return false;
    return roomTypes.some((room) => room.availability > 0);
  };

  useEffect(() => {
    if (hostels.length) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        let filtered = hostels.filter((hostel) => {
          // Get lowest price from room types
          const lowestPrice = Math.min(
            ...hostel.roomTypes.map((room) => room.pricePerMonth)
          );

          return (
            (search === "" ||
              hostel.name.toLowerCase().includes(search.toLowerCase()) ||
              hostel.location.toLowerCase().includes(search.toLowerCase())) &&
            (location === "all" || hostel.location.includes(location)) &&
            (price === "none" || lowestPrice <= parseInt(price)) &&
            (college === "all" ||
              hostel.colleges.some((clg) =>
                clg.toLowerCase().includes(college.toLowerCase())
              ))
          );
        });
        setFilteredHostels(filtered);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [search, location, price, college, hostels]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredHostels.length / itemsPerPage);
  const paginatedHostels = filteredHostels.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  // Get key facilities to display
  const getKeyFacilities = (facilities) => {
    const keyFacilities = [];

    if (facilities.wifi) keyFacilities.push("wifi");
    if (facilities.parking) keyFacilities.push("parking");
    if (facilities.gym) keyFacilities.push("gym");
    if (facilities.canteen) keyFacilities.push("canteen");
    if (facilities.studyRoom) keyFacilities.push("studyRoom");
    if (facilities.tv) keyFacilities.push("tv");
    if (
      facilities.security &&
      (facilities.security.cctv ||
        facilities.security.securityGuards ||
        facilities.security.biometricEntry)
    ) {
      keyFacilities.push("security");
    }

    return keyFacilities.slice(0, 4); // Show max 4 facilities
  };

  // Get lowest price from room types with availability
  const getLowestPrice = (roomTypes) => {
    if (!roomTypes || roomTypes.length === 0) return 0;
    const availableRooms = roomTypes.filter((room) => room.availability > 0);
    if (availableRooms.length === 0) return 0;
    return Math.min(...availableRooms.map((room) => room.pricePerMonth));
  };

  // Get total available rooms
  const getTotalAvailableRooms = (roomTypes) => {
    if (!roomTypes || roomTypes.length === 0) return 0;
    return roomTypes.reduce((total, room) => total + room.availability, 0);
  };

  const goToPreviousPage = () => setPage(Math.max(1, page - 1));
  const goToNextPage = () => setPage(Math.min(totalPages, page + 1));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Stay
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our curated selection of hostels and PGs designed for
            students
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 rounded-full border-purple-200 focus:ring-purple-500"
          />
          <Select value={college} onValueChange={setCollege}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select College" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colleges</SelectItem>
              <SelectItem value="iitb">IIT Bombay</SelectItem>
              <SelectItem value="vjti">VJTI Mumbai</SelectItem>
              <SelectItem value="ict">
                Institute of Chemical Technology (ICT)
              </SelectItem>
              <SelectItem value="spit">
                Sardar Patel Institute of Technology
              </SelectItem>
              <SelectItem value="kjsce">
                KJ Somaiya College of Engineering
              </SelectItem>
              <SelectItem value="djsce">
                DJ Sanghvi College of Engineering
              </SelectItem>
              <SelectItem value="mpstme">
                Mukesh Patel School of Technology
              </SelectItem>
              <SelectItem value="nmims">NMIMS University</SelectItem>
              <SelectItem value="rait">
                Ramrao Adik Institute of Technology (RAIT)
              </SelectItem>
              <SelectItem value="tcet">
                Thakur College of Engineering and Technology
              </SelectItem>
              <SelectItem value="sfit">
                St. Francis Institute of Technology
              </SelectItem>
              <SelectItem value="siesgst">
                SIES Graduate School of Technology
              </SelectItem>
              <SelectItem value="dbit">
                Don Bosco Institute of Technology
              </SelectItem>
              <SelectItem value="xavier">
                Xavier Institute of Engineering
              </SelectItem>
              <SelectItem value="tpoly">Thakur Polytechnic</SelectItem>
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
              <SelectItem value="Chennai">Chennai</SelectItem>
              <SelectItem value="Kolkata">Kolkata</SelectItem>
              <SelectItem value="Pune">Pune</SelectItem>
              <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
              <SelectItem value="Jaipur">Jaipur</SelectItem>
              <SelectItem value="Kota">Kota</SelectItem>
              <SelectItem value="Lucknow">Lucknow</SelectItem>
              <SelectItem value="Kanpur">Kanpur</SelectItem>
              <SelectItem value="Nagpur">Nagpur</SelectItem>
              <SelectItem value="Indore">Indore</SelectItem>
              <SelectItem value="Thane">Thane</SelectItem>
              <SelectItem value="Bhopal">Bhopal</SelectItem>
              <SelectItem value="Prayagraj">Prayagraj</SelectItem>
              <SelectItem value="Patna">Patna</SelectItem>
              <SelectItem value="Varanasi">Varanasi</SelectItem>
              <SelectItem value="Surat">Surat</SelectItem>
              <SelectItem value="Coimbatore">Coimbatore</SelectItem>
              <SelectItem value="Guwahati">Guwahati</SelectItem>
              <SelectItem value="Bhubaneswar">Bhubaneswar</SelectItem>
              <SelectItem value="Dehradun">Dehradun</SelectItem>
              <SelectItem value="Mysore">Mysore</SelectItem>
              <SelectItem value="Chandigarh">Chandigarh</SelectItem>
              <SelectItem value="Vijayawada">Vijayawada</SelectItem>
              <SelectItem value="Ranchi">Ranchi</SelectItem>
              <SelectItem value="Raipur">Raipur</SelectItem>
            </SelectContent>
          </Select>
          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Limit</SelectItem>
              <SelectItem value="5000">Under ₹5,000</SelectItem>
              <SelectItem value="10000">Under ₹10,000</SelectItem>
              <SelectItem value="15000">Under ₹15,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => {
              setSearch("");
              setLocation("all");
              setPrice("none");
              setCollege("all");
            }}
            className="text-sm"
          >
            Reset Filters
          </Button>
        </div>
        <div className="text-center mb-6 text-gray-600">
          Found {filteredHostels.length} properties with available rooms
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {isLoading ? (
            [...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-200 mb-2 rounded"></div>
                  <div className="h-4 bg-gray-200 mb-4 rounded w-3/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : paginatedHostels.length > 0 ? (
            paginatedHostels.map((hostel) => (
              <Card
                key={hostel._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      hostel.images && hostel.images.length > 0
                        ? hostel.images[0]
                        : "/placeholder-hostel.jpg"
                    }
                    alt={hostel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ₹{getLowestPrice(hostel.roomTypes).toLocaleString()}/month
                  </div>
                  <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {getTotalAvailableRooms(hostel.roomTypes)}{" "}
                    {getTotalAvailableRooms(hostel.roomTypes) === 1
                      ? "room"
                      : "rooms"}{" "}
                    available
                  </div>
                  {hostel.hostelType && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {hostel.hostelType}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {hostel.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {hostel.location}
                  </p>
                  <div className="flex items-center mb-3">
                    <div className="flex mr-1">
                      {renderStars(hostel.rating || 0)}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({hostel.reviews ? hostel.reviews.length : 0} reviews)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hostel.facilities &&
                      getKeyFacilities(hostel.facilities).map((facility) => (
                        <span
                          key={facility}
                          className="inline-flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded"
                        >
                          {facilityIcons[facility]}
                          {facility === "studyRoom"
                            ? "Study Room"
                            : facility.charAt(0).toUpperCase() +
                              facility.slice(1)}
                        </span>
                      ))}
                  </div>
                  <Button
                    onClick={() => {
                      navigate(`/hostel/${hostel.hostelId}`);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600 mb-4">
                No properties found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearch("");
                  setLocation("all");
                  setPrice("none");
                  setCollege("all");
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
        {filteredHostels.length > itemsPerPage && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink
                    onClick={goToPreviousPage}
                    disabled={page === 1}
                  >
                    Previous
                  </PaginationLink>
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setPage(i + 1)}
                      className={
                        i + 1 === page ? "bg-purple-500 text-white" : ""
                      }
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationLink
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                  >
                    Next
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
