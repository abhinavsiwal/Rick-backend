const mongoose = require("mongoose");
const cities = require("../constants/cities");

const emailSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
      enum: [
        "Antler",
        "Boundary",
        "Carbury",
        "Del Bonita",
        "Fortuna",
        "Frontier",
        "Alburg Springs",
        "Hannah",
        "Bridgewater",
        "Hansboro",
        "Cannon Corners",
        "Lancaster",
        "Churubusco",
        "Maida",
        "Easton",
        "Morgan",
        "Forest City",
        "Neche",
        "Hamlin",
        "Nighthawk",
        "Noonan",
        "Jackman",
        "Northgate",
        "Monticello",
        "Opheim",
        "Morses Line",
        "Pinecreek",
        "Norton",
        "Roseau",
        "Pinnacle Road",
        "Sarles",
        "Pittsburg",
        "Scobey",
        "Vanceboro",
        "Sherwood",
        "Walhalla",
        "Westhope",
        "Whitlash",
        "Wild Horse",
        "Willow Creek",
      ],
    },
    createdBy: {
      type: String,
      required: true,
      default: "email",
      enum: ["manual", "email"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Email", emailSchema);
