/* =========================================================
   CHILI VISION
   SCANNER MODULE V2
   Demo tracking system
========================================================= */

export class ChiliScanner {

  constructor() {
    this.active = false;
    this.objects = [];
    this.animationFrame = null;
    this.startTime = 0;

    this.layer = document.querySelector("#scannerLayer");

    this.createScannerUI();
  }


  createScannerUI() {

    if (!this.layer) return;

    this.layer.innerHTML = `
      <div id="scanSweep"></div>

      <div id="scanReadout">
        <div>SCAN: <strong id="scanState">STANDBY</strong></div>
        <div>OBJECTS: <strong id="objectCount">0</strong></div>
        <div>TRACKS: <strong id="trackCount">0</strong></div>
      </div>
    `;
  }


  start() {

    if (this.active) return;

    this.active = true;
    this.startTime = performance.now();

    document.body.classList.add("scan-active");

    const state = document.querySelector("#scanState");

    if (state) {
      state.textContent = "ACTIVE";
    }

    this.demoObjects();
    this.animate();

    this.emit("SCANNER ONLINE");
  }


  stop() {

    this.active = false;

    document.body.classList.remove("scan-active");

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.objects = [];

    this.createScannerUI();

    this.emit("SCANNER OFFLINE");
  }


  toggle() {

    if (this.active) {
      this.stop();
    } else {
      this.start();
    }
  }


  demoObjects() {

    // DEMO OBJECTS ONLY
    // These are not real camera detections yet.

    this.objects = [

      {
        id: 1,
        label: "PERSON",
        confidence: 0.96,
        x: 18,
        y: 25,
        w: 17,
        h: 43,
        vx: 0.10,
        vy: 0.03
      },

      {
        id: 2,
        label: "FORKLIFT",
        confidence: 0.91,
        x: 57,
        y: 37,
        w: 27,
        h: 29,
        vx: -0.08,
        vy: 0.02
      },

      {
        id: 3,
        label: "PALLET",
        confidence: 0.88,
        x: 42,
        y: 69,
        w: 22,
        h: 14,
        vx: 0.04,
        vy: 0
      }

    ];

    const count = document.querySelector("#objectCount");
    const tracks = document.querySelector("#trackCount");

    if (count) {
      count.textContent = this.objects.length;
    }

    if (tracks) {
      tracks.textContent = this.objects.length;
    }

    window.dispatchEvent(
      new CustomEvent("chili:detections", {
        detail: {
          objects: this.objects
        }
      })
    );
  }


  renderObjects() {

    if (!this.layer) return;

    this.layer
      .querySelectorAll(".detection-box")
      .forEach(box => box.remove());

    for (const object of this.objects) {

      const box = document.createElement("div");

      box.className = "detection-box";

      box.style.left = `${object.x}%`;
      box.style.top = `${object.y}%`;
      box.style.width = `${object.w}%`;
      box.style.height = `${object.h}%`;

      box.innerHTML = `
        <div class="detection-label">
          ${object.label} #${String(object.id).padStart(3, "0")}
          ${Math.round(object.confidence * 100)}%
        </div>

        <div class="track-dot"></div>
      `;

      this.layer.appendChild(box);
    }
  }


  updateObjects() {

    for (const object of this.objects) {

      object.x += object.vx;
      object.y += object.vy;

      if (
        object.x < 4 ||
        object.x + object.w > 96
      ) {
        object.vx *= -1;
      }

      if (
        object.y < 12 ||
        object.y + object.h > 90
      ) {
        object.vy *= -1;
      }
    }
  }


  animate() {

    if (!this.active) return;

    this.updateObjects();
    this.renderObjects();

    const sweep = document.querySelector("#scanSweep");

    if (sweep) {

      const elapsed =
        performance.now() - this.startTime;

      const position =
        (elapsed / 18) % window.innerHeight;

      sweep.style.transform =
        `translateY(${position}px)`;
    }

    this.animationFrame =
      requestAnimationFrame(() => this.animate());
  }


  emit(text) {

    window.dispatchEvent(
      new CustomEvent("chili:message", {
        detail: { text }
      })
    );
  }

}