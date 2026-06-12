"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistance = getDistance;
exports.isWithinGeofence = isWithinGeofence;
/**
 * Calculates the geodetic distance in meters between two coordinates using the Haversine formula.
 */
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Mean Earth radius in meters
    const radLat1 = (lat1 * Math.PI) / 180;
    const radLat2 = (lat2 * Math.PI) / 180;
    const diffLat = ((lat2 - lat1) * Math.PI) / 180;
    const diffLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) *
            Math.sin(diffLon / 2) * Math.sin(diffLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
/**
 * Checks whether a given student's location is within a classroom geofence boundary.
 */
function isWithinGeofence(studentLat, studentLon, classroomLat, classroomLon, radiusMeters) {
    const distance = getDistance(studentLat, studentLon, classroomLat, classroomLon);
    return distance <= radiusMeters;
}
