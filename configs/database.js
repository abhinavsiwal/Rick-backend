const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const db = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDatabase;
