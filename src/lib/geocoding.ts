export interface GeocodingResult {
  city: string;
  ward: string;
  fullAddress: string;
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'JackMeicho/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address data');
    }

    const data = await response.json();
    const address = data.address;

    // Extract city and ward information
    let city = address.city || address.town || address.village || '';
    let ward = address.suburb || address.neighbourhood || '';

    // Special handling for Tokyo
    if (address.state === 'Tokyo') {
      city = 'Tokyo';
      ward = address.city_district || address.suburb || '';
    }

    return {
      city,
      ward,
      fullAddress: data.display_name
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw error;
  }
} 