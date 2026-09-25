import {
    ChiliCamera
}
from "./camera.js";


import {
    ChiliDetector
}
from "./detector.js";


import {
    ChiliTracker
}
from "./tracker.js";


import {
    ChiliFaces
}
from "./faces.js";


import {
    ChiliZones
}
from "./zones.js";


import {
    ChiliEvents
}
from "./events.js";


import {
    ChiliAlerts
}
from "./alerts.js";


import {
    ChiliHUD
}
from "./hud.js";


// ========================================
// DOM
// ========================================

const video =
    document.getElementById(
        "camera"
    );


const canvas =
    document.getElementById(
        "vision"
    );


const status =
    document.getElementById(
        "status"
    );


const objectDisplay =
    document.getElementById(
        "objects"
    );


const faceDisplay =
    document.getElementById(
        "faces"
    );


const eventDisplay =
    document.getElementById(
        "events"
    );


const fpsDisplay =
    document.getElementById(
        "fps"
    );


const alertBox =
    document.getElementById(
        "alertBox"
    );


// ========================================
// MODULES
// ========================================

const camera =
    new ChiliCamera(
        video
    );


const detector =
    new ChiliDetector();


const tracker =
    new ChiliTracker();


const faces =
    new ChiliFaces();


const zones =
    new ChiliZones();


const events =
    new ChiliEvents();


const alerts =
    new ChiliAlerts(
        alertBox
    );


const hud =
    new ChiliHUD(
        canvas,
        video
    );


let lastTime =
    performance.now();


let lastFaceScan =
    0;


let detectedFaces =
    [];


// ========================================
// BOOT
// ========================================

async function boot() {

    try {

        status.textContent =
            "CAMERA...";


        await camera.start();


        hud.resize();


        status.textContent =
            "OBJECT AI...";


        await detector.load();


        status.textContent =
            "FACE AI...";


        await faces.load();


        status.textContent =
            "CHILI ONLINE";


        alerts.show(
            "🌶 CHILI VISION ONLINE"
        );


        loop();

    }

    catch (error) {

        console.error(
            error
        );


        status.textContent =
            "SYSTEM ERROR";


        alerts.show(
            "VISION STARTUP ERROR",
            true
        );
    }
}


// ========================================
// MAIN LOOP
// ========================================

async function loop() {

    try {

        const now =
            performance.now();


        const detections =
            await detector.detect(
                video
            );


        const tracks =
            tracker.update(
                detections
            );


        // Don't run face AI
        // on absolutely every frame.

        if (
            now -
            lastFaceScan >
            150
        ) {

            detectedFaces =
                await faces.detect(
                    video
                );


            lastFaceScan =
                now;
        }


        hud.clear();


        hud.drawZones(
            zones.zones
        );


        tracks.forEach(
            track => {

                hud.drawTrack(
                    track
                );


                // Experimental drop logic

                if (
                    track.vy >
                    900
                ) {

                    const recentlyAlerted =

                        track.lastDropAlert &&
                        now -
                        track.lastDropAlert <
                        2500;


                    if (
                        !recentlyAlerted
                    ) {

                        track.lastDropAlert =
                            now;


                        events.add(

                            "DROP",

                            "Possible object drop",

                            {
                                id:
                                    track.id,

                                className:
                                    track.className
                            }
                        );


                        alerts.show(

                            "⚠ POSSIBLE DROP // " +

                            track.className
                                .toUpperCase()

                            +

                            " #" +

                            track.id,

                            true
                        );
                    }
                }
            });


        detectedFaces.forEach(
            face =>
                hud.drawFace(
                    face
                )
        );


        objectDisplay.textContent =
            tracks.length;


        faceDisplay.textContent =
            detectedFaces.length;


        eventDisplay.textContent =
            events.count();


        const delta =
            now -
            lastTime;


        const fps =
            Math.round(
                1000 /
                Math.max(
                    delta,
                    1
                )
            );


        lastTime =
            now;


        fpsDisplay.textContent =
            "AI FPS: " +
            fps;

    }

    catch (error) {

        console.error(
            "Vision loop:",
            error
        );
    }


    requestAnimationFrame(
        loop
    );
}


// ========================================
// RESIZE
// ========================================

window.addEventListener(
    "resize",
    () =>
        hud.resize()
);


// ========================================
// GO
// ========================================

boot();