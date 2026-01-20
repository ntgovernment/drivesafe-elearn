# DriveSafe E-Learning Module Loader

A distributable JavaScript and CSS package for the DriveSafe Remote Driver Education and Licensing Program.

## Project Structure

```
drivesafe-elearn/
├── src/              # Source files
│   ├── drivesafe.js  # Main module loader
│   ├── drivesafe.css # Scoped styles
│   ├── demo.html     # Demo page
│   └── sw.js         # Service worker
├── dist/             # Built distribution files
├── build.js          # Build script
├── package.json      # NPM package configuration
└── README.md         # This file
```

## Features

- **CDN-based JSZip**: References JSZip from CDN instead of bundling
- **Scoped CSS**: All styles prefixed with `.drivesafe-*` to avoid conflicts
- **Auto-initialization**: Automatically loads on DOMContentLoaded
- **Service Worker Support**: Configurable offline caching via `data-service-worker` attribute
- **Cache-first Strategy**: Loads modules from cache when available

## Installation

```bash
npm install
```

## Usage

### Build

Build the distributable files from `src/` to `dist/`:

```bash
npm run build
```

### Development Server

Run a local development server (serves current directory on port 8080):

```bash
npm run dev
```

### Production Server

Serve only the `dist/` folder (after building):

```bash
npm run serve
```

## Integration

Include in any HTML page with a `<div id="content"></div>`:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="drivesafe.css">
</head>
<body>
  <div id="content"></div>
  
  <!-- JSZip from CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  
  <!-- DriveSafe Module Loader (optional service worker) -->
  <script src="drivesafe.js" data-service-worker="sw.js"></script>
</body>
</html>
```

## Configuration

### Service Worker

The service worker is optional. To enable it, add the `data-service-worker` attribute:

```html
<script src="drivesafe.js" data-service-worker="sw.js"></script>
```

To disable, omit the attribute:

```html
<script src="drivesafe.js"></script>
```

## Module Sources

- ZIP files: `https://roadsafety.nt.gov.au/_media/elearning/`
- Images: `https://roadsafety.nt.gov.au/_media/elearning/images/`

## License

MIT
