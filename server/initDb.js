// This script deletes all the tables existing in the database and creates new tables with the required schema.

const pool = require("./database");

const initDb = async () => {
  const dropTables = async () => {
    try {
      await pool.query(`
        DROP TABLE IF EXISTS appointments;
        DROP TABLE IF EXISTS blogs;
        DROP TABLE IF EXISTS exercise;
        DROP TABLE IF EXISTS partners;
        DROP TABLE IF EXISTS doctors;
        DROP TABLE IF EXISTS patient;
      `);
      console.log("All tables dropped.");
    } catch (error) {
      console.error("Error dropping tables:", error);
    }
  };

  const createPatientTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS patient (
          patient_id SERIAL PRIMARY KEY,
          fname VARCHAR,
          lname VARCHAR,
          gender VARCHAR,
          email VARCHAR,
          phoneno VARCHAR,
          cnic VARCHAR,
          password VARCHAR,
          description TEXT,
          profile_pic BYTEA,
          profile_pic_type VARCHAR,
          token VARCHAR,
          reset_token VARCHAR(255),
          reset_token_expiry TIMESTAMP
        );
      `);
      console.log("Patient table created.");
    } catch (error) {
      console.error("Error creating patient table:", error);
    }
  };

  const createDoctorsTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS doctors (
          doctor_id SERIAL PRIMARY KEY,
          name VARCHAR,
          phoneno VARCHAR,
          cnic VARCHAR,
          dob DATE,
          email VARCHAR,
          password VARCHAR,
          experience_years INTEGER,
          experience_title VARCHAR,
          education TEXT,
          current_hospital VARCHAR,
          fee NUMERIC,
          description TEXT,
          available_start_time TIME,
          available_end_time TIME,
          specialization VARCHAR[],
          services VARCHAR[],
          profile_pic BYTEA,
          profile_pic_type VARCHAR,
          degree_pic BYTEA,
          degree_pic_type VARCHAR,
          reset_token VARCHAR(255),
          reset_token_expiry TIMESTAMP
        );
      `);
      console.log("Doctors table created.");
    } catch (error) {
      console.error("Error creating doctors table:", error);
    }
  };

  const createPartnersTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS partners (
          partner_id SERIAL PRIMARY KEY,
          store_name VARCHAR,
          store_phoneno VARCHAR,
          owner_name VARCHAR,
          owner_phoneno VARCHAR,
          store_address TEXT,
          secp_certificate_pic BYTEA,
          secp_certificate_pic_type VARCHAR,
          cnic VARCHAR,
          email VARCHAR,
          password VARCHAR,
          description TEXT,
          profile_pic BYTEA,
          profile_pic_type VARCHAR,
          reset_token VARCHAR(255),
          reset_token_expiry TIMESTAMP
        );
      `);
      console.log("Partners table created.");
    } catch (error) {
      console.error("Error creating partners table:", error);
    }
  };

  const createAppointmentsTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS appointments (
          appointment_id SERIAL PRIMARY KEY,
          doctor_id INTEGER NOT NULL,
          patient_id INTEGER NOT NULL,
          appointment_date DATE,
          appointment_time TIME,
          status VARCHAR,
          description TEXT,
          FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id),
          FOREIGN KEY (patient_id) REFERENCES patient (patient_id)
        );
      `);
      console.log("Appointments table created.");
    } catch (error) {
      console.error("Error creating appointments table:", error);
    }
  };

  const createBlogsTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS blogs (
          blog_id SERIAL PRIMARY KEY,
          blog_title VARCHAR,
          blog_description TEXT,
          published_at TIMESTAMP,
          blog_image BYTEA
        );
      `);
      console.log("Blogs table created.");
    } catch (error) {
      console.error("Error creating blogs table:", error);
    }
  };

  const createExerciseTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS exercise (
          ex_id SERIAL PRIMARY KEY,
          ex_title VARCHAR,
          ex_description TEXT,
          ex_pic BYTEA
        );
      `);
      console.log("Exercise table created.");
    } catch (error) {
      console.error("Error creating exercise table:", error);
    }
  };

  try {
    await dropTables();
    await createPatientTable();
    await createDoctorsTable();
    await createPartnersTable();
    await createAppointmentsTable();
    await createBlogsTable();
    await createExerciseTable();
  } catch (error) {
    console.error("Error initializing tables:", error);
  }
};

initDb();
