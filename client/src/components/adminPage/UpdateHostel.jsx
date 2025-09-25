import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { PenBox, Trash2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import api from "@/api";
import { useToast } from "@/hooks/use-toast";

function UpdateHostel({ collegesList, hostelId }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    hostelType: "",
    rules: "",
    food: "",
    mapLink: "",
    colleges: [],
    roomTypes: [],
    contactDetails: {
      phone: "",
      email: "",
      website: "",
    },
    facilities: {
      wifi: false,
      airConditioning: false,
      heater: false,
      powerBackup: false,
      laundryService: false,
      housekeeping: false,
      studyRoom: false,
      gym: false,
      commonRoom: false,
      parking: false,
      bikeRental: false,
      canteen: false,
      vendingMachine: false,
      tv: false,
      security: {
        cctv: false,
        biometricEntry: false,
        securityGuards: false,
        fireSafety: false,
      },
    },
  });
  
  const [roomType, setRoomType] = useState({
    type: "",
    capacity: "",
    pricePerMonth: "",
    availability: "",
  });
  
  const [selectedColleges, setSelectedColleges] = useState([]);

  useEffect(() => {
    const fetchHostelData = async () => {
      try {
        const response = await api.get(`/api/hostel/${hostelId}`);
        const hostelData = response.data;
        
        // Format rules and food as comma-separated strings for the form
        const formattedData = {
          ...hostelData,
          rules: Array.isArray(hostelData.rules) ? hostelData.rules.join(", ") : "",
          food: Array.isArray(hostelData.food) ? hostelData.food.join(", ") : "",
        };
        
        setFormData(formattedData);
        setSelectedColleges(formattedData.colleges || []);
      } catch (error) {
        console.error("Error fetching hostel data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch hostel data.",
        });
      }
    };
    
    if (hostelId) {
      fetchHostelData();
    }
  }, [hostelId, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactDetails: { ...prev.contactDetails, [name]: value },
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, hostelType: value }));
  };

  const handleRoomTypeChange = (e) => {
    const { name, value } = e.target;
    setRoomType((prev) => ({ ...prev, [name]: value }));
  };

  const addRoomType = () => {
    if (
      !roomType.type ||
      !roomType.capacity ||
      !roomType.pricePerMonth ||
      !roomType.availability
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all room type fields",
      });
      return;
    }
    
    const parsedRoomType = {
      ...roomType,
      capacity: parseInt(roomType.capacity, 10),
      pricePerMonth: parseInt(roomType.pricePerMonth, 10),
      availability: parseInt(roomType.availability, 10),
    };
    
    setFormData((prev) => ({
      ...prev,
      roomTypes: [...prev.roomTypes, parsedRoomType],
    }));
    
    setRoomType({
      type: "",
      capacity: "",
      pricePerMonth: "",
      availability: "",
    });
  };

  const removeRoomType = (index) => {
    setFormData((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== index),
    }));
  };

  const handleFacilityChange = (facilityName, checked) => {
    if (facilityName.includes(".")) {
      const [parent, child] = facilityName.split(".");
      setFormData((prev) => ({
        ...prev,
        facilities: {
          ...prev.facilities,
          [parent]: {
            ...prev.facilities[parent],
            [child]: checked,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        facilities: {
          ...prev.facilities,
          [facilityName]: checked,
        },
      }));
    }
  };

  const handleCollegeChange = (value) => {
    let updatedColleges = selectedColleges.includes(value)
      ? selectedColleges.filter((college) => college !== value)
      : [...selectedColleges, value];
    
    setSelectedColleges(updatedColleges);
    setFormData((prev) => ({ ...prev, colleges: updatedColleges }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (
      !formData.name.trim() ||
      !formData.location.trim() ||
      !formData.hostelType ||
      !formData.mapLink.trim() ||
      !formData.contactDetails.phone.trim() ||
      formData.roomTypes.length === 0
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description:
          "Please fill in all required fields (name, location, hostel type, map link, phone, and at least one room type).",
      });
      return;
    }

    if (!/^\d{10,15}$/.test(formData.contactDetails.phone)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (10-15 digits).",
      });
      return;
    }

    if (
      !/^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+[/#?]?.*$/.test(
        formData.mapLink
      )
    ) {
      toast({
        variant: "destructive",
        title: "Invalid Map Link",
        description: "Please enter a valid map URL.",
      });
      return;
    }

    setLoading(true);
    
    // Convert comma-separated strings to arrays
    const rulesArray = formData.rules
      ? formData.rules
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
    
    const foodArray = formData.food
      ? formData.food
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    // Prepare update data
    const updateData = {
      name: formData.name,
      location: formData.location,
      hostelType: formData.hostelType,
      mapLink: formData.mapLink,
      contactDetails: formData.contactDetails,
      rules: rulesArray,
      food: foodArray,
      colleges: formData.colleges,
      roomTypes: formData.roomTypes,
      facilities: formData.facilities
    };

    try {
      const response = await api.patch(`/api/hostel/${hostelId}`, updateData);
      
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Hostel updated successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update hostel",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <PenBox className="w-4 h-4 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-screen max-w-2xl p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-xl font-medium">Update Hostel</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information Section */}
              <div className="space-y-3">
                <h3 className="text-base font-medium">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Hostel Name*
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter hostel name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location*
                    </label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Enter hostel location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Hostel Type*
                    </label>
                    <Select
                      value={formData.hostelType}
                      onValueChange={handleSelectChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hostel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boys">Boys Hostel</SelectItem>
                        <SelectItem value="girls">Girls Hostel</SelectItem>
                        <SelectItem value="co-ed">Co-ed Hostel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Map Link*
                    </label>
                    <Input
                      id="mapLink"
                      name="mapLink"
                      type="url"
                      placeholder="Google Map URL"
                      value={formData.mapLink}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Details Section */}
              <div className="space-y-3">
                <h3 className="text-base font-medium">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone*
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Contact number"
                      value={formData.contactDetails?.phone || ''}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email address"
                      value={formData.contactDetails?.email || ''}
                      onChange={handleContactChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Website
                    </label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="Website URL"
                      value={formData.contactDetails?.website || ''}
                      onChange={handleContactChange}
                    />
                  </div>
                </div>
              </div>

              {/* Room Types Section */}
              <div className="space-y-3">
                <h3 className="text-base font-medium">
                  Room Types* <span className="text-sm">(at least 1)</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="w-full sm:w-auto">
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <Input
                        name="type"
                        placeholder="e.g., Single, Shared-2"
                        value={roomType.type}
                        onChange={handleRoomTypeChange}
                      />
                    </div>
                    <div className="w-full sm:w-auto">
                      <label className="block text-sm font-medium mb-1">Capacity</label>
                      <Input
                        name="capacity"
                        type="number"
                        min="1"
                        placeholder="Number of beds"
                        value={roomType.capacity}
                        onChange={handleRoomTypeChange}
                      />
                    </div>
                    <div className="w-full sm:w-auto">
                      <label className="block text-sm font-medium mb-1">Price/Month</label>
                      <Input
                        name="pricePerMonth"
                        type="number"
                        min="1"
                        placeholder="Price"
                        value={roomType.pricePerMonth}
                        onChange={handleRoomTypeChange}
                      />
                    </div>
                    <div className="w-full sm:w-auto">
                      <label className="block text-sm font-medium mb-1">Available Rooms</label>
                      <Input
                        name="availability"
                        type="number"
                        min="0"
                        placeholder="Number of rooms"
                        value={roomType.availability}
                        onChange={handleRoomTypeChange}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addRoomType}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Add Room
                    </Button>
                  </div>
                  
                  {formData.roomTypes && formData.roomTypes.length > 0 && (
                    <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                      <h4 className="font-medium mb-2">Room Types:</h4>
                      <div className="space-y-2">
                        {formData.roomTypes.map((room, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-md"
                          >
                            <div>
                              <span className="font-medium">{room.type}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                {room.capacity} person(s) | ₹{room.pricePerMonth}
                                /month | {room.availability} available
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRoomType(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Facilities Section */}
              <div className="space-y-3">
                <h3 className="text-base font-medium">Facilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    "wifi",
                    "airConditioning",
                    "heater",
                    "powerBackup",
                    "laundryService",
                    "housekeeping",
                    "studyRoom",
                    "gym",
                    "commonRoom",
                    "parking",
                    "bikeRental",
                    "canteen",
                    "vendingMachine",
                    "tv",
                  ].map((facility) => (
                    <div key={facility} className="flex items-center space-x-2">
                      <Switch
                        id={facility}
                        checked={formData.facilities?.[facility] || false}
                        onCheckedChange={(checked) =>
                          handleFacilityChange(facility, checked)
                        }
                      />
                      <Label htmlFor={facility} className="capitalize">
                        {facility.replace(/([A-Z])/g, " $1").trim()}
                      </Label>
                    </div>
                  ))}
                </div>
                
                {/* Security Facilities */}
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-2">Security Features</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "cctv",
                      "biometricEntry",
                      "securityGuards",
                      "fireSafety",
                    ].map((security) => (
                      <div key={security} className="flex items-center space-x-2">
                        <Switch
                          id={`security.${security}`}
                          checked={formData.facilities?.security?.[security] || false}
                          onCheckedChange={(checked) =>
                            handleFacilityChange(`security.${security}`, checked)
                          }
                        />
                        <Label
                          htmlFor={`security.${security}`}
                          className="capitalize"
                        >
                          {security.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colleges Section */}
              <div className="space-y-3">
                <h3 className="text-base font-medium">Nearby Colleges</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Nearby Colleges
                  </label>
                  <Select>
                    <SelectTrigger>
                      {selectedColleges.length > 0
                        ? `${selectedColleges[0]}`
                        : "Select Colleges"}
                    </SelectTrigger>
                    <SelectContent>
                      {collegesList &&
                        collegesList.map((college) => (
                          <div
                            key={college.value}
                            className="flex items-center gap-2 p-2 cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedColleges.includes(college.value)}
                              onCheckedChange={() =>
                                handleCollegeChange(college.value)
                              }
                            />
                            <label className="text-sm">{college.label}</label>
                          </div>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-3">
                <h3 className="text-base font-medium">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Hostel Rules (comma-separated)
                    </label>
                    <Textarea
                      id="rules"
                      name="rules"
                      placeholder="No smoking, No drinking, etc."
                      value={formData.rules || ''}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Food Options (comma-separated)
                    </label>
                    <Textarea
                      id="food"
                      name="food"
                      placeholder="Breakfast, Lunch, Dinner, North Indian, South Indian, etc."
                      value={formData.food || ''}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? "Updating..." : "Update Hostel"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export default UpdateHostel;