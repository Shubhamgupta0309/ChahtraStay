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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HostelBooking() {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    roomType: "",
    guestName: "",
    email: "",
    phone: "",
    gender: "",
    occupation: "",
  });

  const [showSummary, setShowSummary] = useState(false);

  const roomTypes = [
    { id: "shared-4", name: "Shared - 4 Bed", price: 5000 },
    { id: "shared-2", name: "Shared - 2 Bed", price: 7000 },
    { id: "private", name: "Private Room", price: 12000 },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSummary(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>
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
                {/* Stay Duration Card */}
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
                            className="pl-10"
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
                            className="pl-10"
                          />
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Room Selection Card */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BedDouble className="w-5 h-5 text-blue-500" />
                      Room Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      name="roomType"
                      value={formData.roomType}
                      onValueChange={(value) =>
                        handleInputChange({ target: { name: "roomType", value } })
                      }
                      className="grid gap-4"
                    >
                      {roomTypes.map((room) => (
                        <div key={room.id} className="flex items-center space-x-2">
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

                {/* Personal Details Card */}
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
                        <Label htmlFor="guestName">Full Name</Label>
                        <Input
                          id="guestName"
                          name="guestName"
                          value={formData.guestName}
                          onChange={handleInputChange}
                          required
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
                            className="pl-10"
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

                <Button type="submit" className="w-full">
                  Proceed to Payment
                </Button>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-blue-500" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.roomType && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room Type</span>
                        <span className="font-medium">
                          {
                            roomTypes.find((r) => r.id === formData.roomType)
                              ?.name
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Rent</span>
                        <span className="font-medium">
                          ₹
                          {
                            roomTypes.find((r) => r.id === formData.roomType)
                              ?.price
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit</span>
                        <span className="font-medium">
                          ₹
                          {
                            roomTypes.find((r) => r.id === formData.roomType)
                              ?.price
                          }
                        </span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total Due Now</span>
                        <span>
                          ₹
                          {roomTypes.find((r) => r.id === formData.roomType)
                            ?.price * 2}
                        </span>
                      </div>
                    </div>
                  )}
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Security deposit is refundable at the time of checkout after
                      deducting any damages.
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