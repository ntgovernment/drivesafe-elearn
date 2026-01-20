/**
 * DriveSafe E-Learning Module Loader
 * References JSZip from CDN (loaded via demo.html)
 */
(function () {
  "use strict";

  const DriveSafe = {
    // Store the base path for the application
    basePath: "",

    /**
     * Initialize the DriveSafe application
     */
    init: function () {
      // Detect base path from current script location
      const scriptTag = document.currentScript;

      // Check for explicit base path configuration first
      const configuredBasePath = scriptTag?.getAttribute("data-base-path");
      if (configuredBasePath) {
        this.basePath = configuredBasePath.endsWith("/")
          ? configuredBasePath
          : configuredBasePath + "/";
        console.log("[DriveSafe] Using configured basePath:", this.basePath);
      } else if (scriptTag && scriptTag.src) {
        const url = new URL(scriptTag.src);
        this.basePath = url.pathname.substring(
          0,
          url.pathname.lastIndexOf("/") + 1,
        );
        console.log(
          "[DriveSafe] Detected basePath from script:",
          this.basePath,
        );
      } else {
        // Fallback: use current page path
        this.basePath = window.location.pathname.substring(
          0,
          window.location.pathname.lastIndexOf("/") + 1,
        );
        console.log("[DriveSafe] Detected basePath from page:", this.basePath);
      }

      // Create loading overlay
      this.createLoadingOverlay();

      // Register service worker if configured
      const swPath = scriptTag?.getAttribute("data-service-worker");
      if (swPath && "serviceWorker" in navigator) {
        // Register service worker with the correct scope
        navigator.serviceWorker.register(swPath, { scope: this.basePath });
      }

      // Generate content
      this.generateContent();
    },

    /**
     * Create the loading overlay element
     */
    createLoadingOverlay: function () {
      const overlay = document.createElement("div");
      overlay.id = "drivesafeLoadingOverlay";
      overlay.className = "drivesafe-loading-overlay";
      overlay.innerHTML = `
        <div class="drivesafe-spinner"></div>
        <span id="drivesafeLoadingText" class="drivesafe-loading-text">Preparing Module...</span>
      `;
      document.body.appendChild(overlay);
    },

    /**
     * Generate the main content HTML
     */
    generateContent: function () {
      const content = document.getElementById("content");
      if (!content) {
        console.error("DriveSafe: #content element not found");
        return;
      }

      content.innerHTML = `
        <div class="drivesafe-wrapper">
          <div class="drivesafe-container">
            <div class="drivesafe-header">
              <img src="https://roadsafety.nt.gov.au/_media/elearning/images/header.png" 
                   width="950" height="141"
                   alt="Drivesafe Remote Driver Education and Licensing Program" />
              <h1>Click on the images below to view the appropriate modules.</h1>
            </div>
            
            <div class="drivesafe-spacer"></div>
            
            <div class="drivesafe-module-row">
              <a href="#" onclick="DriveSafe.launchModule('walkthrough','Walkthrough');return false;" class="drivesafe-module-link">
                <img src="https://roadsafety.nt.gov.au/_media/elearning/images/walkthroughBtn.png" 
                     width="449" height="71" alt="Walkthrough" />
              </a>
            </div>
            
            <div class="drivesafe-spacer"></div>
            
            <div class="drivesafe-module-row">
              <a href="#" onclick="DriveSafe.launchModule('intro','Introduction');return false;" class="drivesafe-module-link">
                <img src="https://roadsafety.nt.gov.au/_media/elearning/images/intro.png" 
                     width="200" height="150" alt="Introduction" />
              </a>
            </div>
            
            <div class="drivesafe-spacer"></div>
            
            <div class="drivesafe-modules-grid">
              <a href="#" onclick="DriveSafe.launchModule('m1-yourdriverslicence','Module 1 - Your Driver\\'s Licence');return false;" class="drivesafe-module-link">
                <img src="https://roadsafety.nt.gov.au/_media/elearning/images/m1.png" 
                     width="200" height="150" alt="Module 1 - Your Driver's Licence" />
              </a>
              <a href="#" onclick="DriveSafe.launchModule('m2-roadsafety','Module 2 - Road Safety');return false;" class="drivesafe-module-link">
                <img src="https://roadsafety.nt.gov.au/_media/elearning/images/m2.png" 
                     width="200" height="150" alt="Module 2 - Road Safety" />
              </a>
              <a href="#" onclick="DriveSafe.launchModule('m3-safedriving','Module 3 - Safe Driving');return false;" class="drivesafe-module-link">
                <img src="https://roadsafety.nt.gov.au/_media/elearning/images/m3.png" 
                     width="200" height="151" alt="Module 3 - Safe Driving" />
              </a>
            </div>
            
            <div class="drivesafe-spacer"></div>
            
            <div class="drivesafe-modules-grid">
              <a href="#" onclick="DriveSafe.launchModule('m4-roadrules','Module 4 - Road Rules');return false;" class="drivesafe-module-link">
                <img src="https://roadsafety.nt.gov.au/_media/elearning/images/m4.png" 
                     width="200" height="150" alt="Module 4 - Road Rules" />
              </a>
              <a href="#" onclick="DriveSafe.launchModule('m5-penalties','Module 5 - Penalties');return false;" class="drivesafe-module-link">
                <img src="https://roadsafety.nt.gov.au/_media/elearning/images/m5.png" 
                     width="200" height="151" alt="Module 5 - Penalties" />
              </a>
              <a href="#" onclick="DriveSafe.launchModule('whereto','Where to from here?');return false;" class="drivesafe-module-link">
                <img src="https://roadsafety.nt.gov.au/_media/elearning/images/where.png" 
                     width="200" height="151" alt="Where to from here?" />
              </a>
            </div>
            
            <div class="drivesafe-spacer"></div>
            
            <div class="drivesafe-module-row">
              <a href="#" onclick="DriveSafe.launchModule('test','Test');return false;" class="drivesafe-module-link">
                <img src="https://roadsafety.nt.gov.au/_media/elearning/images/testBtn.png" 
                     width="449" height="93" alt="Test" />
              </a>
            </div>
            
            <div class="drivesafe-spacer"></div>
          </div>
        </div>
      `;
    },

    /**
     * Launch a module by name
     * @param {string} moduleName - The module identifier
     * @param {string} displayName - The human-readable module name
     */
    launchModule: async function (moduleName, displayName) {
      const overlay = document.getElementById("drivesafeLoadingOverlay");
      const loadingText = document.getElementById("drivesafeLoadingText");

      if (!overlay || !loadingText) {
        console.error("DriveSafe: Loading overlay not found");
        return;
      }

      // Check if JSZip is available
      if (typeof JSZip === "undefined") {
        alert(
          "Error: JSZip library not loaded. Please ensure the JSZip CDN is included.",
        );
        return;
      }

      // Close any existing module overlay first
      this.closeModuleOverlay();

      // Check if already extracted
      if (localStorage.getItem(moduleName + "_extracted")) {
        this.openModuleInIframe(
          this.basePath + moduleName + "/story.html",
          displayName,
        );
        return;
      }

      // Show overlay
      loadingText.textContent = `Preparing ${displayName}...`;
      overlay.style.display = "flex";

      try {
        const cache = await caches.open("drivesafe-modules-v2");

        // Handle multi-part zips for large modules
        const parts =
          moduleName === "m4-roadrules"
            ? [`${moduleName}.zip`, `${moduleName}-part2.zip`]
            : [`${moduleName}.zip`];

        for (let p = 0; p < parts.length; p++) {
          if (parts.length > 1) {
            loadingText.textContent = `Preparing ${displayName}... (Part ${p + 1}/${parts.length})`;
          }

          const response = await fetch(
            "https://roadsafety.nt.gov.au/_media/elearning/" + parts[p],
          );
          if (!response.ok) throw new Error("Download failed");

          const zipBlob = await response.blob();
          const zip = await JSZip.loadAsync(zipBlob);

          // Extract and cache each file using base path
          const fileEntries = Object.entries(zip.files);
          for (let i = 0; i < fileEntries.length; i++) {
            const [filename, file] = fileEntries[i];
            if (!file.dir) {
              const blob = await file.async("blob");
              const mime = this.getMimeType(filename);
              const resp = new Response(blob, {
                headers: { "Content-Type": mime },
              });
              // Cache with full URL for service worker matching
              const fullUrl = new URL(
                this.basePath + moduleName + "/" + filename,
                window.location.origin,
              ).href;
              console.log("[DriveSafe] Caching:", fullUrl);
              await cache.put(fullUrl, resp);
            }
          }
        }

        localStorage.setItem(moduleName + "_extracted", "true");
        overlay.style.display = "none";
        this.openModuleInIframe(
          this.basePath + moduleName + "/story.html",
          displayName,
        );
      } catch (e) {
        console.error("Module loading error:", e);
        loadingText.textContent =
          "Unable to load module. Please check your internet connection and try again.";
        setTimeout(() => {
          overlay.style.display = "none";
        }, 5000);
      }
    },

    /**
     * Open a module in a fullscreen iframe overlay
     * @param {string} moduleUrl - The URL of the module to open
     * @param {string} displayName - The human-readable module name
     */
    openModuleInIframe: function (moduleUrl, displayName) {
      // Create fullscreen overlay container
      const overlay = document.createElement("div");
      overlay.id = "drivesafe-module-overlay";
      overlay.className = "drivesafe-module-overlay";

      // Create header with title and close button
      const header = document.createElement("div");
      header.className = "drivesafe-overlay-header";

      const title = document.createElement("span");
      title.className = "drivesafe-overlay-title";
      title.textContent = displayName;

      const closeBtn = document.createElement("button");
      closeBtn.className = "drivesafe-overlay-close";
      closeBtn.textContent = "× Close Module";
      closeBtn.onclick = () => this.closeModuleOverlay();

      header.appendChild(title);
      header.appendChild(closeBtn);

      // Create iframe
      const iframe = document.createElement("iframe");
      iframe.className = "drivesafe-module-iframe";
      iframe.src = moduleUrl;
      iframe.setAttribute("allowfullscreen", "true");

      // Assemble overlay
      overlay.appendChild(header);
      overlay.appendChild(iframe);
      document.body.appendChild(overlay);

      // Listen for completion message from module
      this.moduleCompleteHandler = (event) => {
        if (event.data && event.data.type === "module-complete") {
          this.closeModuleOverlay();
        }
      };
      window.addEventListener("message", this.moduleCompleteHandler);
    },

    /**
     * Close the module overlay and clean up
     */
    closeModuleOverlay: function () {
      const overlay = document.getElementById("drivesafe-module-overlay");
      if (overlay) {
        overlay.remove();
      }

      // Remove message listener
      if (this.moduleCompleteHandler) {
        window.removeEventListener("message", this.moduleCompleteHandler);
        this.moduleCompleteHandler = null;
      }
    },

    /**
     * Get MIME type for a file based on extension
     * @param {string} filename - The filename
     * @returns {string} The MIME type
     */
    getMimeType: function (filename) {
      const ext = filename.split(".").pop().toLowerCase();
      const types = {
        html: "text/html",
        js: "application/javascript",
        css: "text/css",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        svg: "image/svg+xml",
        xml: "application/xml",
        json: "application/json",
        swf: "application/x-shockwave-flash",
        mp3: "audio/mpeg",
        mp4: "video/mp4",
      };
      return types[ext] || "application/octet-stream";
    },
  };

  // Make DriveSafe globally accessible
  window.DriveSafe = DriveSafe;

  // Auto-initialize on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => DriveSafe.init());
  } else {
    DriveSafe.init();
  }
})();
