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
} from "lucide-react";
import api from "@/api";
import CountUp from "react-countup";
import { Input } from "@/components/ui/input";
import Loading from "./Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import SearchCard from "@/components/adminPage/SearchCard";
import UserSearch from "@/components/adminPage/UserSearch";
import Header from "@/components/Header";

const AdminDashboard = () => {
  const [hostels, setHostels] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast;
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    amenities: "",
    hostelType: "boys",
    rules: "",
    mapLink: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

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
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdminRole = async (userId, makeAdmin) => {
    try {
      console.log('hello')
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, hostelType: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.location ||
      !formData.price ||
      selectedFiles.length === 0
    ) {
      toast({
        title:
          "Please fill in all required fields and upload at least one image.",
      });
      return;
    }

    setFormLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "amenities" || key === "rules") {
        const array = formData[key].split(",").map((item) => item.trim());
        array.forEach((item) => data.append(key, item));
      } else {
        data.append(key, formData[key]);
      }
    });

    selectedFiles.forEach((file) => {
      data.append("images", file);
    });

    try {
      const response = await api.post("/api/hostel/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({ title: "Hostel added successfully!" });

      setHostels((prev) => [...prev, response.data]);

      setFormData({
        name: "",
        location: "",
        price: "",
        amenities: "",
        hostelType: "boys",
        rules: "",
        mapLink: "",
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error adding hostel:", error);
      toast({
        variant: "destructive",
        title: "Error while adding",
        description: "Try Again after some time",
      });
    } finally {
      setFormLoading(false);
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
    <div className="p-6 space-y-6">
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>

      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {hostels.map((hostel) => (
                      <tr key={hostel._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{hostel.hostelId}</td>
                        <td className="px-4 py-2 text-sm">{hostel.name}</td>
                        <td className="px-4 py-2 text-sm">{hostel.location}</td>
                        <td className="px-4 py-2 text-sm">₹{hostel.price}</td>
                        <td className="px-4 py-2 text-sm">
                          {hostel.hostelType}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {hostel.food ? hostel.food.join(", ") : "N/A"}
                        </td>
                        <td className="px-4 py-2 text-sm">{hostel.rating}/5</td>
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
      <section className="flex flex-row">
        <Card className="w-full max-w-3xl mx-auto p-6 shadow-lg rounded-xl bg-white dark:bg-gray-900">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-3xl font-semibold text-gray-900 dark:text-white">
              Add Hostel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Hostel Name*
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter hostel name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Location*
                    </label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Enter hostel location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Price per Month (₹)*
                    </label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="hostelType"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Hostel Type*
                    </label>
                    <Select
                      value={formData.hostelType}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                        <SelectValue placeholder="Select hostel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boys">Boys Hostel</SelectItem>
                        <SelectItem value="girls">Girls Hostel</SelectItem>
                        <SelectItem value="co-ed">Co-ed Hostel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="amenities"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Amenities (comma-separated)
                    </label>
                    <Textarea
                      id="amenities"
                      name="amenities"
                      placeholder="WiFi, AC, Laundry, etc."
                      value={formData.amenities}
                      onChange={handleChange}
                      className="w-full mt-1 h-24 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="rules"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Rules (comma-separated)
                    </label>
                    <Textarea
                      id="rules"
                      name="rules"
                      placeholder="No smoking, No loud music after 10 PM, etc."
                      value={formData.rules}
                      onChange={handleChange}
                      className="w-full mt-1 h-24 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="mapLink"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Google Maps Link
                    </label>
                    <Input
                      id="mapLink"
                      name="mapLink"
                      placeholder="Enter Google Maps link"
                      value={formData.mapLink}
                      onChange={handleChange}
                      className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Hostel Images*
                </label>
                <div className="mt-1 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-700">
                  <div className="space-y-2 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="images"
                        className="cursor-pointer text-primary hover:text-primary/90"
                      >
                        <span>Upload images</span>
                        <input
                          id="images"
                          name="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  type="submit"
                  className="w-full rounded-lg bg-primary text-white py-3 hover:bg-primary/90"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                      Adding Hostel...
                    </div>
                  ) : (
                    "Add Hostel"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminDashboard;
