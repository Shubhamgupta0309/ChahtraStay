import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  CalendarRange,
  Check,
  X,
  Shield,
  ShieldOff,
  Search,
  PenBox,
} from "lucide-react";
import api from "@/api";
import CountUp from "react-countup";
import Loading from "./Loading";
import { Toaster } from "@/components/ui/toaster";
import SearchCard from "@/components/adminPage/SearchCard";
import UserSearch from "@/components/adminPage/UserSearch";
import Header from "@/components/Header";
import UpdateHostel from "@/components/adminPage/UpdateHostel";
import AddHostel from "@/components/adminPage/AddHostel";
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
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  document.title = "Dashboard TravelTribe";
  const [hostels, setHostels] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hostelsData, usersData, bookingsData] = await Promise.all([
          api.get("/api/hostel"),
          api.get("/api/user/all"),
          api.get("/api/booking"),
        ]);
        setHostels(hostelsData.data);
        setUsers(usersData.data);
        setBookings(bookingsData.data);
      } catch (error) {
        console.log(error);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdminRole = async (userId, makeAdmin) => {
    try {
      const endpoint = makeAdmin
        ? `/api/user/make-admin/${userId}`
        : `/api/user/remove-admin/${userId}`;
      const response = await api.patch(endpoint);
      setUsers(
        users.map((user) => (user._id === userId ? response.data.user : user))
      );
    } catch (error) {
      console.error("Error updating admin role:", error);
    }
  };

  const handleBookingStatus = async (bookingId, action) => {
    try {
      const response = await api.put(`/api/booking/${bookingId}/${action}`);
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId ? response.data.booking : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  }

  return (
    <div className=" flex flex-col space-y-6 mb-20">
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>
      <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
      <Toaster />
      <section className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card className="p-5 shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl hover:shadow-xl transition-shadow">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-white">
            <Users className="w-6 h-6 text-blue-500" />
            Total Users
          </CardTitle>
          <CardContent className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            <CountUp
              start={0}
              end={users ? users.length : 0}
              duration={2}
              separator=","
            />
          </CardContent>
        </Card>

        <Card className="p-5 shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl hover:shadow-xl transition-shadow">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-white">
            <Building2 className="w-6 h-6 text-green-500" />
            Total Hostels
          </CardTitle>
          <CardContent className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            <CountUp
              start={0}
              end={hostels ? hostels.length : 0}
              duration={2}
              separator=","
            />
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="hostels" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Hostels
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4" />
            Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hostels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Hostels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Hostel ID
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Location
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Price
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Food
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Contact No.
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Rating
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        {""}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {hostels.map((hostel) => (
                      <tr key={hostel._id} className="hover:bg-gray-50">
                        <td
                          className="px-4 py-2 text-sm hover:underline hover:cursor-pointer"
                          onClick={() => navigate(`/hostel/${hostel.hostelId}`)}
                        >
                          {hostel.hostelId}
                        </td>
                        <td className="px-4 py-2 text-sm">{hostel.name}</td>
                        <td className="px-4 py-2 text-sm">{hostel.location}</td>
                        <td className="px-4 py-2 text-sm">
                          {" "}
                          {`${hostel?.roomTypes[0].type} | ₹
                            ${hostel?.roomTypes[0]?.pricePerMonth} per month`}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {hostel.hostelType}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {hostel.food ? hostel.food.join(", ") : "N/A"}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {hostel.contactDetails.phone}
                        </td>
                        <td className="px-4 py-2 text-sm">{hostel.rating}/5</td>
                        <td className="px-4 py-2 text-sm">
                          <UpdateHostel
                            collegesList={collegesList}
                            hostelId={hostel?.hostelId}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Phone
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Role
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{user.name}</td>
                        <td className="px-4 py-2 text-sm">{user.email}</td>
                        <td className="px-4 py-2 text-sm">{user.phone}</td>
                        <td className="px-4 py-2 text-sm">{user.role}</td>
                        <td className="px-4 py-2 text-sm">
                          {user.role === "admin" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => handleAdminRole(user._id, false)}
                            >
                              <ShieldOff className="w-4 h-4" />
                              Remove Admin
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => handleAdminRole(user._id, true)}
                            >
                              <Shield className="w-4 h-4" />
                              Make Admin
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        receiptId
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Hostel ID
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Check In
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Check Out
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Room
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{booking.receiptId}</td>
                        <td className="px-4 py-2 text-sm">{booking.name}</td>
                        <td className="px-4 py-2 text-sm">
                          {booking.hostelId}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {booking.roomSelection}
                        </td>
                        <td className="px-4 py-2 text-sm">₹{booking.amount}</td>
                        <td className="px-4 py-2 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className=" flex flex-row px-4 py-2 text-sm space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            disabled={booking.status === "confirmed"}
                            onClick={() =>
                              handleBookingStatus(booking._id, "confirm")
                            }
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            disabled={booking.status === "cancelled"}
                            onClick={() =>
                              handleBookingStatus(booking._id, "cancel")
                            }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <section className="flex flex-row space-x-6">
        <UserSearch users={users} handleAdminRole={handleAdminRole} />
        <SearchCard hostels={hostels} />
      </section>
      <AddHostel collegesList={collegesList} />
    </div>
  );
};

export default AdminDashboard;