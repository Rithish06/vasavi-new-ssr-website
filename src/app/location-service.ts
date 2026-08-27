import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor() {}

  /**
   * Get user's precise location using browser Geolocation + OpenStreetMap Nominatim reverse geocode
   * Returns a Promise with formatted address and coordinates
   */
  getUserLocation(): Promise<{
    address: string;
    coords: { latitude: number; longitude: number; accuracy: number };
    components: { area: string; city: string; state: string; country: string; pincode: string };
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('❌ Geolocation not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          console.log('📍 Coordinates:', latitude, longitude, 'Accuracy (m):', accuracy);

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();

            const addr = data.address || {};
            const area =
              addr.suburb ||
              addr.village ||
              addr.hamlet ||
              addr.neighbourhood ||
              addr.locality ||
              '';
            const city =
              addr.city || addr.town || addr.municipality || addr.county || '';
            const state = addr.state || '';
            const country = addr.country || '';
            const pincode = addr.postcode || '';

            const formattedAddress = `${area ? area + ', ' : ''}${city ? city + ', ' : ''}${
              state ? state + ', ' : ''
            }${country}${pincode ? ' - ' + pincode : ''}`;

            resolve({
              address: formattedAddress,
              coords: { latitude, longitude, accuracy },
              components: { area, city, state, country, pincode }
            });
          } catch (error) {
            console.error('⚠️ Reverse geocoding failed:', error);
            reject(new Error('Reverse geocoding failed'));
          }
        },
        (err) => {
          console.warn('⚠️ Location error:', err);
          switch (err.code) {
            case err.PERMISSION_DENIED:
              reject(new Error('Please allow location access.'));
              break;
            case err.POSITION_UNAVAILABLE:
              reject(new Error('Location unavailable.'));
              break;
            case err.TIMEOUT:
              reject(new Error('Location request timed out.'));
              break;
            default:
              reject(new Error('Unable to fetch location.'));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        }
      );
    });
  }
}
