import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
// Google login removed
import { Separator } from "@/components/ui/separator";
import { jwtDecode } from "jwt-decode";
import { set } from "react-hook-form";
import api from "@/api";

const Login = () => {
  const { login, signupUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();

  const handleAuth = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (type === "signup") {
        if (data.phone.length < 10) {
          return toast({
            title: "Phone number should be at least 10 digits",
            variant: "destructive",
          });
        }
        if (data.password.length < 8) {
          return toast({
            title: "Password should be at least 8 characters long",
            variant: "destructive",
          });
        }

        await signupUser(data);

        toast({
          title: "Account Created Successfully",
          description: `Welcome ${data.name}! Please log in to continue.`,
          icon: <CheckCircle className="text-green-500" />,
        });

        e.target.reset();
        setActiveTab("login");
        return;
      }

      const userData = await login(data.email, data.password);

      toast({
        title: "Welcome Back!",
        description: "You are now logged in.",
        icon: <CheckCircle className="text-green-500" />,
      });

      navigate("/");
    } catch (err) {
      let errorMsg = "Something went wrong. Please try again.";
      setError(err.message || errorMsg);
      console.log(err);
      if (err.status === 409) {
        errorMsg = "User already exists. Please log in.";
        setError(errorMsg);
      }
      if (err.status === 400) {
        errorMsg = "Invalid credentials. Please try again.";
        setError(errorMsg);
      }
      if (err.status === 500) {
        errorMsg = "Server error. Please try again later.";
        setError(errorMsg);
      }
      toast({
        title: type === "signup" ? "Registration Failed" : "Login Failed",
        description: error,
        variant: "destructive",
        icon: <AlertCircle className="text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  document.title = "Login | ChahtraStay";

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <Toaster />
        <CardContent className="p-6 bg-white rounded-lg">
          <h2 className="text-center text-2xl font-bold text-purple-700">
            ChahtraStay
          </h2>
          <p className="text-center text-gray-600 mb-4">
            Welcome! Sign in or create an account.
          </p>
          {/* Google login removed */}
          <div className="flex items-center justify-center gap-2 my-3 w-full">
            <Separator className="flex-grow max-w-32 " />
            <span className="text-gray-500 text-sm font-medium px-2">OR</span>
            <Separator className="flex-grow max-w-32" />
          </div>

          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form
                onSubmit={(e) => handleAuth(e, "login")}
                className="space-y-4"
              >
                <div className="mb-2 space-y-1">
                  <Label htmlFor="emailLogin" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="emailLogin"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="border border-gray-300"
                  />
                </div>
                <div className="mb-2 space-y-1">
                  <Label htmlFor="passLogin" className="text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="passLogin"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    className="border border-gray-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-500 text-white hover:bg-purple-600"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form
                onSubmit={(e) => handleAuth(e, "signup")}
                className="space-y-4"
              >
                <div className="mb-2 space-y-1">
                  <Label htmlFor="name" className="text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    required
                    className="border border-gray-300"
                  />
                </div>
                <div className="mb-2 space-y-1">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="border border-gray-300"
                  />
                </div>
                <div className="mb-2 space-y-1">
                  <Label htmlFor="phone" className="text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="number"
                    name="phone"
                    placeholder="Enter your phone number"
                    min="10"
                    required
                    className="border border-gray-300"
                  />
                </div>
                <div className="mb-2 space-y-1">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    required
                    className="border border-gray-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-500 text-white hover:bg-purple-600"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
