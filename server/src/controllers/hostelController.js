import Hostel from "../model/HostelModel.js";

export const createHostel = async (req, res) => {
  console.log("Creating hostel...");
  console.log("Request body", req.body);
  const {
    name,
    location,
    hostelType,
    rules,
    food,
    mapLink,
    colleges,
    contactDetails,
    facilities,
  } = req.body;
  let roomTypes;
  try {
    roomTypes =
      typeof req.body.roomTypes === "string"
        ? JSON.parse(req.body.roomTypes)
        : req.body.roomTypes || [];
  } catch (error) {
    return res.status(400).json({ message: "Invalid roomTypes format" });
  }
  let facilitie;
  try {
    facilitie =
      typeof req.body.facilities === "string"
        ? JSON.parse(req.body.facilities)
        : req.body.facilities || {};
  } catch (error) {
    return res.status(400).json({ message: "Invalid facilitie format" });
  }

  if (!name || !location || !hostelType || !mapLink || !contactDetails?.phone) {
    return res.status(400).json({ message: "Required details missing" });
  }

  try {
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    function generateHostelId() {
      const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
      const digits = "23456789";
      let id = "HST-";

      for (let i = 0; i < 3; i++) {
        id += letters[Math.floor(Math.random() * letters.length)];
      }
      for (let i = 0; i < 3; i++) {
        id += digits[Math.floor(Math.random() * digits.length)];
      }

      return id;
    }

    let id;
    let isUnique = false;

    while (!isUnique) {
      id = generateHostelId();
      const existingHostel = await Hostel.findOne({ hostelId: id });
      if (!existingHostel) {
        isUnique = true;
      }
    }

    const newHostel = new Hostel({
      hostelId: id,
      name,
      location,
      hostelType: hostelType.toLowerCase().trim(),
      rules: rules || [],
      food: food || [],
      images: imageUrls,
      mapLink,
      owner: req.user._id,
      colleges: colleges || [],
      roomTypes,
      contactDetails,
      facilities: facilitie || {},
    });

    await newHostel.save();
    console.log(newHostel);
    return res
      .status(201)
      .json({ message: "Hostel Created", hostel: newHostel });
  } catch (error) {
    console.error("Error creating hostel:", error.message);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.status(200).json(hostels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHostelById = async (req, res) => {
  try {
    const id = req?.params?.id;
    if (!id) {
      return res.status(400).json({
        message: "Id not provided",
      });
    }
    const hostel = await Hostel.findOne({
      hostelId: id,
    });
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });
    res.status(200).json(hostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHostel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Hostel ID not provided" });
    }

    const existingHostel = await Hostel.findOne({ hostelId: id });
    if (!existingHostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const restrictedFields = ["hostelId", "owner"];
    for (let field of restrictedFields) {
      if (req.body[field]) {
        return res.status(403).json({ message: `Cannot update ${field}` });
      }
    }

    const updatedHostel = await Hostel.findOneAndUpdate(
      { hostelId: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Hostel updated successfully",
      updatedHostel,
    });
  } catch (error) {
    console.error("Error updating hostel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteHostel = async (req, res) => {
  try {
    const id = req?.params?.id;
    if (!id) {
      return res.status(400).json({
        message: "Id not provided",
      });
    }

    await Hostel.findOneAndDelete({
      hostelId: id,
    });
    res.status(200).json({ message: "Hostel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
