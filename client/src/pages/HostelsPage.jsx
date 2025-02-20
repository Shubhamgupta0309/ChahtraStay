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
import api from "../api";

const amenityIcons = {
  WiFi: <Wifi className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  Gym: <Dumbbell className="h-4 w-4" />,
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
        setHostels(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (hostels.length) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        let filtered = hostels.filter((hostel) => {
          return (
            (search === "" ||
              hostel.name.toLowerCase().includes(search.toLowerCase()) ||
              hostel.location.toLowerCase().includes(search.toLowerCase())) &&
            (location === "all" || hostel.location.includes(location)) &&
            (price === "none" || hostel.price <= parseInt(price)) && (college === "all" || hostel.colleges.includes(college))
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
          index < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const goToPreviousPage = () => setPage(Math.max(1, page - 1));
  const goToNextPage = () => setPage(Math.min(totalPages, page + 1));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white pt-8">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
          Find Your Perfect Stay
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Browse through our curated selection of hostels and PGs designed for
          students
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-12 max-w-4xl mx-auto">
          <Input
            placeholder="Search by name or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 rounded-full border-purple-200 focus:ring-purple-500"
          />

          <Select value={college} onValueChange={setCollege}>
            <SelectTrigger className="w-48 rounded-full">
              <SelectValue placeholder="Select College" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colleges</SelectItem>
              <SelectItem value="tcet">
                Thakur College of Engineering and Technology
              </SelectItem>
              <SelectItem value="tpoly">Thakur Polytechnic</SelectItem>
              <SelectItem value="dj">
                Dwarkadas J. Sanghvi College of Engineering
              </SelectItem>
              <SelectItem value="spit">
                Sardar Patel Institute of Technology
              </SelectItem>
              <SelectItem value="vesit">
                Vivekanand Education Society's Institute of Technology
              </SelectItem>
              <SelectItem value="kjsieit">
                K. J. Somaiya Institute of Engineering and Information
                Technology
              </SelectItem>
              <SelectItem value="kjscet">
                K. J. Somaiya College of Engineering
              </SelectItem>
              <SelectItem value="sfit">
                St. Francis Institute of Technology
              </SelectItem>
              <SelectItem value="vjit">
                Vidyalankar Institute of Technology
              </SelectItem>
              <SelectItem value="fragnel">
                Fr. Conceicao Rodrigues College of Engineering
              </SelectItem>
              <SelectItem value="xaviers">St. Xavier’s College</SelectItem>
              <SelectItem value="ruia">Ramnarain Ruia College</SelectItem>
              <SelectItem value="nm">
                Narsee Monjee College of Commerce and Economics
              </SelectItem>
              <SelectItem value="mit">
                Mukesh Patel School of Technology Management & Engineering
              </SelectItem>
              <SelectItem value="rait">
                Ramrao Adik Institute of Technology
              </SelectItem>
              <SelectItem value="ict">
                Institute of Chemical Technology (ICT)
              </SelectItem>
              <SelectItem value="iiti">
                Indian Institute of Technology Bombay (IIT Bombay)
              </SelectItem>
              <SelectItem value="tsec">
                Thadomal Shahani Engineering College
              </SelectItem>
              <SelectItem value="sies">
                SIES Graduate School of Technology
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-48 rounded-full">
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
                    src={hostel.images[0]}
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
                    <span className="text-sm">{hostel.location}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderStars(hostel.rating)}
                    </div>
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
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">
                No properties found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearch("");
                  setLocation("all");
                  setPrice("none");
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
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  onClick={goToPreviousPage}
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
                    className={i + 1 === page ? "bg-purple-500 text-white" : ""}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationLink
                  onClick={goToNextPage}
                  disabled={page === totalPages}
                  className={
                    page === totalPages ? "opacity-50 cursor-not-allowed" : ""
                  }
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
