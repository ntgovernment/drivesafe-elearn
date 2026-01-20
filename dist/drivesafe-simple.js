/**
 * DriveSafe E-Learning Module Loader - Simplified Version
 * No caching, no service worker - downloads and opens modules in new windows
 */
(function () {
  "use strict";

  const DriveSafe = {
    basePath: "",
    currentFileMap: null,

    init: function () {
      // Detect base path
      if (window.DRIVESAFE_BASE_PATH) {
        this.basePath = window.DRIVESAFE_BASE_PATH.endsWith("/")
          ? window.DRIVESAFE_BASE_PATH
          : window.DRIVESAFE_BASE_PATH + "/";
      }
      console.log("[DriveSafe] Base path:", this.basePath);

      this.createLoadingOverlay();
      this.createModuleOverlay();
      this.generateContent();
    },

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

    createModuleOverlay: function () {
      const overlay = document.createElement("div");
      overlay.id = "drivesafeModuleOverlay";
      overlay.className = "drivesafe-module-overlay";
      overlay.style.display = "none";
      overlay.innerHTML = `
        <div class="drivesafe-overlay-header">
          <span id="drivesafeModuleTitle" class="drivesafe-overlay-title">Module</span>
          <button id="drivesafeCloseBtn" class="drivesafe-overlay-close">Close</button>
        </div>
        <iframe id="drivesafeModuleIframe" class="drivesafe-module-iframe"></iframe>
      `;
      document.body.appendChild(overlay);

      // Add close button handler
      const closeBtn = document.getElementById("drivesafeCloseBtn");
      closeBtn.addEventListener("click", () => this.closeModuleOverlay());

      // Add ESC key handler
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.style.display === "flex") {
          this.closeModuleOverlay();
        }
      });
    },

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

    launchModule: async function (moduleName, displayName) {
      const overlay = document.getElementById("drivesafeLoadingOverlay");
      const loadingText = document.getElementById("drivesafeLoadingText");

      if (!overlay || !loadingText) {
        console.error("DriveSafe: Loading overlay not found");
        return;
      }

      if (typeof JSZip === "undefined") {
        alert("Error: JSZip library not loaded.");
        return;
      }

      this.closeModuleOverlay();

      loadingText.textContent = `Downloading ${displayName}...`;
      overlay.style.display = "flex";

      try {
        // Download ZIP directly - no caching
        const zipUrl = `https://roadsafety.nt.gov.au/_media/elearning/${moduleName}.zip`;
        const response = await fetch(zipUrl);
        if (!response.ok) throw new Error("Download failed");

        const zipBlob = await response.blob();
        const zip = await JSZip.loadAsync(zipBlob);

        // Extract all files to blob URLs
        const fileMap = {};
        const entries = Object.entries(zip.files);

        loadingText.textContent = `Extracting ${displayName}...`;

        for (let i = 0; i < entries.length; i++) {
          const [filename, file] = entries[i];
          if (!file.dir) {
            const blob = await file.async("blob");
            const blobUrl = URL.createObjectURL(blob);
            fileMap[filename] = blobUrl;
          }
        }

        overlay.style.display = "none";

        // Open in new window with file map
        this.openModuleWindow(fileMap, moduleName, displayName);
      } catch (e) {
        console.error("Module loading error:", e);
        loadingText.textContent = `Unable to load ${displayName}. Please check your connection and try again.`;
        setTimeout(() => {
          overlay.style.display = "none";
        }, 5000);
      }
    },

    openModuleWindow: function (fileMap, moduleName, displayName) {
      // Store fileMap for cleanup
      this.currentFileMap = fileMap;

      // Get modal elements
      const overlay = document.getElementById("drivesafeModuleOverlay");
      const iframe = document.getElementById("drivesafeModuleIframe");
      const title = document.getElementById("drivesafeModuleTitle");

      if (!overlay || !iframe || !title) {
        console.error("DriveSafe: Modal overlay elements not found");
        return;
      }

      // Find story.html in fileMap
      let storyUrl = null;
      for (const filename in fileMap) {
        if (filename === "story.html" || filename.endsWith("/story.html")) {
          storyUrl = fileMap[filename];
          break;
        }
      }

      if (!storyUrl) {
        // Display error in iframe
        iframe.srcdoc = `
          <html>
            <head>
              <style>
                body { font-family: Verdana, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; }
                h1 { color: #9b2d1f; font-size: 24px; text-align: center; }
              </style>
            </head>
            <body><h1>Error: story.html not found in module</h1></body>
          </html>
        `;
        title.textContent = "Error";
        overlay.style.display = "flex";
        return;
      }

      // Show loading spinner in iframe
      iframe.srcdoc = `
        <html>
          <head>
            <style>
              body { display: flex; align-items: center; justify-content: center; flex-direction: column; height: 100vh; margin: 0; background: #fff; }
              .spinner { border: 8px solid #f3f3f3; border-top: 8px solid #9b2d1f; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              .text { font-family: Verdana, sans-serif; font-size: 20px; margin-top: 20px; color: #333; }
            </style>
          </head>
          <body>
            <div class="spinner"></div>
            <div class="text">Loading module...</div>
          </body>
        </html>
      `;

      // Update title and show modal
      title.textContent = displayName;
      overlay.style.display = "flex";

      // Fetch story.html and replace relative URLs with blob URLs
      fetch(storyUrl)
        .then((r) => r.text())
        .then((content) => {
          // Replace relative URLs with blob URLs - simple global replacement
          Object.keys(fileMap).forEach((file) => {
            const regex = new RegExp(
              file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
              "g",
            );
            content = content.replace(regex, fileMap[file]);
          });

          // Inject modified content into iframe
          iframe.srcdoc = content;
        })
        .catch((err) => {
          console.error("Error loading story.html:", err);
          iframe.srcdoc = `
            <html>
              <head>
                <style>
                  body { font-family: Verdana, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; }
                  h1 { color: #9b2d1f; font-size: 24px; text-align: center; }
                </style>
              </head>
              <body><h1>Error loading module content</h1></body>
            </html>
          `;
        });
    },

    closeModuleOverlay: function () {
      // Revoke all blob URLs
      if (this.currentFileMap) {
        Object.values(this.currentFileMap).forEach((blobUrl) => {
          URL.revokeObjectURL(blobUrl);
        });
        this.currentFileMap = null;
      }

      // Hide modal and reset iframe
      const overlay = document.getElementById("drivesafeModuleOverlay");
      const iframe = document.getElementById("drivesafeModuleIframe");

      if (overlay) {
        overlay.style.display = "none";
      }

      if (iframe) {
        iframe.src = "about:blank";
      }
    },

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

  window.DriveSafe = DriveSafe;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => DriveSafe.init());
  } else {
    DriveSafe.init();
  }
})();
