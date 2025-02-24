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
  Edit,
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
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [userData, setUserData] = useState({});
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    isPasswordChanged: false,
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await api.get("/api/user/profile");
        // console.log("Userdata",userRes.data.userData.name)
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
  const handleProfileUpdate = async () => {
    try {
      const updatedFields = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) =>
            key !== "isPasswordChanged" && value !== "" && value !== "*******"
        )
      );

      if (!formData.isPasswordChanged) {
        delete updatedFields.password;
      }

      if (Object.keys(updatedFields).length > 0) {
        const res = await api.patch("/api/user/update", updatedFields);
        toast({
          title: "Profile updated successfully",
        });

        const userRes = await api.get("/api/user/profile");
        setUserData(userRes.data.userData);

        setFormData((prev) => ({
          ...prev,
          password: "*******",
          isPasswordChanged: false,
        }));
      }
    } catch (error) {
      toast({
        title: error.message || "Failed to update",
        description: "Please retry to update profile",
        variant: "destructive",
      });
    }
  };
  const handleValueChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
      ...(id === "password" && value !== "*******"
        ? { isPasswordChanged: true }
        : {}),
    }));
  };

  if (!userData) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster />
      <Header />
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 md:py-20">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            {userData?.name}'s Profile
          </h1>
          <div className="mt-6">
            <Avatar className="w-32 h-32 mx-auto">
              <AvatarImage
                src={formData?.profileImage || "/icon.png"}
                alt={userData?.name || "U"}
              />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                U
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
                    <div className="flex flow-row justify-between p-2 ">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Personal Information
                      </h3>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button className="rounded-full hover:bg-purple-800 shadow-xl active:scale-90 hover:text-white transition-all divide-purple-600 ease-in hover:cursor-pointer">
                            <Edit /> Update Profile
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-100">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                Update Profile
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Enter the details which you want to update only
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  defaultValue={userData?.name}
                                  className="col-span-2 h-8"
                                  onChange={handleValueChange}
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                  id="email"
                                  defaultValue={userData?.email}
                                  className="col-span-2 h-8"
                                  onChange={handleValueChange}
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                  id="phone"
                                  defaultValue={userData?.phone}
                                  className="col-span-2 h-8"
                                  onChange={handleValueChange}
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                  id="password"
                                  value={formData.password}
                                  type="password"
                                  className="col-span-2 h-8"
                                  onChange={handleValueChange}
                                  placeholder="Enter new password"
                                />
                              </div>
                              <Button
                                onClick={handleProfileUpdate}
                                className="rounded-full p-2 m-2 w-1/2 mx-auto bg-purple-500 hover:bg-purple-900"
                              >
                                Update
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
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
                        <LucideAppWindow className="mx-2 w-4 text-purple-800" />{" "}
                        Joined:
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
                  <TableRow>
                    <TableHead className="text-purple-500 hover:text-purple-900">
                      <Building className="w-4 h-4 inline mr-2 " />
                      Hostel
                    </TableHead>
                    <TableHead className="text-purple-500 hover:text-purple-900">
                      <BedDouble className="w-4 h-4 inline mr-2" />
                      Room
                    </TableHead>
                    <TableHead className="text-purple-500 hover:text-purple-900">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Check-in
                    </TableHead>
                    <TableHead className="text-purple-500 hover:text-purple-900">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Check-out
                    </TableHead>
                    <TableHead className="text-purple-500 hover:text-purple-900">
                      <BadgeIndianRupee className="w-4 h-4 inline mr-2" />
                      Amount
                    </TableHead>
                    <TableHead className="text-purple-500 hover:text-purple-900">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.transactionId}>
                      <TableCell className="font-medium">
                        {booking.hostelId}
                      </TableCell>
                      <TableCell>{booking.roomSelection}</TableCell>
                      <TableCell>
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>₹{booking.amount}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
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
      <Footer />
    </div>
  );
}
