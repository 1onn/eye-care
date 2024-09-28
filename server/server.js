const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./database");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// File upload setup using multer
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit for file uploads

// Static file hosting
app.use(express.static(path.join(__dirname, "../client/build")));

const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Unauthorized: No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden: Invalid token" });
    req.user = user;
    next();
  });
};

// Patient signup route
app.post("/api/signuppatient", async (req, res) => {
  try {
    const { fname, lname, gender, phoneno, cnic, email, password } = req.body;

    const fnameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{11}$/;

    // Password length validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    if (!fnameRegex.test(fname)) {
      return res
        .status(400)
        .json({ error: "First name should contain only alphabets" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Enter a valid email" });
    }

    if (!phoneRegex.test(phoneno)) {
      return res
        .status(400)
        .json({ error: "Phone number must be 11 digits long" });
    }

    // Hashing sensitive information
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedCnic = await bcrypt.hash(cnic, 10);
    const hashedPhoneno = await bcrypt.hash(phoneno, 10);

    const newUser = await pool.query(
      "INSERT INTO patient (fname, lname, gender, phoneno, cnic, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [fname, lname, gender, hashedPhoneno, hashedCnic, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: newUser.rows[0].patient_id, type: "patient" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error("Error in SignUp", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Doctor signup route
app.post(
  "/api/signupdoctor",
  upload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "degree_pic", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        phoneno,
        cnic,
        dob,
        email,
        password,
        experience_years,
        experience_title,
        current_hospital,
        fee,
        description,
        available_start_time,
        available_end_time,
        specializations,
        services,
      } = req.body;

      // Ensure specializations and services are arrays
      const specializationArray = Array.isArray(specializations)
        ? specializations.map((item) => item.toString())
        : [];
      const servicesArray = Array.isArray(services)
        ? services.map((item) => item.toString())
        : [];

      // Convert arrays to PostgreSQL array format
      const formatArray = (arr) => {
        return arr.length === 0 ? '{}' : `"{${arr.join('","')}}"`; // Handle empty arrays
      };

      const profile_pic = req.files["profile_pic"]
        ? req.files["profile_pic"][0].buffer
        : null;
      const degree_pic = req.files["degree_pic"]
        ? req.files["degree_pic"][0].buffer
        : null;

      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newDoctor = await pool.query(
        `INSERT INTO doctors (name, phoneno, cnic, dob, email, password, profile_pic, degree_pic,
        experience_years, experience_title, current_hospital, fee, description,
        available_start_time, available_end_time, specialization, services)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
        [
          name,
          phoneno,
          cnic,
          dob,
          email,
          hashedPassword,
          profile_pic,
          degree_pic,
          experience_years,
          experience_title,
          current_hospital,
          fee,
          description,
          available_start_time,
          available_end_time,
          formatArray(specializationArray),
          formatArray(servicesArray),
        ]
      );

      const doctor = newDoctor.rows[0];
      const token = jwt.sign(
        { id: doctor.doctor_id, type: "doctor" },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token, user: doctor });
    } catch (error) {
      console.error("Error during doctor signup:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);


// Partner signup route
app.post(
  "/api/signuppartner",
  upload.fields([{ name: "SECP_certificate_pic", maxCount: 1 }]),
  async (req, res) => {
    try {
      const {
        store_name,
        store_phoneno,
        owner_name,
        owner_phoneno,
        store_address,
        cnic,
        email,
        password,
        description,
      } = req.body;

      const SECP_certificate_pic = req.files["SECP_certificate_pic"]
        ? req.files["SECP_certificate_pic"][0].buffer
        : null;

      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedCnic = await bcrypt.hash(cnic, 10);
      const hashedOwnerPhoneno = await bcrypt.hash(owner_phoneno, 10);

      const newPartner = await pool.query(
        `INSERT INTO partners (store_name, store_phoneno, owner_name, owner_phoneno, store_address, SECP_certificate_pic, cnic, email, password, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          store_name,
          store_phoneno,
          owner_name,
          hashedOwnerPhoneno,
          store_address,
          SECP_certificate_pic,
          hashedCnic,
          email,
          hashedPassword,
          description,
        ]
      );

      const partner = newPartner.rows[0];
      const token = jwt.sign(
        { id: partner.partner_id, type: "partner" },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token, user: partner });
    } catch (error) {
      console.error("Error during partner signup:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Patient login route
app.post("/api/loginpatient", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userQuery = await pool.query(
      "SELECT * FROM patient WHERE email = $1",
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = userQuery.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.patient_id, type: "patient" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        patient_id: user.patient_id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error in Login", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/logindoctor", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userQuery = await pool.query(
      "SELECT * FROM doctors WHERE email = $1",
      [email]
    );
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = userQuery.rows[0];
    const hashedPassword = user.password;

    if (!hashedPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const validPassword = await bcrypt.compare(password, hashedPassword);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.doctor_id, type: "doctor" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Include only essential information
    const userResponse = {
      doctor_id: user.doctor_id,
      name: user.name,
      email: user.email,
      current_hospital: user.current_hospital,
      specialization: user.specialization,
      services: user.services,
    };

    res.json({ token, user: userResponse });
  } catch (err) {
    console.error("Error in Login", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/loginpartner", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userQuery = await pool.query(
      "SELECT * FROM partners WHERE email = $1",
      [email]
    );
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = userQuery.rows[0];
    const hashedPassword = user.password;

    if (!hashedPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const validPassword = await bcrypt.compare(password, hashedPassword);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.partner_id, type: "partner" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Include only essential information
    const userResponse = {
      partner_id: user.partner_id,
      store_name: user.store_name,
      email: user.email,
    };

    res.json({ token, user: userResponse });
  } catch (err) {
    console.error("Error in Login", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Protected route example
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    let user;
    if (req.user.type === "patient") {
      user = await pool.query("SELECT * FROM patient WHERE patient_id = $1", [
        req.user.id,
      ]);
    } else if (req.user.type === "doctor") {
      user = await pool.query("SELECT * FROM doctors WHERE doctor_id = $1", [
        req.user.id,
      ]);
    } else if (req.user.type === "partner") {
      user = await pool.query("SELECT * FROM partners WHERE partner_id = $1", [
        req.user.id,
      ]);
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }

    if (user.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(user.rows[0]);
  } catch (err) {
    console.error("Error fetching user details", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put(
  "/api/updateDoctorProfile",
  authenticateToken,
  upload.fields([{ name: "profile_pic", maxCount: 1 }]),
  async (req, res) => {
    try {
      const {
        name,
        current_hospital,
        fee,
        experience_years,
        experience_title,
        available_start_time,
        available_end_time,
        education,
        description,
        specialization,
        services,
      } = req.body;
      const profile_pic = req.files["profile_pic"]
        ? req.files["profile_pic"][0].buffer
        : null;
      const profile_pic_type = req.files["profile_pic"]
        ? req.files["profile_pic"][0].mimetype.split("/")[1]
        : null;

      const parsedSpecializations = JSON.parse(specialization || "[]");
      const parsedServices = JSON.parse(services || "[]");

      const updatedDoctor = await pool.query(
        `UPDATE doctors SET name = $1, current_hospital = $2, fee = $3, experience_years = $4, experience_title = $5, available_start_time = $6, available_end_time = $7, education = $8, description = $9, specialization = $10, services = $11, profile_pic = COALESCE($12, profile_pic), profile_pic_type = COALESCE($13, profile_pic_type)
      WHERE doctor_id = $14 RETURNING *`,
        [
          name,
          current_hospital,
          fee,
          experience_years,
          experience_title,
          available_start_time,
          available_end_time,
          education,
          description,
          parsedSpecializations,
          parsedServices,
          profile_pic,
          profile_pic_type,
          req.user.id,
        ]
      );

      res.json(updatedDoctor.rows[0]);
    } catch (error) {
      console.error("Error updating doctor profile:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get(
  "/api/doctor/profile-pic/:doctorId",
  authenticateToken,
  async (req, res) => {
    try {
      const { doctorId } = req.params;
      const result = await pool.query(
        "SELECT profile_pic, profile_pic_type FROM doctors WHERE doctor_id = $1",
        [doctorId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      const { profile_pic, profile_pic_type } = result.rows[0];
      if (!profile_pic) {
        return res.status(404).json({ error: "Profile picture not found" });
      }

      res.setHeader("Content-Type", `image/${profile_pic_type}`);
      res.send(profile_pic);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await pool.query(
      "SELECT doctor_id, name, dob, specialization, current_hospital, encode(profile_pic, 'base64') as profile_pic FROM doctors"
    );
    res.json(doctors.rows);
  } catch (err) {
    console.error("Error fetching doctors", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/doctors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await pool.query(
      "SELECT * FROM doctors WHERE doctor_id = $1",
      [id]
    );
    if (doctor.rows.length === 0)
      return res.status(404).json({ error: "Doctor not found" });

    const doctorData = doctor.rows[0];
    const profilePicBase64 = doctorData.profile_pic
      ? Buffer.from(doctorData.profile_pic).toString("base64")
      : null;
    const degreePicBase64 = doctorData.degree_pic
      ? Buffer.from(doctorData.degree_pic).toString("base64")
      : null;

    const doctorWithImages = {
      ...doctorData,
      profile_pic: profilePicBase64,
      degree_pic: degreePicBase64,
    };

    res.json(doctorWithImages);
  } catch (err) {
    console.error("Error fetching doctor", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/doctor/appointments", authenticateToken, async (req, res) => {
  try {
    const doctor_id = req.user.id;
    const appointments = await pool.query(
      `SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.description, a.status, 
              p.fname AS patient_name, p.lname AS patient_lname
       FROM appointments a 
       JOIN patient p ON a.patient_id = p.patient_id 
       WHERE a.doctor_id = $1`,
      [doctor_id]
    );

    res.json(appointments.rows);
  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put(
  "/api/updatePatientProfile",
  authenticateToken,
  upload.fields([{ name: "profile_pic", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { fname, lname, email, password, gender, description } = req.body;
      const profile_pic = req.files["profile_pic"]
        ? req.files["profile_pic"][0].buffer
        : null;
      const profile_pic_type = req.files["profile_pic"]
        ? req.files["profile_pic"][0].mimetype.split("/")[1]
        : null;

      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updatedUser = await pool.query(
        `UPDATE patient SET 
        fname = $1, lname = $2, email = $3, 
        password = COALESCE($4, password), 
        gender = $5, description = $6, 
        profile_pic = COALESCE($7, profile_pic), 
        profile_pic_type = COALESCE($8, profile_pic_type)
      WHERE patient_id = $9 RETURNING *`,
        [
          fname,
          lname,
          email,
          hashedPassword,
          gender,
          description,
          profile_pic,
          profile_pic_type,
          req.user.id,
        ]
      );

      res.json(updatedUser.rows[0]);
    } catch (error) {
      console.error("Error updating patient profile:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get(
  "/api/patient/profile-pic/:patientId",
  authenticateToken,
  async (req, res) => {
    try {
      const { patientId } = req.params;
      const result = await pool.query(
        "SELECT profile_pic, profile_pic_type FROM patient WHERE patient_id = $1",
        [patientId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Patient not found" });
      }

      const { profile_pic, profile_pic_type } = result.rows[0];
      if (!profile_pic) {
        return res.status(404).json({ error: "Profile picture not found" });
      }

      res.setHeader("Content-Type", `image/${profile_pic_type}`);
      res.send(profile_pic);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.put(
  "/api/updatePartnerProfile",
  authenticateToken,
  upload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "SECP_certificate_pic", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        store_name,
        store_phoneno,
        owner_name,
        owner_phoneno,
        store_address,
        email,
        password,
        description,
        cnic,
      } = req.body;
      const profile_pic = req.files["profile_pic"]
        ? req.files["profile_pic"][0].buffer
        : null;
      const profile_pic_type = req.files["profile_pic"]
        ? req.files["profile_pic"][0].mimetype.split("/")[1]
        : null;
      const SECP_certificate_pic = req.files["SECP_certificate_pic"]
        ? req.files["SECP_certificate_pic"][0].buffer
        : null;
      const SECP_certificate_pic_type = req.files["SECP_certificate_pic"]
        ? req.files["SECP_certificate_pic"][0].mimetype.split("/")[1]
        : null;

      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updatedPartner = await pool.query(
        `UPDATE partners SET 
        store_name = $1, store_phoneno = $2, owner_name = $3, owner_phoneno = $4, store_address = $5, 
        email = $6, password = COALESCE($7, password), 
        description = $8, cnic = $9,
        profile_pic = COALESCE($10, profile_pic), 
        profile_pic_type = COALESCE($11, profile_pic_type),
        SECP_certificate_pic = COALESCE($12, SECP_certificate_pic),
        SECP_certificate_pic_type = COALESCE($13, SECP_certificate_pic_type)
      WHERE partner_id = $14 RETURNING *`,
        [
          store_name,
          store_phoneno,
          owner_name,
          owner_phoneno,
          store_address,
          email,
          hashedPassword,
          description,
          cnic,
          profile_pic,
          profile_pic_type,
          SECP_certificate_pic,
          SECP_certificate_pic_type,
          req.user.id,
        ]
      );

      res.json(updatedPartner.rows[0]);
    } catch (error) {
      console.error("Error updating partner profile:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get(
  "/api/partner/profile-pic/:partnerId",
  authenticateToken,
  async (req, res) => {
    try {
      const { partnerId } = req.params;
      const result = await pool.query(
        "SELECT profile_pic, profile_pic_type FROM partners WHERE partner_id = $1",
        [partnerId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Partner not found" });
      }

      const { profile_pic, profile_pic_type } = result.rows[0];
      if (!profile_pic) {
        return res.status(404).json({ error: "Profile picture not found" });
      }

      res.setHeader("Content-Type", `image/${profile_pic_type}`);
      res.send(profile_pic);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

//Booking related

// Route to book an appointment
app.post("/api/bookAppointment", authenticateToken, async (req, res) => {
  try {
    const { doctor_id, date, time, description } = req.body;
    const patient_id = req.user.id;

    const newAppointment = await pool.query(
      `INSERT INTO appointments (doctor_id, patient_id, appointment_date, appointment_time, description) 
          VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [doctor_id, patient_id, date, time, description]
    );

    res.json(newAppointment.rows[0]);
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get appointments for a patient
app.get("/api/patient/appointments", authenticateToken, async (req, res) => {
  try {
    const patient_id = req.user.id;
    const appointments = await pool.query(
      "SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.description, a.status, d.name AS doctor_name, d.specialization FROM appointments a JOIN doctors d ON a.doctor_id = d.doctor_id WHERE a.patient_id = $1",
      [patient_id]
    );

    res.json(appointments.rows);
  } catch (err) {
    console.error("Error fetching patient appointments:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get appointments for a doctor
app.get("/api/doctor/appointments", authenticateToken, async (req, res) => {
  try {
    const doctor_id = req.user.id;
    const appointments = await pool.query(
      "SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.description, a.status, p.fname AS patient_fname, p.lname AS patient_lname, p.gender FROM appointments a JOIN patient p ON a.patient_id = p.patient_id WHERE a.doctor_id = $1",
      [doctor_id]
    );

    res.json(appointments.rows);
  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await pool.query(
      "SELECT blog_id, encode(blog_image, 'base64') as blog_image, blog_title, blog_description FROM blogs"
    );
    res.json(blogs.rows);
  } catch (err) {
    console.error("Error fetching blogs", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await pool.query("SELECT * FROM blogs WHERE blog_id = $1", [
      id,
    ]);
    if (blog.rows.length === 0)
      return res.status(404).json({ error: "Blog not found" });

    const blogData = blog.rows[0];
    const imageBase64 = blogData.blog_image
      ? Buffer.from(blogData.blog_image).toString("base64")
      : null;
    const blogWithImage = { ...blogData, blog_image: imageBase64 };

    res.json(blogWithImage);
  } catch (err) {
    console.error("Error fetching blog", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/exercises", async (req, res) => {
  try {
    const exercises = await pool.query(
      "SELECT ex_id, encode(ex_pic, 'base64') as ex_pic, ex_title, ex_description FROM exercise"
    );
    res.json(exercises.rows);
  } catch (err) {
    console.error("Error fetching exercises", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/exercises/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const exercise = await pool.query(
      "SELECT * FROM exercise WHERE ex_id = $1",
      [id]
    );
    if (exercise.rows.length === 0)
      return res.status(404).json({ error: "Exercise not found" });

    const exerciseData = exercise.rows[0];
    const imageBase64 = exerciseData.ex_pic
      ? Buffer.from(exerciseData.ex_pic).toString("base64")
      : null;
    const exerciseWithImage = { ...exerciseData, ex_pic: imageBase64 };

    res.json(exerciseWithImage);
  } catch (err) {
    console.error("Error fetching exercise", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
