import Hostel from "../model/HostelModel.js";

export const createHostel = async (req, res) => {
  const { name, location, price, amenities, hostelType, rules, food, mapLink } = req.body;

  if (!name || !location || !price || !hostelType || !mapLink) {
    return res.status(400).json({ message: "Details missing" });
  }

  try {
    const imageUrls = req.files.map((file) => file.path);

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
      price,
      amenities,
      hostelType: hostelType.toLowerCase().trim(),
      rules,
      food,
      images: imageUrls,
      mapLink,
      owner: req.user._id,
    });

    await newHostel.save();

    return res.status(201).json({ message: "Hostel Created", newHostel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
    const id = req?.params?.id;
    if (!id) {
      return res.status(400).json({
        message: "Id not provided",
      });
    }
    const updatedHostel = await Hostel.findOneAndUpdate(
      {
        hostelId: id,
      },
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedHostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
