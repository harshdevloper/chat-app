import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    email: "lavanyagupta@example.com",
    fullName: "Lavanya Gupta",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "ritusharma@example.com",
    fullName: "Ritu Sharma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "shrutisharma@example.com",
    fullName: "Shruti Sharma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
 
  // Male Users
  {
    email: "himanshuupadhyay@example.com",
    fullName: "Himanshu Upadhyay",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "nishanttyagi@example.com",
    fullName: "Nishant Tyagi",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "manishkumar@example.com",
    fullName: "Manish Kumar",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  
 
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();