import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Import your components
import HomePage from "./components/pages/HomePage";
import AboutUs from "./components/pages/about";
import SignPatient from "./components/SignPatient";
import SignDoctor from "./components/SignDoctor";
import SignPartner from "./components/SignPartner";
import Selection from "./components/Selection";
import LoginPatient from "./components/LoginPatient";
import LoginDoctor from "./components/LoginDoctor";
import LoginPartner from "./components/LoginPartner";
import Dashboard from "./components/pages/Dashboard";
import DoctorDashboard from "./components/pages/DoctorDashboard";
import PartnerDashboard from "./components/pages/PartnerDashboard";
import Blogs from "./components/pages/Blog";
import BlogDisplay from "./components/BlogDisplay";
import Doctors from "./components/pages/Doctors";
import DoctorProfile from "./components/DoctorProfile";
import ViewProfile from "./components/ViewProfile";
import DoctorViewProfile from "./components/PatientViewProfile";
import PartnerViewProfile from "./components/PartnerViewProfile";
import ViewAppointments from "./components/pages/ViewAppointment";
import ExerciseDisplay from "./components/ExerciseDisplay";
import EyeExercises from "./components/pages/eyeexercise";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute,js";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/signup/patient" element={<SignPatient />} />
        <Route path="/login/patient" element={<LoginPatient />} />
        <Route path="/signup/doctor" element={<SignDoctor />} />
        <Route path="/login/doctor" element={<LoginDoctor />} />
        <Route path="/signup/partner" element={<SignPartner />} />
        <Route path="/login/partner" element={<LoginPartner />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:blogId" element={<BlogDisplay />} />
        <Route path="/eyeexercise" element={<EyeExercises />} />
        <Route path="/eyeexercise/:exerciseId" element={<ExerciseDisplay />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:userType/:token"
          element={<ResetPassword />}
        />

        {/* Protected Routes */}
        {/* Patient Routes */}
        <Route
          path="/dashboard/patient"
          element={
            <ProtectedRoute redirectTo="/login/patient">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patient/viewprofile"
          element={
            <ProtectedRoute redirectTo="/login/patient">
              <ViewProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patient/eyeexercise"
          element={
            <ProtectedRoute redirectTo="/login/patient">
              <EyeExercises />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patient/eyeexercise/:exerciseId"
          element={
            <ProtectedRoute redirectTo="/login/patient">
              <ExerciseDisplay />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patient/blogs"
          element={
            <ProtectedRoute redirectTo="/login/patient">
              <Blogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patient/blogs/:blogId"
          element={
            <ProtectedRoute redirectTo="/login/patient">
              <BlogDisplay />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patient/aboutus"
          element={
            <ProtectedRoute redirectTo="/login/patient">
              <AboutUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patient/doctors"
          element={
            <ProtectedRoute redirectTo="/login/patient">
              <Doctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patient/doctors/:id"
          element={
            <ProtectedRoute redirectTo="/login/patient">
              <DoctorProfile />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/dashboard/doctor"
          element={
            <ProtectedRoute redirectTo="/login/doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/doctor/viewprofile"
          element={
            <ProtectedRoute redirectTo="/login/doctor">
              <DoctorViewProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/doctor/viewappointment"
          element={
            <ProtectedRoute redirectTo="/login/doctor">
              <ViewAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/doctor/blogs"
          element={
            <ProtectedRoute redirectTo="/login/doctor">
              <Blogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/doctor/blogs/:blogId"
          element={
            <ProtectedRoute redirectTo="/login/doctor">
              <BlogDisplay />
            </ProtectedRoute>
          }
        />

        {/* Partner Routes */}
        <Route
          path="/dashboard/partner"
          element={
            <ProtectedRoute redirectTo="/login/partner">
              <PartnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/partner/viewprofile"
          element={
            <ProtectedRoute redirectTo="/login/partner">
              <PartnerViewProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/partner/inventory"
          element={
            <ProtectedRoute redirectTo="/login/partner">
              {/* Replace with the correct component for inventory */}
              <Blogs /> {/* Placeholder component */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/partner/blogs"
          element={
            <ProtectedRoute redirectTo="/login/partner">
              <Blogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/partner/blogs/:blogId"
          element={
            <ProtectedRoute redirectTo="/login/partner">
              <BlogDisplay />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
