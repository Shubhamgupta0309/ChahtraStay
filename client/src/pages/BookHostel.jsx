import React, { useEffect, useState } from "react";
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
  AlertCircle,
  Info,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import RazorPayPayment from "@/components/RazorPayPayment";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import api from "@/api";
import { useAuth } from "@/context/AuthContext";

export default function HostelBooking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptId, setReceiptId] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [bookingSummary, setBookingSummary] = useState({
    roomType: "",
    monthlyRent: 0,
    securityDeposit: 0,
    numberOfMonths: 0,
    totalAmount: 0,
  });
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    roomSelection: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    amount: "",
  });
  const [currentStep, setCurrentStep] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Prefill user data from auth context
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchHostelData = async () => {
      try {
        const hostelData = await api.get(`/api/hostel/${id}`);
        setRoomTypes(hostelData.data.roomTypes);
      } catch (error) {
        console.error("Error fetching hostel data:", error);
        toast({
          title: "Error fetching hostel data",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };
    fetchHostelData();
  }, [id, toast]);

  // Calculate number of months between dates
  useEffect(() => {
    if (formData.checkIn && formData.checkOut && formData.roomSelection) {
      calculateBookingSummary();
    }
  }, [formData.checkIn, formData.checkOut, formData.roomSelection]);

  const calculateBookingSummary = () => {
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return;

    // Calculate months difference (including partial months)
    const months =
      (checkOut.getFullYear() - checkIn.getFullYear()) * 12 +
      (checkOut.getMonth() - checkIn.getMonth());

    // Add days as fraction of month if there are remaining days
    const daysInMonth = new Date(
      checkOut.getFullYear(),
      checkOut.getMonth() + 1,
      0
    ).getDate();
    const remainingDays = checkOut.getDate() - checkIn.getDate();
    const totalMonths =
      months + (remainingDays > 0 ? remainingDays / daysInMonth : 0);

    // Round up to nearest month (minimum 1 month)
    const roundedMonths = Math.max(1, Math.ceil(totalMonths));

    const selectedRoom = roomTypes.find(
      (r) => r.type === formData.roomSelection
    );

    if (selectedRoom) {
      const monthlyRent = selectedRoom.pricePerMonth;
      const securityDeposit = monthlyRent; // Security deposit equal to 1 month rent
      const totalRent = monthlyRent * roundedMonths;
      const totalAmount = totalRent + securityDeposit;

      setBookingSummary({
        roomType: selectedRoom.type,
        monthlyRent,
        securityDeposit,
        numberOfMonths: roundedMonths,
        totalAmount,
      });

      setFormData((prev) => ({
        ...prev,
        amount: totalAmount,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateDates = () => {
    const checkIn = formData.checkIn ? new Date(formData.checkIn) : null;
    const checkOut = formData.checkOut ? new Date(formData.checkOut) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      !checkIn ||
      !checkOut ||
      isNaN(checkIn.getTime()) ||
      isNaN(checkOut.getTime())
    ) {
      toast({
        title: "Missing Check-in or Check-out Date",
        variant: "destructive",
      });
      return false;
    }

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

    const oneMonthLater = new Date(checkIn);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    if (checkOut < oneMonthLater) {
      toast({
        title: "Minimum Stay Required",
        description: "Booking must be for at least 1 month",
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

  const validateForm = () => {
    if (!formData.name?.trim()) {
      toast({
        title: "Missing Name",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (!validatePhone()) return false;

    if (!formData.gender) {
      toast({
        title: "Select Gender",
        description: "Please select your gender.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.roomSelection) {
      toast({
        title: "Select a Room",
        description: "Please select a room type.",
        variant: "destructive",
      });
      return false;
    }

    const selectedRoom = roomTypes.find(
      (r) => r.type === formData.roomSelection
    );
    if (!selectedRoom) {
      toast({
        title: "Invalid Room Selection",
        description: "Please select a valid room type.",
        variant: "destructive",
      });
      return false;
    }

    if (!validateDates()) return false;

    return true;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (validateDates()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (formData.roomSelection) setCurrentStep(3);
      else {
        toast({
          title: "Select a Room",
          description: "Please select a room type to continue.",
          variant: "destructive",
        });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  document.title = "Book hostel at ChahtraStay";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>
      <Toaster />

      <main className="flex-grow py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Book Your Accommodation
              </h1>
              <div className="hidden md:flex items-center space-x-2">
                <div
                  className={`h-2 w-12 rounded-full ${
                    currentStep >= 1 ? "bg-purple-600" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-2 w-12 rounded-full ${
                    currentStep >= 2 ? "bg-purple-600" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-2 w-12 rounded-full ${
                    currentStep >= 3 ? "bg-purple-600" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            </div>
            <div className="text-gray-600 mt-2 flex items-center">
              <span className="font-medium">Step {currentStep} of 3:</span>
              <span className="ml-2">
                {currentStep === 1
                  ? "Select Dates"
                  : currentStep === 2
                  ? "Choose Room"
                  : "Personal Details & Payment"}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <form>
                {/* Step 1: Date Selection */}
                {currentStep === 1 && (
                  <Card className="mb-6 border-purple-200 shadow-md">
                    <CardHeader className="bg-purple-50 rounded-t-xl border-b border-purple-100">
                      <CardTitle className="flex items-center gap-2 text-purple-900">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        Select Your Stay Duration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 p-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="checkIn"
                            className="text-gray-700 font-medium"
                          >
                            Check-in Date
                          </Label>
                          <div className="relative">
                            <Input
                              id="checkIn"
                              name="checkIn"
                              type="date"
                              value={formData.checkIn}
                              onChange={handleInputChange}
                              required
                              min={new Date().toISOString().split("T")[0]}
                              className="pl-10 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                              disabled={isSubmitting}
                            />
                            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="checkOut"
                            className="text-gray-700 font-medium"
                          >
                            Check-out Date
                          </Label>
                          <div className="relative">
                            <Input
                              id="checkOut"
                              name="checkOut"
                              type="date"
                              value={formData.checkOut}
                              onChange={handleInputChange}
                              required
                              min={
                                formData.checkIn
                                  ? new Date(
                                      new Date(formData.checkIn).setMonth(
                                        new Date(formData.checkIn).getMonth() +
                                          1
                                      )
                                    )
                                      .toISOString()
                                      .split("T")[0]
                                  : new Date(
                                      new Date().setMonth(
                                        new Date().getMonth() + 1
                                      )
                                    )
                                      .toISOString()
                                      .split("T")[0]
                              }
                              className="pl-10 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                              disabled={isSubmitting}
                            />
                            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Continue to Room Selection{" "}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Room Selection */}
                {currentStep === 2 && (
                  <Card className="mb-6 border-purple-200 shadow-md">
                    <CardHeader className="bg-purple-50 border-b rounded-t-xl border-purple-100">
                      <CardTitle className="flex items-center gap-2 text-purple-900">
                        <BedDouble className="w-5 h-5 text-purple-600" />
                        Choose Your Room Type
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
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
                        {roomTypes.map((room, index) => (
                          <div
                            key={index}
                            className={`border rounded-lg p-4 transition-all ${
                              formData.roomSelection === room.type
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-purple-300"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem
                                value={room.type}
                                id={`room-${index}`}
                                className="text-purple-600"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`room-${index}`}
                                  className="flex justify-between items-center w-full"
                                >
                                  <span className="text-lg font-medium">
                                    {room.type}
                                  </span>
                                  <span className="text-lg font-bold text-purple-800">
                                    ₹{room.pricePerMonth.toLocaleString()}
                                    <span className="text-sm font-normal text-gray-600">
                                      /month
                                    </span>
                                  </span>
                                </Label>
                                <p className="text-gray-600 mt-1 ml-1 text-sm">
                                  {room.description ||
                                    "Comfortable accommodation with all essential amenities"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>

                      <div className="flex justify-between mt-6">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          Back to Dates
                        </Button>

                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Continue to Personal Details{" "}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Personal Details */}
                {currentStep === 3 && (
                  <Card className="mb-6 border-purple-200 shadow-md">
                    <CardHeader className="bg-purple-50 border-b rounded-t-xl border-purple-100">
                      <CardTitle className="flex items-center gap-2 text-purple-900">
                        <User className="w-5 h-5 text-purple-600" />
                        Enter Your Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 p-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="name"
                            className="text-gray-700 font-medium"
                          >
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                            disabled={isSubmitting}
                            placeholder="Krishna Gupta"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="gender"
                            className="text-gray-700 font-medium"
                          >
                            Gender
                          </Label>
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
                            <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all">
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

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="email"
                            className="text-gray-700 font-medium"
                          >
                            Email Address
                          </Label>
                          <div className="relative">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="pl-10 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                              placeholder="krsna@chahtrastay.com"
                              disabled={isSubmitting}
                            />
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="phone"
                            className="text-gray-700 font-medium"
                          >
                            Phone Number
                          </Label>
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
                              className="pl-10 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all"
                              placeholder="10-digit number"
                              disabled={isSubmitting}
                            />
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center mb-4">
                          <CreditCard className="w-5 h-5 text-purple-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">
                            Payment Details
                          </h3>
                        </div>

                        <div className="flex justify-between space-x-4">
                          <Button
                            type="button"
                            onClick={prevStep}
                            variant="outline"
                            className="border-purple-200 text-purple-700 hover:bg-purple-50"
                          >
                            Back to Room Selection
                          </Button>

                          <RazorPayPayment
                            hostelId={id}
                            formData={formData}
                            validateForm={validateForm}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </form>
            </div>

            {/* Booking Summary - Always visible */}
            <div className="md:col-span-1">
              <Card className="sticky top-24 border-purple-200 shadow-md overflow-hidden">
                <CardHeader className="bg-black text-white py-4 px-5">
                  <CardTitle className="flex items-center gap-2 text-white">
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 bg-gradient-to-b from-purple-50 to-white">
                  {formData.roomSelection ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room Type</span>
                        <span className="font-medium text-black">
                          {bookingSummary.roomType}
                        </span>
                      </div>

                      {formData.checkIn && formData.checkOut && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium text-black">
                            {bookingSummary.numberOfMonths}{" "}
                            {bookingSummary.numberOfMonths === 1
                              ? "month"
                              : "months"}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Rent</span>
                        <span className="font-medium text-black">
                          ₹{bookingSummary.monthlyRent.toLocaleString()}
                        </span>
                      </div>

                      {bookingSummary.numberOfMonths > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Rent</span>
                          <span className="font-medium text-black">
                            ₹
                            {(
                              bookingSummary.monthlyRent *
                              bookingSummary.numberOfMonths
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit</span>
                        <span className="font-medium text-black">
                          ₹{bookingSummary.securityDeposit.toLocaleString()}
                        </span>
                      </div>

                      <div className="pt-3 mt-3 border-t border-purple-200">
                        <div className="flex justify-between font-bold">
                          <span className="text-purple-900">Total Amount</span>
                          <span className="text-purple-900 text-lg">
                            ₹{bookingSummary.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <BedDouble className="w-12 h-12 text-purple-300 mx-auto mb-2" />
                      <p className="text-gray-500">
                        Select room and dates to see your booking summary
                      </p>
                    </div>
                  )}

                  <Alert className="bg-purple-50 mt-3 mb-3 border-purple-200 shadow-lg">
                    <AlertCircle className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-gray-800 text-sm">
                      Security deposit is refundable at checkout after deducting
                      any damages.
                    </AlertDescription>
                  </Alert>

                  {formData.checkIn &&
                    formData.checkOut &&
                    formData.roomSelection && (
                      <div className="bg-black text-white p-4 -mx-5 -mb-5 ">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">
                            Check-in
                          </span>
                          <span className="text-sm text-gray-300">
                            Check-out
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">
                            {new Date(formData.checkIn).toLocaleDateString(
                              "en-US",
                              { day: "numeric", month: "short" }
                            )}
                          </span>
                          <span className="text-purple-300">→</span>
                          <span className="font-bold">
                            {new Date(formData.checkOut).toLocaleDateString(
                              "en-US",
                              { day: "numeric", month: "short" }
                            )}
                          </span>
                        </div>
                      </div>
                    )}
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
