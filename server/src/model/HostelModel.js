import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema({
  hostelId:{type:String, required:true},
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  amenities: { type: [String], default: [] },
  rating: { type: Number, default: 0 },
  hostelType: { type: String, enum: ["boys", "girls", "co-ed"], required: true },
  rules: { type: [String], default: [] },
  food: { type: [String], default: [] },
  images: { type: [String], default: [] },
  mapLink: { type: String, required: true },
  reviews: [
    {
      name: String,
      comment: String,
      rating: Number,
      img: String,
    },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Hostel", hostelSchema);
