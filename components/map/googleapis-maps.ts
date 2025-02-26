export type PointOfInterestData = {
  business_status: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  photos: {
    height: number;
    html_attributions: string[];
    photo_reference: string;
    width: number;
  }[];
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  rating: number;
  reference: string;
  types: string[];
  user_ratings_total: number;
  opening_hours?: { open_now: boolean };
};

export type GooglePlacesResponse = {
  html_attributions: string[];
  next_page_token: string;
  results: PointOfInterestData[];
  status: "OK";
};

// Function to fetch points of interest for a given city
export async function getPlacesInfo(
  city: string
): Promise<GooglePlacesResponse["results"]> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    city
  )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching points of interest:", error);
    return [];
  }
}
