import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Card, CardContent, CardTitle } from "../ui/card";
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
import { PenBox } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import api from "@/api";
import { toast } from "@/hooks/use-toast";

function UpdateHostel({ collegesList, hostelId }) {
  const [updateHostel, setUpdateHostel] = useState({
    name: "",
    location: "",
    price: "",
    amenities: [],
    hostelType: "",
    rules: [],
    food: [],
    colleges: [],
    mapLink: "",
  });
  const [loading, setLoading] = useState(false);

  const [selectedUpdateColleges, setSelectedUpdateColleges] = useState(
    updateHostel.colleges || []
  );

  useEffect(() => {
    const fetchHostelData = async () => {
      try {
        const response = await api.get(`/api/hostel/${hostelId}`);
        const hostelData = response.data;

        const formattedData = {
          ...hostelData,
          amenities: Array.isArray(hostelData.amenities)
            ? hostelData.amenities
            : hostelData.amenities.split(",").map((item) => item.trim()),
          rules: Array.isArray(hostelData.rules)
            ? hostelData.rules
            : hostelData.rules.split(",").map((item) => item.trim()),
          food: Array.isArray(hostelData.food)
            ? hostelData.food
            : hostelData.food.split(",").map((item) => item.trim()),
        };

        setUpdateHostel(formattedData);
        setSelectedUpdateColleges(formattedData.colleges);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch hostel data",
        });
      }
    };

    if (hostelId) {
      fetchHostelData();
    }
  }, [hostelId]);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    if (name === "amenities" || name === "rules" || name === "food") {
      const arrayValue = value.split(",").map((item) => item.trim());
      setUpdateHostel((prev) => ({ ...prev, [name]: arrayValue }));
    } else {
      setUpdateHostel((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChangeUpdate = (value) => {
    let updatedColleges = selectedUpdateColleges.includes(value)
      ? selectedUpdateColleges.filter((college) => college !== value)
      : [...selectedUpdateColleges, value];
    setSelectedUpdateColleges(updatedColleges);
    setUpdateHostel((prev) => ({ ...prev, colleges: updatedColleges }));
  };

  const handleUpdateSelect = (value) => {
    setUpdateHostel((prev) => ({ ...prev, hostelType: value }));
  };

  const handleUpdateHostel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedData = {
        ...updateHostel,
        price: Number(updateHostel.price),
      };

      const response = await api.patch(
        `/api/hostel/${hostelId}`,
        formattedData
      );

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
      <PopoverContent className="flex mr-5 p-2 max-w-xl">
        <Card className="w-full p-2 m-1">
          <CardTitle className="text-center p-2">Update Hostel</CardTitle>
          <CardContent>
            <form onSubmit={handleUpdateHostel} className="space-y-4">
              <Input
                id="name"
                name="name"
                placeholder="Enter hostel name"
                value={updateHostel.name}
                onChange={handleUpdateChange}
              />
              <Input
                id="location"
                name="location"
                placeholder="Enter location"
                value={updateHostel.location}
                onChange={handleUpdateChange}
              />
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="Price per month"
                value={updateHostel.price}
                onChange={handleUpdateChange}
              />
              <Select
                value={updateHostel.hostelType}
                onValueChange={handleUpdateSelect}
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
              <div>
                <label
                  htmlFor="colleges"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Select Nearby Colleges
                </label>
                <Select>
                  <SelectTrigger className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <SelectValue placeholder="Select Colleges" />
                  </SelectTrigger>
                  <SelectContent>
                    {collegesList.map((college) => (
                      <div
                        key={college.value}
                        className="flex items-center gap-2 p-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedUpdateColleges.includes(
                            college.value
                          )}
                          onCheckedChange={() =>
                            handleCheckboxChangeUpdate(college.value)
                          }
                        />
                        <label className="text-sm">{college.label}</label>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                id="amenities"
                name="amenities"
                placeholder="WiFi, AC, Laundry, etc."
                value={updateHostel.amenities.join(", ")}
                onChange={handleUpdateChange}
              />
              <Textarea
                id="food"
                name="food"
                placeholder="Veg, Non-veg, Mess available or not"
                value={updateHostel.food.join(", ")}
                onChange={handleUpdateChange}
              />
              <Textarea
                id="rules"
                name="rules"
                placeholder="No smoking, No loud music after 10 PM, etc."
                value={updateHostel.rules.join(", ")}
                onChange={handleUpdateChange}
              />
              <Input
                id="mapLink"
                name="mapLink"
                placeholder="Google Maps link"
                value={updateHostel.mapLink}
                onChange={handleUpdateChange}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export default UpdateHostel;
