import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  CalendarIcon,
  BedDouble,
  User,
  Phone,
  Mail,
  IndianRupee,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import api from "@/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function HostelBooking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    roomSelection: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    occupation: "",
    hostelId: "",
    transactionId: "",
    amount: "",
  });

  const roomTypes = [
    { id: "shared-4", name: "Shared - 4 Bed", price: 5000 },
    { id: "shared-2", name: "Shared - 2 Bed", price: 7000 },
    { id: "private", name: "Private Room", price: 12000 },
  ];

  const { id } = useParams();
  const navigate = useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateDates = () => {
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      toast({
        title: "Invalid Check-in Date",
        description: "Check-in date cannot be in the past",
        variant: "destructive",
      });
      return false;
    }

    if (checkOut <= checkIn) {
      toast({
        title: "Invalid Check-out Date",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validatePhone = () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const generateTransactionId = () => {
    return `${id}-${formData.amount}-${Date.now()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates() || !validatePhone()) return;

    setIsSubmitting(true);

    try {
      const selectedRoom = roomTypes.find(
        (r) => r.id === formData.roomSelection
      );
      const totalAmount = selectedRoom ? selectedRoom.price * 2 : 0;

      const bookingData = {
        ...formData,
        hostelId: id,
        transactionId: generateTransactionId(),
        amount: totalAmount,
      };

      const res = await api.post("/api/booking/", bookingData);

      toast({
        title: "Booking successful",
        description: "Check your profile for booking information",
      });
      navigate("/profile")
    } catch (error) {
      toast({
        title: "Error while booking",
        description:
          error.response?.data?.message ||
          "Contact customer care if any amount was deducted",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  document.title="Book hostel at chahtraStay"

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>
      <Toaster />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Book Your Stay</h1>
            <p className="text-gray-600 mt-2">
              Fill in the details below to secure your accommodation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Stay Duration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkIn">Check-in Date</Label>
                        <div className="relative">
                          <Input
                            id="checkIn"
                            name="checkIn"
                            type="date"
                            value={formData.checkIn}
                            onChange={handleInputChange}
                            required
                            min={new Date().toISOString().split("T")[0]}
                            className="pl-10"
                            disabled={isSubmitting}
                          />
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkOut">Check-out Date</Label>
                        <div className="relative">
                          <Input
                            id="checkOut"
                            name="checkOut"
                            type="date"
                            value={formData.checkOut}
                            onChange={handleInputChange}
                            required
                            min={
                              formData.checkIn ||
                              new Date().toISOString().split("T")[0]
                            }
                            className="pl-10"
                            disabled={isSubmitting}
                          />
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BedDouble className="w-5 h-5 text-blue-500" />
                      Room Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      name="roomSelection"
                      value={formData.roomSelection}
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "roomSelection", value },
                        })
                      }
                      className="grid gap-4"
                      disabled={isSubmitting}
                    >
                      {roomTypes.map((room) => (
                        <div
                          key={room.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={room.id} id={room.id} />
                          <Label htmlFor={room.id} className="flex-1">
                            <div className="flex justify-between items-center">
                              <span>{room.name}</span>
                              <span className="font-semibold text-gray-700">
                                ₹{room.price}/month
                              </span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      Personal Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          name="gender"
                          value={formData.gender}
                          onValueChange={(value) =>
                            handleInputChange({
                              target: { name: "gender", value },
                            })
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="pl-10"
                            disabled={isSubmitting}
                          />
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            pattern="[0-9]{10}"
                            maxLength={10}
                            className="pl-10"
                            disabled={isSubmitting}
                          />
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Select
                        name="occupation"
                        value={formData.occupation}
                        onValueChange={(value) =>
                          handleInputChange({
                            target: { name: "occupation", value },
                          })
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select occupation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="professional">
                            Working Professional
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </form>
            </div>

            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-blue-500" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.roomSelection && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room Type</span>
                        <span className="font-medium">
                          {
                            roomTypes.find(
                              (r) => r.id === formData.roomSelection
                            )?.name
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Rent</span>
                        <span className="font-medium">
                          ₹
                          {
                            roomTypes.find(
                              (r) => r.id === formData.roomSelection
                            )?.price
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit</span>
                        <span className="font-medium">
                          ₹
                          {
                            roomTypes.find(
                              (r) => r.id === formData.roomSelection
                            )?.price
                          }
                        </span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total Due Now</span>
                        <span>
                          ₹
                          {(roomTypes.find(
                            (r) => r.id === formData.roomSelection
                          )?.price || 0) * 2}
                        </span>
                      </div>
                    </div>
                  )}
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Security deposit is refundable at the time of checkout
                      after deducting any damages.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
