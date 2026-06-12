/**
 * Calculates the geodetic distance in meters between two coordinates using the Haversine formula.
 */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Mean Earth radius in meters
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const diffLat = ((lat2 - lat1) * Math.PI) / 180;
  const diffLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) *
    Math.sin(diffLon / 2) * Math.sin(diffLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Checks whether a given student's location is within a classroom geofence boundary.
 */
export function isWithinGeofence(
  studentLat: number,
  studentLon: number,
  classroomLat: number,
  classroomLon: number,
  radiusMeters: number
): boolean {
  const distance = getDistance(studentLat, studentLon, classroomLat, classroomLon);
  return distance <= radiusMeters;
}
