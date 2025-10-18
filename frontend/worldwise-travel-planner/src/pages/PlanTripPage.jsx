import React, { useState, useEffect, useCallback } from "react"; // Removed useRef
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
const osrmAxios = axios.create(); // Create a new axios instance for OSRM requests

// Fix for default icon issue with Leaflet and Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker component to display markers
function InteractiveMarker({ position, label, color = "blue" }) {
  const map = useMapEvents({}); // Keep useMapEvents to get map instance if needed, but no click handler

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  const customIcon = new L.DivIcon({
    className: `custom-div-icon bg-${color}-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs`,
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${label}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -20],
  });

  return position ? (
    <Marker position={position} icon={customIcon}>
      <Popup>
        {label}: {position[0].toFixed(4)}, {position[1].toFixed(4)} {/* Corrected access to lat/lng */}
      </Popup>
    </Marker>
  ) : null;
}

// LocationMarker component to handle map clicks for setting points
function LocationMarker({ onLocationSelect, activeSelection }) {
  const map = useMapEvents({
    click(e) {
      if (activeSelection) { // Only trigger if an active selection mode is set
        onLocationSelect(e.latlng, activeSelection);
      }
    },
  });

  return null; // This component doesn't render anything visible, just handles map events
}

export default function PlanTripPage() {
  const [tripName, setTripName] = useState("");
  const [startPoint, setStartPoint] = useState({ address: "", coords: null });
  const [endPoint, setEndPoint] = useState({ address: "", coords: null });
  const [stops, setStops] = useState([]); // Array of { address, coords }
  const [currentStopInput, setCurrentStopInput] = useState(""); // For adding new stops
  const [tripStartDate, setTripStartDate] = useState(""); // For overall trip start date
  const [tripNotes, setTripNotes] = useState(""); // For overall trip notes
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center (London)
  const [zoom, setZoom] = useState(6);
  const [route, setRoute] = useState(null); // Stores route geometry
  const [activeSelection, setActiveSelection] = useState(null); // 'start', 'end', 'stop'

  // Geocoding function
  const geocodeAddress = useCallback(async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return [parseFloat(lat), parseFloat(lon)];
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
    }
    return null;
  }, []);

  // Reverse geocoding function
  const reverseGeocode = useCallback(async (latlng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
      );
      if (response.data && response.data.display_name) {
        return response.data.display_name;
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
    }
    return `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`;
  }, []);

  // Handle map click for setting points
  const handleMapLocationSelect = useCallback(
    async (latlng) => { // Removed 'type' parameter
      const address = await reverseGeocode(latlng);
      const coords = [latlng.lat, latlng.lng];

      if (activeSelection === "start") {
        setStartPoint({ address, coords });
      } else if (activeSelection === "end") {
        setEndPoint({ address, coords });
      } else if (activeSelection === "stop") {
        setStops((prev) => [...prev, { address, coords }]);
      }
      setMapCenter(coords);
      setActiveSelection(null); // Reset active selection after click
    },
    [activeSelection, reverseGeocode]
  );

  // Handle input changes for start/end points
  const handlePointInputChange = useCallback(
    async (e, setPointState) => {
      const address = e.target.value;
      setPointState((prev) => ({ ...prev, address }));
      if (address.length > 3) {
        const coords = await geocodeAddress(address);
        if (coords) {
          setPointState((prev) => ({ ...prev, coords }));
          setMapCenter(coords);
        } else {
          setPointState((prev) => ({ ...prev, coords: null }));
        }
      } else {
        setPointState((prev) => ({ ...prev, coords: null }));
      }
    },
    [geocodeAddress]
  );

  // Handle adding a new stop from input
  const handleAddStop = async () => {
    if (currentStopInput.trim() === "") return;
    const coords = await geocodeAddress(currentStopInput);
    if (coords) {
      setStops((prev) => [...prev, { address: currentStopInput, coords }]);
      setCurrentStopInput("");
      setMapCenter(coords);
    } else {
      alert("Could not find coordinates for the entered stop.");
    }
  };

  // Function to fetch route from OSRM
  const fetchRoute = useCallback(async () => {
    if (!startPoint.coords || !endPoint.coords) {
      setRoute(null);
      return;
    }

    const waypoints = [
      startPoint.coords,
      ...stops.map((s) => s.coords),
      endPoint.coords,
    ].filter(Boolean); // Filter out any null coordinates

    if (waypoints.length < 2) {
      setRoute(null);
      return;
    }

    const coordinates = waypoints.map((c) => `${c[1]},${c[0]}`).join(";");
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

    try {
      // Use the dedicated osrmAxios instance to avoid sending Authorization header
      const response = await osrmAxios.get(osrmUrl);
      if (
        response.data &&
        response.data.routes &&
        response.data.routes.length > 0
      ) {
        setRoute(
          response.data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]])
        );
      } else {
        setRoute(null);
        alert("Could not find a route for the given points.");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      setRoute(null);
      alert("Error fetching route. Please try again.");
    }
  }, [startPoint.coords, endPoint.coords, stops]);

  // Effect to fetch route whenever points change
  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);

  // Effect to update map center if startPoint or endPoint coords change
  useEffect(() => {
    if (startPoint.coords) setMapCenter(startPoint.coords);
    else if (endPoint.coords) setMapCenter(endPoint.coords);
  }, [startPoint.coords, endPoint.coords]);

  // Modern map tile provider
  const modernTileUrl =
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";
  const modernAttribution =
    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

  return (
    <div className="flex h-full">
      {/* Form Section */}
      <div className="w-1/2 p-6 bg-white shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Plan Your Trip</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label
              htmlFor="tripName"
              className="block text-sm font-medium text-gray-700"
            >
              Trip Name
            </label>
            <input
              type="text"
              id="tripName"
              name="tripName"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="e.g., Florida Road Trip"
            />
          </div>

          <div>
            <label
              htmlFor="startPoint"
              className="block text-sm font-medium text-gray-700"
            >
              Starting Point
            </label>
            <input
              type="text"
              id="startPoint"
              name="startPoint"
              value={startPoint.address}
              onChange={(e) => handlePointInputChange(e, setStartPoint)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter start location or click on map"
            />
            <button
              type="button"
              onClick={() => setActiveSelection("start")}
              className="mt-1 text-xs text-blue-600 hover:underline"
            >
              Select on Map
            </button>
          </div>

          <div>
            <label
              htmlFor="endPoint"
              className="block text-sm font-medium text-gray-700"
            >
              Ending Point
            </label>
            <input
              type="text"
              id="endPoint"
              name="endPoint"
              value={endPoint.address}
              onChange={(e) => handlePointInputChange(e, setEndPoint)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter end location or click on map"
            />
            <button
              type="button"
              onClick={() => setActiveSelection("end")}
              className="mt-1 text-xs text-blue-600 hover:underline"
            >
              Select on Map
            </button>
          </div>

          <div className="border-t pt-4 mt-4">
            <label
              htmlFor="addStop"
              className="block text-sm font-medium text-gray-700"
            >
              Add Stop
            </label>
            <div className="flex space-x-2 mt-1">
              <input
                type="text"
                id="addStop"
                name="addStop"
                value={currentStopInput}
                onChange={(e) => setCurrentStopInput(e.target.value)}
                className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter stop location"
              />
              <button
                type="button"
                onClick={handleAddStop}
                className="px-3 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setActiveSelection("stop")}
                className="px-3 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                Map
              </button>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {stops.map((stop, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                >
                  <span>
                    Stop {index + 1}: {stop.address}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setStops(stops.filter((_, i) => i !== index))
                    }
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 mt-4">
            <label
              htmlFor="tripStartDate"
              className="block text-sm font-medium text-gray-700"
            >
              Trip Start Date
            </label>
            <input
              type="date"
              id="tripStartDate"
              name="tripStartDate"
              value={tripStartDate}
              onChange={(e) => setTripStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="tripNotes"
              className="block text-sm font-medium text-gray-700"
            >
              Trip Notes
            </label>
            <textarea
              id="tripNotes"
              name="tripNotes"
              rows="3"
              value={tripNotes}
              onChange={(e) => setTripNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Add any overall trip notes"
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Save Trip
          </button>
        </form>
      </div>

      {/* Map Section */}
      <div className="w-1/2">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer attribution={modernAttribution} url={modernTileUrl} />
          {startPoint.coords && (
            <InteractiveMarker
              position={startPoint.coords}
              label="A"
              color="red"
            />
          )}
          {endPoint.coords && (
            <InteractiveMarker
              position={endPoint.coords}
              label="B"
              color="green"
            />
          )}
          {stops.map((stop, index) => (
            <InteractiveMarker
              key={index}
              position={stop.coords}
              label={String.fromCharCode(67 + index)}
              color="orange"
            />
          ))}
          {route && <Polyline positions={route} color="blue" weight={5} />}
          {/* LocationMarker handles map clicks for setting start, end, or stops */}
          <LocationMarker
            onLocationSelect={handleMapLocationSelect}
            activeSelection={activeSelection}
          />
        </MapContainer>
      </div>
    </div>
  );
}
