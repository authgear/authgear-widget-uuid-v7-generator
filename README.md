# UUID v7 Generator

A web-based tool for generating UUID v7 (time-ordered UUIDs). This widget provides a simple interface to generate one or multiple UUID v7 identifiers with customizable options.

## 🌐 Features

- **UUID v7 Generation**: Generate time-ordered UUIDs that are lexicographically sortable
- **Batch Generation**: Generate multiple UUIDs at once (1-1000)
- **Custom Timestamps**: Optionally use a custom Unix timestamp for all generated UUIDs
- **Multiple Formats**: Output in standard, uppercase, or no-hyphens format
- **Timestamp Extraction**: View the embedded timestamp from generated UUIDs
- **Copy to Clipboard**: Easy copying of individual or all generated UUIDs

## About UUID v7

UUID v7 is a time-ordered UUID format that includes:

- **48 bits**: Unix timestamp in milliseconds
- **4 bits**: Version identifier (0x7)
- **12 bits**: Random data
- **2 bits**: Variant identifier (0x2)
- **62 bits**: Random data

This design ensures that UUIDs generated at the same time (or with the same timestamp) will be lexicographically sortable, making them ideal for use as database primary keys or in distributed systems where time-ordering is important.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Usage

1. Open the application in your browser
2. Select the number of UUIDs to generate (1-1000)
3. Optionally enable custom timestamp and enter a Unix timestamp in milliseconds
4. Choose output format (standard, uppercase, or no-hyphens)
5. Click "Generate UUIDs" to create the UUIDs
6. Copy individual UUIDs or all UUIDs at once using the copy buttons

## Technologies

- React 18
- TypeScript
- Vite
- Web Crypto API (for random number generation)

## Development

```bash
npm run type-check  # Type checking
npm run preview     # Preview production build
```

## UUID v7 Specification

This implementation follows the UUID v7 draft specification. The UUID format ensures:

- **Time-ordering**: UUIDs generated at different times will sort correctly
- **Uniqueness**: Random components ensure uniqueness even for UUIDs generated at the same timestamp
- **Compatibility**: Follows standard UUID format (8-4-4-4-12 hex digits)

## License

MIT
