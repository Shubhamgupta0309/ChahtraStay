import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import api from "@/api";
import { Toaster } from "@/components/ui/toaster";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const [userData, setUserData] = useState("");
  const [bookings, setBookings] = useState([]); // Initialize bookings as an empty array
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await api.get("/api/user/profile");
        setUserData(userRes.data.userData);

        const bookingRes = await api.get("/api/booking/my-bookings");
        setBookings(bookingRes.data.bookings || []); // Ensure bookings is an array, even if empty
      } catch (error) {
        console.error("Error fetching user profile or bookings:", error);
      }
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster />
      {/* Profile Header */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 md:py-20">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            {userData.name}'s Profile
          </h1>
          <div className="mt-6">
            <Avatar className="w-32 h-32 mx-auto">
              <AvatarImage
                src={userData.profileImage || "/icon.png"} // Default avatar if no image
                alt={userData.name}
              />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {userData.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <Card className="shadow-xl rounded-lg overflow-hidden">
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:space-x-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Personal Information
                    </h3>
                    <div className="mt-4 text-gray-700">
                      <p className="font-semibold">Email:</p>
                      <p>{userData.email}</p>
                    </div>
                    <div className="mt-4 text-gray-700">
                      <p className="font-semibold">Phone:</p>
                      <p>{userData.phone}</p>
                    </div>
                    <div className="mt-4 text-gray-700">
                      <p className="font-semibold">Role:</p>
                      <p>{userData.role}</p>
                    </div>
                    <div className="mt-4 text-gray-700">
                      <p className="font-semibold">Joined:</p>
                      <p>{new Date(userData.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:w-1/3 mt-8 md:mt-0">
                    <Button
                      onClick={() => navigate(`/hostel`)}
                      className="w-full bg-purple-600 text-white hover:bg-purple-700 rounded-lg px-6 py-3 transition-all duration-300"
                    >
                      Manage Hostels
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bookings Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            My Bookings
          </h3>
          {bookings.length === 0 ? (
            <p className="text-gray-700">No bookings found.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card
                  key={booking.transactionId}
                  className="shadow-lg rounded-lg overflow-hidden"
                >
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:space-x-8">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {booking.hostelId}
                        </h4>
                        <p className="text-gray-700">
                          Room: {booking.roomSelection}
                        </p>
                        <p className="text-gray-700">
                          Check-in:{" "}
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700">
                          Check-out:{" "}
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700">
                          Amount: ${booking.amount}
                        </p>
                        <p className="text-gray-700">
                          Status:{" "}
                          <span className="font-semibold">
                            {booking.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>
      <Footer />
    </div>
  );
}
