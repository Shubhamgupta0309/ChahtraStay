import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import api from "../api.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast.js";
import { Toaster } from "@/components/ui/toaster.jsx";

export default function AuthPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleAuth = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const endpoint = type === "login" ? "/api/user/login" : "/api/user/signup";
      const response = await api.post(endpoint, data);
      
      toast({
        title: type === "login" ? "Welcome Back!" : "Account Created Successfully",
        description: type === "login" ? "You are now logged in." : "Please log in to continue.",
        icon: <CheckCircle className="text-green-500" />, 
      });

      login(response?.data?.token);
      navigate("/");
    } catch (err) {
      let errorMsg = "An error occurred. Please try again.";
      if (err.response) {
        errorMsg = err.response.data.message || errorMsg;
      }
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
        icon: <AlertCircle className="text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <Toaster/>
        <CardContent className="p-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">ScaleUp Network</h2>
          <p className="text-center text-gray-600 mb-4">Welcome! Sign in or create an account.</p>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <form onSubmit={(e) => handleAuth(e, "login")} className="space-y-4">
                <Label>Email</Label>
                <Input type="email" name="email" placeholder="Enter your email" required />
                <Label>Password</Label>
                <Input type="password" name="password" placeholder="Enter your password" required />
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <form onSubmit={(e) => handleAuth(e, "signup")} className="space-y-4">
                <Label>Full Name</Label>
                <Input type="text" name="name" placeholder="Enter your full name" required />
                <Label>Email</Label>
                <Input type="email" name="email" placeholder="Enter your email" required />
                <Label>Phone Number</Label>
                <Input type="text" name="phone" placeholder="Enter your phone number" required />
                <Label>Password</Label>
                <Input type="password" name="password" placeholder="Create a password" required />
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
