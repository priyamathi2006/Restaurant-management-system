const mongoose = require("mongoose");
const dns = require("dns");

// Force Google and Cloudflare DNS to avoid querySrv ECONNREFUSED errors on some local ISPs
dns.setServers(["8.8.8.8", "1.1.1.1"]);


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/restaurant-db");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
