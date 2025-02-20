import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

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
      
      // Login handling
      const userData = await login(data.email, data.password);
      
      toast({
        title: "Welcome Back!",
        description: "You are now logged in.",
        icon: <CheckCircle className="text-green-500" />,
      });

      navigate("/");
    } catch (err) {
      const errorMsg = err.code === 'auth/email-already-in-use' 
        ? 'Email already exists' 
        : err.response?.data?.message || err.message;
        
      setError(errorMsg);
      toast({
        title: type === "signup" ? "Registration Failed" : "Login Failed",
        description: errorMsg,
        variant: "destructive",
        icon: <AlertCircle className="text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  document.title = "Login | ChhatraStay";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <Toaster />
        <CardContent className="p-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">ChhatraStay</h2>
          <p className="text-center text-gray-600 mb-4">Welcome! Sign in or create an account.</p>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              <form onSubmit={(e) => handleAuth(e, "login")} className="space-y-4">
                <Label>Email</Label>
                <Input type="email" name="email" placeholder="Enter your email" required />
                <Label>Password</Label>
                <Input type="password" name="password" placeholder="Enter your password" required />
                <Button type="submit" className="w-full" disabled={loading}>
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
              <form onSubmit={(e) => handleAuth(e, "signup")} className="space-y-4">
                <Label>Full Name</Label>
                <Input type="text" name="name" placeholder="Enter your full name" required />
                <Label>Email</Label>
                <Input type="email" name="email" placeholder="Enter your email" required />
                <Label>Phone Number</Label>
                <Input type="text" name="phone" placeholder="Enter your phone number" required />
                <Label>Password</Label>
                <Input type="password" name="password" placeholder="Create a password" required />
                <Button type="submit" className="w-full" disabled={loading}>
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