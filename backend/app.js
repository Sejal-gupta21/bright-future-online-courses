import fs from "node:fs/promises";
// import bodyParser from "body-parser";
import express from "express";
import cors from "cors";

import authController from "./controllers/auth.controller.js";
import verifyToken from "./middleware/auth.middleware.js";
const app = express();

// Enable CORS for frontend development
// controls access between different domains.
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

// Parse incoming JSON requests
app.use(express.json({ limit: '1mb' }));

// Serve static images from the 'images' directory
app.use(express.static("images"))

// Public routes (no authentication required)
app.post("/signup", authController.signup);
app.post("/login", authController.login);

// Apply JWT authentication middleware to all routes below
app.use(verifyToken);

/**
 * Get current user profile (for pre-filling forms, etc.)
 * Returns: { id, name, email }
 */
app.get("/me", async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const usersFileContent = await fs.readFile("./data/users.json");
    const allUsers = JSON.parse(usersFileContent);
    const user = allUsers.find(u => u.id === loggedInUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Only return safe fields
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile." });
  }
});

// Endpoint to fetch all available courses
app.get("/courses", async (req, res) => {
  try {
    // Simulate network delay (optional, for testing loading states)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const fileContent = await fs.readFile("./data/courses.json");
    const coursesData = JSON.parse(fileContent);

    // Append base URL to imageUrls for easy consumption by frontend
    const coursesWithFullImageUrls = coursesData.map(course => ({
      ...course,
      imageUrl: `${req.protocol}://${req.get('host')}/${course.imageUrl}`
    }));

    res.status(200).json({ courses: coursesWithFullImageUrls });
  } catch (error) {
    console.error("Failed to read courses data:", error);
    res.status(500).json({ message: "Failed to fetch courses." });
  }
});

/**
 * Get all courses the current user is enrolled in.
 * Returns: Array of enrolled course objects.
 */
app.get("/user-enrolled-courses", async (req, res) => {
  try {
    const loggedInUserId = req.user.id; // Get user ID from the JWT token middleware

    const usersFileContent = await fs.readFile("./data/users.json");
    const allUsers = JSON.parse(usersFileContent);

    // Find the specific user in the array of all users.
    const user = allUsers.find(u => u.id === loggedInUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const enrolledCourseIds = user.enrolledCourseIds || []; 
    
    const allCoursesContent = await fs.readFile("./data/courses.json");
    const allCourses = JSON.parse(allCoursesContent);
    
    // Filter the master course list to get the full details of enrolled courses.
    const enrolledCourses = allCourses.filter(course => enrolledCourseIds.includes(course.id));
    
    const enrolledCoursesWithFullImageUrls = enrolledCourses.map(course => ({
      ...course,
      imageUrl: `${req.protocol}://${req.get('host')}/${course.imageUrl}`
    }));

    res.status(200).json({ enrolledCourses: enrolledCoursesWithFullImageUrls });
  } catch (error) {
    console.error("Failed to read user enrolled courses data:", error);
    res.status(500).json({ message: "Failed to fetch user enrolled courses." });
  }
});

/**
 * Enroll the current user in a course.
 * Request body: { courseId }
 * Returns: Success message and course details.
 */
app.put("/enroll-course", async (req, res) => {
  const { courseId } = req.body;
  const loggedInUserId = req.user.id;

  if (!courseId) {
    return res.status(400).json({ message: "Course ID is required." });
  }

  try {
    const allCoursesContent = await fs.readFile("./data/courses.json");
    const allCoursesData = JSON.parse(allCoursesContent);
    const courseToEnroll = allCoursesData.find((course) => course.id === courseId);

    if (!courseToEnroll) {
      return res.status(404).json({ message: "Course not found." });
    }

    const usersFileContent = await fs.readFile("./data/users.json");
    let allUsers = JSON.parse(usersFileContent);
    
    // Find the index of the user to update.
    const userIndex = allUsers.findIndex(u => u.id === loggedInUserId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found." });
    }
    
    let user = allUsers[userIndex];
    let updatedEnrolledCourseIds = user.enrolledCourseIds || [];

    if (!updatedEnrolledCourseIds.includes(courseId)) {
      updatedEnrolledCourseIds.push(courseId);
    } else {
        return res.status(409).json({ message: "User is already enrolled in this course." });
    }

    // Update the user's record.
    allUsers[userIndex].enrolledCourseIds = updatedEnrolledCourseIds;

    // Write the entire updated user array back to the file.
    await fs.writeFile(
      "./data/users.json",
      JSON.stringify(allUsers, null, 2)
    );

    res.status(200).json({ message: "Course enrolled successfully!", course: courseToEnroll });
  } catch (error) {
    console.error("Failed to enroll course:", error);
    res.status(500).json({ message: "Failed to enroll in course." });
  }
});

/**
 * Unenroll the current user from a course.
 * Route param: :id (courseId)
 * Returns: Success message.
 */
app.delete("/unenroll-course/:id", async (req, res) => {
  const courseId = req.params.id;
  const loggedInUserId = req.user.id;

  try {
    const usersFileContent = await fs.readFile("./data/users.json");
    let allUsers = JSON.parse(usersFileContent);

    const userIndex = allUsers.findIndex(u => u.id === loggedInUserId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found." });
    }
    
    let user = allUsers[userIndex];
    let updatedEnrolledCourseIds = user.enrolledCourseIds || [];

    const initialLength = updatedEnrolledCourseIds.length;
    updatedEnrolledCourseIds = updatedEnrolledCourseIds.filter((id) => id !== courseId);

    if (updatedEnrolledCourseIds.length === initialLength) {
        return res.status(404).json({ message: "Course not found in user's enrolled courses." });
    }

    allUsers[userIndex].enrolledCourseIds = updatedEnrolledCourseIds;

    await fs.writeFile(
      "./data/users.json",
      JSON.stringify(allUsers, null, 2)
    );

    res.status(200).json({ message: "Course unenrolled successfully!" });
  } catch (error) {
    console.error("Failed to unenroll course:", error);
    res.status(500).json({ message: "Failed to unenroll from course." });
  }
});

// 404 handler for unmatched routes
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  switch (status) {
    case 400:
      message = message || 'Bad Request';
      break;
    case 401:
      message = message || 'Unauthorized';
      break;
    case 403:
      message = message || 'Forbidden';
      break;
    case 404:
      message = message || 'Not Found';
      break;
    case 500:
      message = message || 'Internal Server Error';
      break;
  }

  res.status(status).json({ error: message });
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

export default app;