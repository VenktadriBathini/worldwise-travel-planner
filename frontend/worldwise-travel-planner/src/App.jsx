import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Features from "./components/Features";
import AboutUs from "./pages/AboutUs";
import PlaceDetails from "./trip/PlaceDetails";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<AboutUs />}>
          <Route path="placeDetails" element={<PlaceDetails />} />
        </Route>
        <Route path="/addTrip" element={<Features />} />
        <Route path="/publishTrip" element={<Features />} />
        {/* <Route path="/about/PlaceDetails" element={<PlaceDetails />} /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
