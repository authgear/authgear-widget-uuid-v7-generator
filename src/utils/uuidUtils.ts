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

/** UUID v7 field for Inspector */
export interface UUIDv7Field {
  id: string;
  name: string;
  bits: number;
  /** Hex substring (no hyphens) for this field */
  hex: string;
  /** Binary representation */
  binary: string;
  /** Ranges [start, end] in hyphenated UUID string (end exclusive) for highlighting */
  ranges: [number, number][];
}

/** Hex index → UUID string index. UUID format: xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx */
const HEX_TO_UUID_SEGMENTS: { hStart: number; hEnd: number; uStart: number; uEnd: number }[] = [
  { hStart: 0, hEnd: 8, uStart: 0, uEnd: 8 },
  { hStart: 8, hEnd: 12, uStart: 9, uEnd: 13 },
  { hStart: 12, hEnd: 16, uStart: 14, uEnd: 18 },
  { hStart: 16, hEnd: 20, uStart: 19, uEnd: 23 },
  { hStart: 20, hEnd: 32, uStart: 24, uEnd: 36 },
];

function hexRangeToUUIDRanges(hexStart: number, hexEnd: number): [number, number][] {
  const ranges: [number, number][] = [];
  let i = hexStart;
  while (i < hexEnd) {
    const seg = HEX_TO_UUID_SEGMENTS.find((s) => i >= s.hStart && i < s.hEnd);
    if (!seg) break;
    const j = Math.min(hexEnd, seg.hEnd);
    const uStart = seg.uStart + (i - seg.hStart);
    const uEnd = seg.uEnd - (seg.hEnd - j);
    ranges.push([uStart, uEnd]);
    i = j;
  }
  return ranges;
}

/**
 * Parse UUID v7 into RFC 9562 / 4122 fields for Inspector.
 * Layout: 48b timestamp | 4b version | 12b rand | 2b variant | 62b random
 */
export function getUUIDv7Fields(uuid: string): UUIDv7Field[] | null {
  const normalized = uuid.replace(/-/g, '').toLowerCase();
  if (normalized.length !== 32) return null;
  const re = /^[0-9a-f]{8}[0-9a-f]{4}7[0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12}$/;
  if (!re.test(normalized)) return null;

  const hexToBinary = (hex: string) =>
    hex.split('').map((c) => parseInt(c, 16).toString(2).padStart(4, '0')).join('');

  const tsHex = normalized.substring(0, 12);
  const verHex = normalized.substring(12, 13);
  const rand12Hex = normalized.substring(13, 16);
  const varHex = normalized.substring(16, 17);
  const rand62Hex = normalized.substring(17, 32); // 15 hex = 60 bits; 2 bits from var nibble

  const variantBits = (parseInt(varHex, 16) >> 2) & 0x3;
  const variantBinary = variantBits.toString(2).padStart(2, '0');
  const rand62LowBits = (parseInt(varHex, 16) >> 0) & 0x3;
  const rand62Bin = rand62LowBits.toString(2).padStart(2, '0') + hexToBinary(rand62Hex);

  const fields: UUIDv7Field[] = [
    {
      id: 'timestamp',
      name: 'Unix timestamp (ms)',
      bits: 48,
      hex: tsHex,
      binary: hexToBinary(tsHex),
      ranges: hexRangeToUUIDRanges(0, 12),
    },
    {
      id: 'version',
      name: 'Version (v7)',
      bits: 4,
      hex: verHex,
      binary: hexToBinary(verHex),
      ranges: hexRangeToUUIDRanges(12, 13),
    },
    {
      id: 'rand_after_version',
      name: 'Random / sequence (12 bits)',
      bits: 12,
      hex: rand12Hex,
      binary: hexToBinary(rand12Hex),
      ranges: hexRangeToUUIDRanges(13, 16),
    },
    {
      id: 'variant',
      name: 'Variant (RFC 4122)',
      bits: 2,
      hex: variantBits.toString(16),
      binary: variantBinary,
      ranges: hexRangeToUUIDRanges(16, 17),
    },
    {
      id: 'rand_remaining',
      name: 'Random (62 bits)',
      bits: 62,
      hex: rand62Hex,
      binary: rand62Bin,
      ranges: hexRangeToUUIDRanges(16, 32),
    },
  ];

  return fields;
}
