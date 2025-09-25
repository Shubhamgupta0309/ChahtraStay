import mongoose from "mongoose";
const hostelSchema = new mongoose.Schema(
  {
    hostelId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, default: 0 },
    hostelType: {
      type: String,
      enum: ["boys", "girls", "co-ed"],
      required: true,
    },
    rules: { type: [String], default: [] },
    food: { type: [String], default: [] },
    images: { type: [String], default: [] },
    colleges: { type: [String], default: [] },
    mapLink: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviews: [
      {
        name: String,
        comment: String,
        rating: { type: Number, min: 1, max: 5, required: true },
        img: String,
      },
    ],

    facilities: {
      wifi: { type: Boolean, default: false },
      airConditioning: { type: Boolean, default: false },
      heater: { type: Boolean, default: false },
      powerBackup: { type: Boolean, default: false },
      laundryService: { type: Boolean, default: false },
      housekeeping: { type: Boolean, default: false },
      studyRoom: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      commonRoom: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      bikeRental: { type: Boolean, default: false },
      canteen: { type: Boolean, default: false },
      vendingMachine: { type: Boolean, default: false },
      tv: { type: Boolean, default: false },
      security: {
        cctv: { type: Boolean, default: false },
        biometricEntry: { type: Boolean, default: false },
        securityGuards: { type: Boolean, default: false },
        fireSafety: { type: Boolean, default: false },
      },
    },

    roomTypes: [
      {
        type: { type: String, required: true },
        capacity: { type: Number, required: true },
        pricePerMonth: { type: Number, required: true },
        availability: { type: Number, required: true, default: 0 },
        numberOfRooms: { type: Number, default: 0 },
      },
    ],
    contactDetails: {
      phone: { type: String, required: true },
      email: { type: String },
      website: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hostel", hostelSchema);
