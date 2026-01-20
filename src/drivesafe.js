/**
 * DriveSafe E-Learning Module Loader - Simplified Version
 * No caching, no service worker - downloads and opens modules in new windows
 */
(function () {
  "use strict";

  const DriveSafe = {
    basePath: "",

    init: function () {
      // Detect base path
      if (window.DRIVESAFE_BASE_PATH) {
        this.basePath = window.DRIVESAFE_BASE_PATH.endsWith("/")
          ? window.DRIVESAFE_BASE_PATH
          : window.DRIVESAFE_BASE_PATH + "/";
      }
      console.log("[DriveSafe] Base path:", this.basePath);

      this.createLoadingOverlay();
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

    openModuleWindow: function(fileMap, moduleName, displayName) {
      // Open new window
      const win = window.open("", "_blank");
      if (!win) {
        alert("Please allow popups to view modules.");
        return;
      }

      // Get story.html content
      let html = "";
      for (const filename in fileMap) {
        if (filename === "story.html" || filename.endsWith("/story.html")) {
          fetch(fileMap[filename])
            .then(r => r.text())
            .then(content => {
              // Replace relative URLs with blob URLs
              Object.keys(fileMap).forEach(file => {
                const basename = file.split('/').pop();
                const regex = new RegExp(`(['"])${basename}\\1`, 'g');
                content = content.replace(regex, `$1${fileMap[file]}$1`);
              });
              
              win.document.write(content);
              win.document.close();
              win.document.title = displayName;
            });
          return;
        }
      }
      
      win.document.write(`<h1>Error: story.html not found in module</h1>`);
      win.document.close();
    },

    closeModuleOverlay: function() {
      // Placeholder for consistency
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
