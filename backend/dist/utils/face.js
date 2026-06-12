"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEuclideanDistance = getEuclideanDistance;
exports.verifyFaceEmbeddings = verifyFaceEmbeddings;
/**
 * Calculates the Euclidean distance between two 128-dimensional biometric face vectors.
 */
function getEuclideanDistance(vec1, vec2) {
    if (vec1.length !== vec2.length) {
        throw new Error('Embedding vector sizes must match.');
    }
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
        sum += Math.pow(vec1[i] - vec2[i], 2);
    }
    return Math.sqrt(sum);
}
/**
 * Compares two face embeddings to check if they match the same identity.
 * Default threshold is 0.6 (lower distance means higher match probability).
 */
function verifyFaceEmbeddings(embedding1, embedding2, threshold = 0.6) {
    try {
        const distance = getEuclideanDistance(embedding1, embedding2);
        return {
            success: distance <= threshold,
            distance
        };
    }
    catch (error) {
        return {
            success: false,
            distance: 999
        };
    }
}
