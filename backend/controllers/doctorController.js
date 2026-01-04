const axios = require("axios");

exports.findNearbyDoctors = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude required" });
    }

    // Overpass Query (5km radius)
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:5000,${lat},${lng});
        node["amenity"="clinic"](around:5000,${lat},${lng});
        node["healthcare"="doctor"](around:5000,${lat},${lng});
      );
      out body;
    `;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" } }
    );

    const doctors = response.data.elements.map((item) => ({
      name: item.tags?.name || "Unnamed Facility",
      type: item.tags?.amenity || item.tags?.healthcare,
      lat: item.lat,
      lng: item.lon,
      address: item.tags?.["addr:full"] || "Address not available"
    }));

    res.json({ doctors });

  } catch (error) {
    console.error("Doctor search error:", error.message);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};
