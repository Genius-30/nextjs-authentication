import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB database connection established successfully");
    });

    connection.on("error", (err) => {
      console.log("MongoDB database connection error: " + err);
      process.exit(1);
    });
  } catch (err) {
    console.log("Something went wrong to connecting to DB");
    console.log(err);
  }
}
