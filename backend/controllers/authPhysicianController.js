import { PhysicianAuth } from "../models/physicianAuthModel.js";

const getPhysicianUser = async (req, res, next) => {
  const { username } = req.params;
  const { password } = req.body;

  try {
    console.log("Received POST request at /auth/", username);
    console.log("Username:", username);
    console.log("Password:", password);

    // Retrieve the physician from the database using the username
    const physician = await PhysicianAuth.findOne({ username });

    if (!physician) {
      console.log("Physician not found");
      return res.status(404).json({ message: "Physician not found" });
    }

    // Validate the password
    const isValidPassword = await physician.isValidPassword(password);

    if (!isValidPassword) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }

    // If everything is correct, you can send a success response
    console.log("Login successful");
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
};

const isExists = async (username) => {
  try {
    const existingPhysician = await PhysicianAuth.findOne({ username });
    return existingPhysician ? true : false;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    throw error; // Rethrow the error for handling in calling function
  }
};

const createPhysicianUser = async (req, res, next) => {
  console.log(req.body);
  const { username, password, physicianId } = req.body;

  try {
    console.log("Creating physician user...");

    // Check if a user with the same username already exists
    const existingPhysician = await PhysicianAuth.findOne({ username });

    if (existingPhysician) {
      // User with the same username already exists
      console.log("User already exists");
      return res.status(409).json({ message: "User already exists" });
    }

    const physician = await PhysicianAuth.create({
      username,
      password,
      physicianId
    });

    res.status(200).json(physician);
  } catch (error) {
    console.error("Error creating physician user:", error);
    next(error);
  }
};

export { getPhysicianUser, createPhysicianUser, isExists };