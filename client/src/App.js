import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/pages/HomePage';
import AboutUs from './components/pages/about';
import SignPatient from './components/SignPatient';
import SignDoctor from './components/SignDoctor';
import SignPartner from './components/SignPartner';
import Selection from './components/Selection';
import LoginPatient from './components/LoginPatient';
import LoginDoctor from './components/LoginDoctor';
import LoginPartner from './components/LoginPartner';
import Dashboard from './components/pages/Dashboard';
import DoctorDashboard from './components/pages/DoctorDashboard';
import PartnerDashboard from './components/pages/PartnerDashboard';
import Blogs from './components/pages/Blog';
import BlogDisplay from './components/BlogDisplay';
import Doctors from './components/pages/Doctors';
import DoctorProfile from './components/DoctorProfile';
import ViewProfile from './components/ViewProfile';
import DoctorViewProfile from './components/PatientViewProfile';
import PartnerViewProfile from './components/PartnerViewProfile';
import ViewAppointments from './components/pages/ViewAppointment';
import ExerciseDisplay from './components/ExerciseDisplay';
import EyeExercises from './components/pages/eyeexercise';

function App() {
  const ProtectedRoute = ({ element: Component, redirectTo }) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      return <Component />;
    } else {
      return <Navigate to={redirectTo} />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/signup/patient" element={<SignPatient />} />
        <Route path="/login/patient" element={<LoginPatient />} />
        <Route path="/signup/doctor" element={<SignDoctor />} />
        <Route path="/login/doctor" element={<LoginDoctor />} />
        <Route path="/signup/partner" element={<SignPartner />} />
        <Route path="/login/partner" element={<LoginPartner />} />
        <Route path="/dashboard/patient" element={<ProtectedRoute element={Dashboard} redirectTo="/login/patient" />} />
        <Route path="/dashboard/patient/viewprofile" element={<ProtectedRoute element={ViewProfile} redirectTo="/login/patient" />} />
        <Route path="/dashboard/patient/eyeexercise" element={<ProtectedRoute element={EyeExercises} redirectTo="/login/patient" />} />
        <Route path="/dashboard/patient/eyeexercise/:exerciseId" element={<ProtectedRoute element={ExerciseDisplay} redirectTo="/login/patient" />} />
        <Route path="/dashboard/patient/blogs" element={<ProtectedRoute element={Blogs} redirectTo="/login/patient" />} />
        <Route path="/dashboard/patient/blogs/:blogId" element={<ProtectedRoute element={BlogDisplay} redirectTo="/login/patient" />} />
        <Route path="/dashboard/patient/aboutus" element={<ProtectedRoute element={AboutUs} redirectTo="/login/patient" />} />
        <Route path="/dashboard/patient/doctors" element={<ProtectedRoute element={Doctors} redirectTo="/login/patient" />} />
        <Route path="/dashboard/patient/doctors/:id" element={<ProtectedRoute element={DoctorProfile} redirectTo="/login/patient" />} />
        <Route path="/dashboard/doctor" element={<ProtectedRoute element={DoctorDashboard} redirectTo="/login/doctor" />} />
        <Route path="/dashboard/doctor/viewprofile" element={<ProtectedRoute element={DoctorViewProfile} redirectTo="/login/doctor" />} />
        <Route path="/dashboard/doctor/viewappointment" element={<ProtectedRoute element={ViewAppointments} redirectTo="/login/doctor" />} />
        <Route path="/dashboard/doctor/blogs" element={<ProtectedRoute element={Blogs} redirectTo="/login/doctor" />} />
        <Route path="/dashboard/doctor/blogs/:blogId" element={<ProtectedRoute element={BlogDisplay} redirectTo="/login/doctor" />} />
        <Route path="/dashboard/partner" element={<ProtectedRoute element={PartnerDashboard} redirectTo="/login/partner" />} />
        <Route path="/dashboard/partner/viewprofile" element={<ProtectedRoute element={PartnerViewProfile} redirectTo="/login/partner" />} />
        <Route path="/dashboard/partner/inventory" element={<ProtectedRoute element={Blogs} redirectTo="/login/partner" />} />
        <Route path="/dashboard/partner/blogs" element={<ProtectedRoute element={Blogs} redirectTo="/login/partner" />} />
        <Route path="/dashboard/partner/blogs/:blogId" element={<ProtectedRoute element={BlogDisplay} redirectTo="/login/partner" />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:blogId" element={<BlogDisplay />} />
        <Route path="/eyeexercise" element={<EyeExercises />} />
        <Route path="/eyeexercise/:exerciseId" element={<ExerciseDisplay />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
