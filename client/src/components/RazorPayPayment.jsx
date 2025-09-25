import React, { useState } from 'react';
import api from "@/api";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
const RazorPayPayment = ({hostelId, formData, validateForm }) => {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleBooking = async (receiptId) => {
    try {
      const bookingData = {
        ...formData,
        hostelId,
        receiptId
      };
      
      const res = await api.post("/api/booking/", bookingData);
      
      toast({
        title: "Booking successful",
        description: "Check your profile for booking information"
      });
      
      navigate("/profile");
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: "Your payment was successful but booking failed. Our team will contact you shortly."
      });
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    try {
      const orderResponse = await api.post("/api/payment/create-order", {
        amount: parseFloat(formData.amount),
        currency: "INR",
        hostelId: `${hostelId}`,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: "INR",
        name: "Travel Tribe",
        description: "Hostel Booking Payment",
        order_id: orderResponse.data.id,
        handler: async (response) => {
          try {
            const verifyResponse = await api.post(
              "/api/payment/verify-payment",
              response
            );

            if (verifyResponse.data.success) {
              
              toast({
                title: "✅ Payment Successful!",
                description: `Payment of ₹${orderResponse.data.amount / 100} was successful.`
              });
              await handleBooking(orderResponse.data.receipt);
            }
          } catch (error) {
            console.log(error)
            toast({
              variant: "destructive",
              title: "❌ Payment Verification Failed",
              description: "Please contact support if amount was deducted"
            });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "⚠️ Payment Failed",
        description: "Please try again or contact support"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isProcessing}
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Pay Now"
      )}
    </Button>
  );
};

export default RazorPayPayment;