import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/api";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function AddHostel({ collegesList }) {
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

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

  const handleFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
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

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

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

    setFormLoading(true);

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

    const data = new FormData();
    data.append("name", formData.name);
    data.append("location", formData.location);
    data.append("hostelType", formData.hostelType);
    data.append("mapLink", formData.mapLink);
    data.append("contactDetails[phone]", formData.contactDetails.phone);

    if (formData.contactDetails.email) {
      data.append("contactDetails[email]", formData.contactDetails.email);
    }

    if (formData.contactDetails.website) {
      data.append("contactDetails[website]", formData.contactDetails.website);
    }

    rulesArray.forEach((rule) => {
      data.append("rules", rule);
    });

    foodArray.forEach((item) => {
      data.append("food", item);
    });

    formData.colleges.forEach((college) => {
      data.append("colleges", college);
    });

    data.append("roomTypes", JSON.stringify(formData.roomTypes));

    data.append("facilities", JSON.stringify(formData.facilities));

    selectedFiles.forEach((file) => {
      data.append("images", file);
    });

    try {
      const response = await api.post("/api/hostel/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Success!",
        description: "Hostel added successfully.",
      });

      setFormData({
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

      setSelectedFiles([]);
      setPreviewUrls([]);
      setSelectedColleges([]);
    } catch (error) {
      console.error("Error adding hostel:", error);
      toast({
        variant: "destructive",
        title: "Error while adding",
        description: error.response?.data?.message || "Try again later.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <section className="flex flex-row">
      <Card className="w-full max-w-4xl mx-auto p-6 shadow-lg rounded-xl bg-white dark:bg-gray-900">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-3xl font-semibold text-gray-900 dark:text-white">
            Add Hostel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    htmlFor="hostelType"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Hostel Type*
                  </label>
                  <Select
                    value={formData.hostelType}
                    onValueChange={handleSelectChange}
                    required
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
                <div>
                  <label
                    htmlFor="mapLink"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
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
                    className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone*
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Contact number"
                    value={formData.contactDetails.phone}
                    onChange={handleContactChange}
                    required
                    className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={formData.contactDetails.email}
                    onChange={handleContactChange}
                    className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Website
                  </label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="Website URL"
                    value={formData.contactDetails.website}
                    onChange={handleContactChange}
                    className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Room Types Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                Room Types* <span className="text-sm">(atleast 1)</span>
              </h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Type
                    </label>
                    <Input
                      name="type"
                      placeholder="e.g., Single, Shared-2"
                      value={roomType.type}
                      onChange={handleRoomTypeChange}
                      className="w-full mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Capacity
                    </label>
                    <Input
                      name="capacity"
                      type="number"
                      min="1"
                      placeholder="Number of beds"
                      value={roomType.capacity}
                      onChange={handleRoomTypeChange}
                      className="w-full mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price/Month
                    </label>
                    <Input
                      name="pricePerMonth"
                      type="number"
                      min="1"
                      placeholder="Price"
                      value={roomType.pricePerMonth}
                      onChange={handleRoomTypeChange}
                      className="w-full mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Available Rooms
                    </label>
                    <Input
                      name="availability"
                      type="number"
                      min="0"
                      placeholder="Number of rooms"
                      value={roomType.availability}
                      onChange={handleRoomTypeChange}
                      className="w-full mt-1"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addRoomType}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full active:scale-90"
                  >
                    Add Room
                  </Button>
                </div>

                {formData.roomTypes.length > 0 && (
                  <div className="mt-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Added Room Types:</h4>
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
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                Facilities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      checked={formData.facilities[facility]}
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
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Security Features
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {[
                    "cctv",
                    "biometricEntry",
                    "securityGuards",
                    "fireSafety",
                  ].map((security) => (
                    <div key={security} className="flex items-center space-x-2">
                      <Switch
                        id={`security.${security}`}
                        checked={formData.facilities.security[security]}
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
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                Nearby Colleges
              </h3>
              <div>
                <label
                  htmlFor="colleges"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Select Nearby Colleges
                </label>
                <Select>
                  <SelectTrigger className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
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
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="rules"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Hostel Rules (comma-separated)
                  </label>
                  <Textarea
                    id="rules"
                    name="rules"
                    placeholder="No smoking, No drinking, etc."
                    value={formData.rules}
                    onChange={handleChange}
                    rows={4}
                    className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="food"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Food Options (comma-separated)
                  </label>
                  <Textarea
                    id="food"
                    name="food"
                    placeholder="Breakfast, Lunch, Dinner, North Indian, South Indian, etc."
                    value={formData.food}
                    onChange={handleChange}
                    rows={4}
                    className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                Hostel Images
              </h3>
              <div>
                <label
                  htmlFor="fileUpload"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Upload Images*
                </label>
                <input
                  id="fileUpload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full mt-1 text-sm text-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Image Previews:</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative w-24 h-24 border rounded-md overflow-hidden"
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-center w-full">
              <Button
                type="submit"
                disabled={formLoading}
                className="w-40 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl active:scale-75 transition-all duration-700 ease-in-out"
              >
                {formLoading ? "Submitting..." : "Add Hostel"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

export default AddHostel;