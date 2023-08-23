import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI || "mongodb://0.0.0.0:27017/dsalgoviz";

const connectDb = async () => {
  const con = await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${con.connection.host}`);
};

export default connectDb;
