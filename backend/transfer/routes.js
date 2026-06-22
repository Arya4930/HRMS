import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error("Something went wrong generating tokens");
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => !field || field.trim() === "")) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const { accessToken } = await generateAccessAndRefreshToken(user._id);

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
      return res.status(500).json({ success: false, message: "Error creating user" });
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user: createdUser, accessToken }
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: true
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "User logged in successfully",
        data: { user: loggedInUser, accessToken, refreshToken }
      });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { registerUser, loginUser };