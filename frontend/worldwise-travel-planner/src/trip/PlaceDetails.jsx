// import { useState } from "react";

// export default function PlaceDetails() {
//   const [placeName, setPlaceName] = useState("");
//   const [Category, setCategory] = useState("");
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [notes, setNotes] = useState("");
//   const [estimatedCost, setEstimatedCost] = useState("");
//   const [visitedDate, setVisitedDate] = useState("");
//   const [photos, setPhotos] = useState("");

//   function handleSubmit(e) {
//     e.preventDefault();
//     const payload = new FormData(e.target);
//     console.log(payload);
//   }
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <p>Enter Place Details</p>
//         <label>
//           <span>Place name</span>
//           <input type="text" name="placeName" />
//         </label>
//         <label>
//           <span>Category</span>
//           <select>
//             <option>Food</option>
//             <option>Hotel</option>
//             <option>Temple</option>
//             <option>Shopping</option>
//             <option>Emergency</option>
//             <option>Park</option>
//             <option>Museum</option>
//             <option>others</option>
//           </select>
//         </label>
//         <label>
//           <span>Latitude</span>
//           <input type="text" name="latitude" />
//         </label>
//         <label>
//           <span>Longitude</span>
//           <input type="text" name="longitude" />
//         </label>
//         <label>
//           <span>State</span>
//           <input type="text" name="state" />
//         </label>
//         <label>
//           <span>City</span>
//           <input type="text" name="city" />
//         </label>
//         <label>
//           <span>Notes</span>
//           <input type="text" name="notes" />
//         </label>
//         <label>
//           <span>Estimated cost </span>
//           <input type="number" name="estimatedCost" />
//         </label>
//         <label>
//           <span>Visited date</span>
//           <input type="datetime-local" name="visitedDate" />
//         </label>
//         <label>
//           <span>Photos</span>
//           <input type="file" name="photos" />
//         </label>

//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }
import { useState } from "react";

export default function PlaceDetails() {
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    // cast/cleanup
    const payload = {
      placeName: (data.placeName || "").toString().trim(),
      category: (data.category || "Other").toString(),
      lat: Number(data.latitude),
      lng: Number(data.longitude),
      state: (data.state || "").toString().trim(),
      city: (data.city || "").toString().trim(),
      notes: (data.notes || "").toString().trim(),
      estimatedCost: data.estimatedCost
        ? Number(data.estimatedCost)
        : undefined,
      visitedDate: data.visitedDate || undefined,
      photos: form.getAll("photos"), // FileList → array of File
    };

    console.log("PLACE DETAILS ->", {
      ...payload,
      photos: payload.photos.map((f) => f.name),
    });
    setTimeout(() => setLoading(false), 500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
        {/* Gradient step header */}
        <div className="relative bg-gradient-to-r from-amber-500 via-fuchsia-500 to-sky-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Add Place Details</h1>
          <p className="mt-1 text-white/90">
            Describe a stop on your trip—category, coordinates, highlights, and
            more.
          </p>
          <div className="absolute inset-x-0 -bottom-5 flex justify-center">
            <div className="h-10 w-56 rounded-full bg-white/20 backdrop-blur-md" />
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 grid gap-6 bg-white/70 px-6 pb-8 pt-10 backdrop-blur dark:bg-white/10"
          noValidate
        >
          {/* Row: name + category */}
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <label className="block">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Place name*
              </span>
              <input
                name="placeName"
                type="text"
                required
                minLength={2}
                placeholder="Café du Monde"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Category*
              </span>
              <select
                name="category"
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <option>Food</option>
                <option>Hotel</option>
                <option>Temple</option>
                <option>Shopping</option>
                <option>Emergency</option>
                <option>Park</option>
                <option>Museum</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          {/* Row: coordinates */}
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Latitude* (−90…90)
              </span>
              <input
                name="latitude"
                type="number"
                required
                step="0.000001"
                min={-90}
                max={90}
                placeholder="29.957"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Longitude* (−180…180)
              </span>
              <input
                name="longitude"
                type="number"
                required
                step="0.000001"
                min={-180}
                max={180}
                placeholder="-90.062"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>
          </div>

          {/* Row: region */}
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                State
              </span>
              <input
                name="state"
                type="text"
                placeholder="Louisiana"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                City
              </span>
              <input
                name="city"
                type="text"
                placeholder="New Orleans"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>
          </div>

          {/* Notes */}
          <label className="block">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Notes
            </span>
            <textarea
              name="notes"
              rows={3}
              placeholder="Open late. Try the classic beignets."
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </label>

          {/* Row: cost + visited date */}
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Estimated cost (USD)
              </span>
              <input
                name="estimatedCost"
                type="number"
                min={0}
                step="1"
                placeholder="15"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-2 00">
                Visited date
              </span>
              <input
                name="visitedDate"
                type="date"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </label>
          </div>

          {/* Photos (dropzone style) */}
          <label className="block">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Photos
            </span>
            <div className="mt-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 px-4 py-6 text-center text-sm text-slate-600 transition hover:border-sky-400 hover:bg-sky-50/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-sky-400/60">
              <input
                name="photos"
                type="file"
                accept="image/*"
                multiple
                className="mx-auto block cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-slate-700"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Upload up to 5 images (JPG/PNG/WebP)
              </p>
            </div>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save place"}
          </button>
        </form>
      </div>
    </div>
  );
}
