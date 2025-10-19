import { Routes, Route, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Features from "./components/Features";
import AboutUs from "./pages/AboutUs";
import PlaceDetails from "./trip/PlaceDetails";
import Dashboard from "./pages/Dashboard";
import PlanTripPage from "./pages/PlanTripPage";
import UpcomingTripsPage from "./pages/UpcomingTripsPage";
import YourTripsPage from "./pages/YourTripsPage";
import ShareTripPage from "./pages/ShareTripPage";
import TripMemoriesPage from "./pages/TripMemoriesPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route
          path="/features"
          element={
            <ProtectedRoute>
              <Features />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<AboutUs />}>
          <Route path="placeDetails" element={<PlaceDetails />} />
        </Route>
        <Route
          path="/addTrip"
          element={
            <ProtectedRoute>
              <Features />
            </ProtectedRoute>
          }
        />
        <Route
          path="/publishTrip"
          element={
            <ProtectedRoute>
              <Features />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/about/PlaceDetails" element={<PlaceDetails />} /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="plan-trip" element={<PlanTripPage />} />
          <Route path="upcoming-trips" element={<UpcomingTripsPage />} />
          <Route path="your-trips" element={<YourTripsPage />} />
          <Route path="share-trip/:tripId" element={<ShareTripPage />} />
          <Route path="trip-memories/:tripId" element={<TripMemoriesPage />} />
          <Route index element={<p className="text-gray-600">Select an option from the sidebar to get started.</p>} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
