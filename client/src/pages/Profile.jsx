import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import api from "@/api";
import { Toaster } from "@/components/ui/toaster";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  LucideAppWindow,
  Mail,
  Phone,
  User,
  Calendar,
  BadgeIndianRupee,
  Clock,
  BedDouble,
  Building,
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfilePage() {
  const [userData, setUserData] = useState("");
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await api.get("/api/user/profile");
        setUserData(userRes.data.userData);

        const bookingRes = await api.get("/api/booking/my-bookings");
        setBookings(bookingRes.data || []);
      } catch (error) {
        console.error("Error fetching user profile or bookings:", error);
      }
    };
    fetchUserData();
  }, []);

  const filteredBookings = bookings.filter(
    (booking) => statusFilter === "all" || booking.status === statusFilter
  );

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (!userData) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster />
      {/* Keep existing profile header and info sections */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 md:py-20">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            {userData.name}'s Profile
          </h1>
          <div className="mt-6">
            <Avatar className="w-32 h-32 mx-auto">
              <AvatarImage src={userData.profileImage || "/icon.png"} alt={userData.name} />
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
                    <div className="mt-4 text-gray-700 flex flex-row space-x-2">
                      <p className="font-semibold flex flex-row">
                        <Mail className="mx-2 w-4 text-purple-800" /> Email:
                      </p>
                      <p>{userData.email}</p>
                    </div>
                    <div className="mt-4 text-gray-700 flex flex-row space-x-2">
                      <p className="font-semibold flex flex-row">
                        <Phone className="mx-2 w-4 text-purple-800" /> Phone:
                      </p>
                      <p>{userData.phone}</p>
                    </div>
                    <div className="mt-4 text-gray-700 flex flex-row space-x-2">
                      <p className="font-semibold flex flex-row">
                        <User className="mx-2 w-4 text-purple-800" /> Role:
                      </p>
                      <p>{userData.role}</p>
                    </div>
                    <div className="mt-4 text-gray-700 flex flex-row space-x-2">
                      <p className="font-semibold flex flex-row">
                        <LucideAppWindow className="mx-2 w-4 text-purple-800" /> Joined:
                      </p>
                      <p>{new Date(userData.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Bookings Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">My Bookings</h3>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {bookings.length === 0 ? (
            <Card className="p-6">
              <p className="text-gray-700 text-center">No bookings found.</p>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow >
                    <TableHead  className="text-purple-500 hover:text-purple-900"><Building className="w-4 h-4 inline mr-2 " />Hostel</TableHead>
                    <TableHead className="text-purple-500 hover:text-purple-900"><BedDouble className="w-4 h-4 inline mr-2" />Room</TableHead>
                    <TableHead className="text-purple-500 hover:text-purple-900"><Calendar className="w-4 h-4 inline mr-2" />Check-in</TableHead>
                    <TableHead className="text-purple-500 hover:text-purple-900"><Calendar className="w-4 h-4 inline mr-2" />Check-out</TableHead>
                    <TableHead className="text-purple-500 hover:text-purple-900"><BadgeIndianRupee className="w-4 h-4 inline mr-2" />Amount</TableHead>
                    <TableHead className="text-purple-500 hover:text-purple-900"><Clock className="w-4 h-4 inline mr-2" />Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.transactionId}>
                      <TableCell className="font-medium">{booking.hostelId}</TableCell>
                      <TableCell>{booking.roomSelection}</TableCell>
                      <TableCell>
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>₹{booking.amount}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
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