import fetch from "node-fetch";

const OPENCAGE_API_KEY = 'b831a2728a524c00a5c1e031e3862886'; 

export async function geocodeAddress(address) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&countrycode=lk&key=${OPENCAGE_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry;
    return [lng, lat]; // [longitude, latitude]
  } else {
    throw new Error('Address not found');
  }
}
