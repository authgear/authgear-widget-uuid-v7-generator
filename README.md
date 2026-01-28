# UUID v7 Generator

A web-based tool for generating UUID v7 (time-ordered UUIDs) and extracting timestamps. It provides a simple interface to generate one or multiple UUID v7 identifiers and to decode timestamps from existing UUID v7 values.

## Features

- **UUID v7 Generator**: Generate time-ordered UUIDs that are lexicographically sortable
- **Batch generation**: Generate 1–10 UUIDs at once via dropdown
- **Custom timestamps**: Use “Now” or set a custom time (datetime picker, ISO 8601, or Unix ms)
- **UUID v7 Inspector**: Expand any generated UUID to see its fields (timestamp, version, random bits, etc.) and highlight ranges in the string
- **Timestamp extraction tool**: Paste a UUID v7 and get ISO datetime, Unix ms, and Unix seconds (with copy buttons)
- **Copy**: Copy a single UUID or all generated UUIDs to the clipboard
- **Pagination**: When more than 5 UUIDs are generated, pagination (e.g. Page 1, 2) is shown

## About UUID v7

UUID v7 is a time-ordered UUID format that includes:

- **48 bits**: Unix timestamp in milliseconds
- **4 bits**: Version identifier (0x7)
- **12 bits**: Random / sequence
- **2 bits**: Variant identifier (0x2)
- **62 bits**: Random

UUIDs generated at different times sort correctly; random bits keep them unique even when generated at the same millisecond. The format is 8-4-4-4-12 hex digits (e.g. `xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx`).

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the app** (pick one):
   | Command           | URL                     | Use case                          |
   |-------------------|-------------------------|-----------------------------------|
   | `npm run dev`     | http://localhost:3000   | **Development** (hot reload)      |
   | `npm start`       | http://localhost:4173   | Preview production build          |
   | `npm run run`     | http://127.0.0.1:8765   | Simple Node server (no Vite)      |
   | `npm run open`    | file opens in browser   | Open built `dist/index.html`      |

3. **Build for production**
   ```bash
   npm run build
   ```

### Running the dev server (localhost:3000)

From your own terminal (Cursor’s **View → Terminal** or macOS **Terminal.app**):

```bash
cd /path/to/uuid-v7-generator
npm run dev
```

Then open **http://localhost:3000** in your browser. The dev server uses port 3000 by default; if it’s in use, Vite will try 3001, 3002, etc. and print the actual URL.

## Usage

1. **UUID V7 Generator tab**
   - Choose how many UUIDs to generate (1–10).
   - Pick **Timestamp mode**: “Now” or “Set a time” (then use datetime picker, ISO datetime, or Unix timestamp).
   - Click **Generate UUIDs**.
   - Click a UUID to expand the inspector; use **Copy** on a row or **Copy All** for the whole list.
   - If there are more than 5 UUIDs, use the page controls to move between pages.

2. **Timestamp extraction tool tab**
   - Paste a UUID v7 string.
   - The tool shows whether it’s valid and, if so, the extracted ISO datetime, Unix ms, and Unix seconds, each with a copy button.

## If you see “Connection failed”

If you open the app URL and the browser shows “Connection failed”, the server likely isn’t running in a context your browser can reach.

- **Recommended**: Run the app via the **run.command** launcher so the server runs in macOS Terminal (not only in Cursor’s terminal):
  1. In **Finder**, open the project folder and double‑click **run.command**.
  2. If macOS blocks it, right‑click **run.command** → **Open** → **Open**.
  3. Wait until the window says the app is running, then open **http://127.0.0.1:8765** in your browser (it may open automatically).
  4. Keep that Terminal window open while you use the app.

- **Alternatively**: In **Terminal.app** (not Cursor’s terminal), run:
  ```bash
  cd /path/to/uuid-v7-generator
  npm run run
  ```
  Then open **http://127.0.0.1:8765**.

See **IF-CONNECTION-FAILED.txt** in the project root for the same steps.

## Scripts

| Script           | Description                                  |
|------------------|----------------------------------------------|
| `npm run dev`    | Start Vite dev server (default port 3000)    |
| `npm run build`  | Type-check and build for production          |
| `npm run preview`| Serve production build (default port 4173)   |
| `npm start`      | Build and run Vite preview                   |
| `npm run run`    | Build and serve with Node script (port 8765) |
| `npm run open`   | Build and open `dist/index.html` in browser  |
| `npm run type-check` | Run TypeScript type-check only           |

## Technologies

- React 18
- TypeScript
- Vite 7
- Web Crypto API (for random values)

## UUID v7 specification

This implementation follows the UUID v7 draft specification, with time-ordered 48-bit millisecond timestamps and random bits for uniqueness and compatibility with the standard UUID representation.

## License

MIT
