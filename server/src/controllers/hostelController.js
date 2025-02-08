import Hostel from "../model/HostelModel.js"

export const createHostel = async (req, res) => {
  const {name,location,price,amenities,hostelType,rules,food,images,mapLink} = req.body
  if(!name || !location || !price || !hostelType || !mapLink){
    return res.status(400).json({
      message:"Deatails missing"
    })
  }
  try {
   
    res.status(201).json("Hostel Created");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Hostels (Public)
export const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.status(200).json(hostels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single Hostel by ID (Public)
export const getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });
    res.status(200).json(hostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Hostel (Admin Only)
export const updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    if (hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedHostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedHostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Hostel (Admin Only)
export const deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    if (hostel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Hostel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Hostel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
