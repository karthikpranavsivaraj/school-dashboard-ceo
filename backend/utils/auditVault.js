const crypto = require('crypto');

/**
 * Audit Infinity Vault
 * Provides cryptographic hashing and verification for institutional reports.
 */

/**
 * Generates a SHA-256 fingerprint for a report buffer.
 * @param {Buffer} buffer - The report file buffer.
 * @returns {string} - The hex fingerprint.
 */
function generateSignature(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase();
}

/**
 * Creates a unique "Secure Stamp" string including the fingerprint and a timestamp.
 */
function createSecureStamp(buffer) {
    const signature = generateSignature(buffer);
    const shortSig = signature.substring(0, 12);
    const timestamp = new Date().toISOString();
    return `SECURE_STAMP:${shortSig}:${timestamp}`;
}

module.exports = {
    generateSignature,
    createSecureStamp
};
