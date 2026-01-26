/**
 * UUID v7 Generator
 * 
 * UUID v7 is a time-ordered UUID that includes:
 * - 48 bits: Unix timestamp in milliseconds
 * - 12 bits: Version (7) and variant bits
 * - 62 bits: Random data
 * 
 * Format: xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx
 */

/**
 * Generate a UUID v7
 * 
 * UUID v7 layout (128 bits total):
 * - Bits 0-47: Unix timestamp in milliseconds (48 bits)
 * - Bits 48-51: Version (4 bits) = 0x7
 * - Bits 52-63: Random (12 bits)
 * - Bits 64-65: Variant (2 bits) = 0x2
 * - Bits 66-127: Random (62 bits)
 * 
 * @param timestamp Optional Unix timestamp in milliseconds. If not provided, uses current time.
 * @returns A UUID v7 string
 */
export function generateUUIDv7(timestamp?: number): string {
  const ts = timestamp ?? Date.now();
  
  // Get timestamp as 48-bit value
  const timestampMs = BigInt(ts);
  
  // Generate 16 random bytes (128 bits)
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  
  // Build UUID byte by byte:
  // Bytes 0-5: timestamp (48 bits)
  // Byte 6: version (4 bits) + random (4 bits)
  // Byte 7: random (8 bits)
  // Byte 8: variant (2 bits) + random (6 bits)
  // Bytes 9-15: random (56 bits)
  
  const uuidBytes = new Uint8Array(16);
  
  // Set timestamp (bytes 0-5, 48 bits)
  for (let i = 0; i < 6; i++) {
    uuidBytes[5 - i] = Number((timestampMs >> BigInt(i * 8)) & BigInt(0xFF));
  }
  
  // Set version and random (byte 6)
  // High nibble = version 7, low nibble = random
  uuidBytes[6] = (0x70 | (randomBytes[6]! & 0x0F));
  
  // Set random (byte 7)
  uuidBytes[7] = randomBytes[7]!;
  
  // Set variant and random (byte 8)
  // Top 2 bits = variant (10 binary = 0x80-0xBF), remaining 6 bits = random
  uuidBytes[8] = (0x80 | (randomBytes[8]! & 0x3F));
  
  // Set remaining random bytes (bytes 9-15)
  for (let i = 9; i < 16; i++) {
    uuidBytes[i] = randomBytes[i]!;
  }
  
  // Convert to hex string
  const hex = Array.from(uuidBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Format as UUID: xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32)
  ].join('-');
}

/**
 * Parse a UUID v7 to extract the timestamp
 * 
 * @param uuid UUID v7 string
 * @returns Unix timestamp in milliseconds, or null if invalid
 */
export function parseUUIDv7Timestamp(uuid: string): number | null {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      return null;
    }
    
    // Remove hyphens and convert to hex string
    const hex = uuid.replace(/-/g, '');
    
    // Parse as BigInt to handle 128 bits
    const uuidBits = BigInt('0x' + hex);
    
    // Extract timestamp from bits 0-47 (top 48 bits after shifting)
    // The timestamp is in the first 12 hex characters (48 bits)
    const timestamp = Number((uuidBits >> BigInt(80)) & BigInt(0xFFFFFFFFFFFF));
    
    return timestamp;
  } catch {
    return null;
  }
}

/**
 * Validate if a string is a valid UUID v7
 * 
 * @param uuid String to validate
 * @returns true if valid UUID v7, false otherwise
 */
export function isValidUUIDv7(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Format UUID for display (with optional line breaks)
 * 
 * @param uuid UUID string
 * @param format Format style: 'standard', 'uppercase', 'no-hyphens'
 * @returns Formatted UUID string
 */
export function formatUUID(uuid: string, format: 'standard' | 'uppercase' | 'no-hyphens' = 'standard'): string {
  switch (format) {
    case 'uppercase':
      return uuid.toUpperCase();
    case 'no-hyphens':
      return uuid.replace(/-/g, '');
    default:
      return uuid.toLowerCase();
  }
}
