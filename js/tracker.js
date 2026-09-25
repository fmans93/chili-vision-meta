export class ChiliTracker {

    constructor() {

        this.tracks = [];

        this.nextID = 1;

        this.maxDistance = 150;

        this.maxAge = 1000;
    }


    center(bbox) {

        return {

            x:
                bbox[0] +
                bbox[2] / 2,

            y:
                bbox[1] +
                bbox[3] / 2
        };
    }


    distance(a, b) {

        return Math.hypot(
            a.x - b.x,
            a.y - b.y
        );
    }


    update(detections) {

        const now =
            performance.now();


        this.tracks.forEach(
            track =>
                track.matched = false
        );


        detections.forEach(
            detection => {

                const newCenter =
                    this.center(
                        detection.bbox
                    );


                let candidate = null;
                let candidateDistance =
                    Infinity;


                for (
                    const track
                    of this.tracks
                ) {

                    if (
                        track.className !==
                        detection.class
                    )
                        continue;


                    if (track.matched)
                        continue;


                    const d =
                        this.distance(
                            newCenter,
                            track.center
                        );


                    if (
                        d <
                        candidateDistance &&
                        d <
                        this.maxDistance
                    ) {

                        candidate =
                            track;

                        candidateDistance =
                            d;
                    }
                }


                if (candidate) {

                    const dt =
                        Math.max(
                            (
                                now -
                                candidate.time
                            ) / 1000,

                            0.001
                        );


                    candidate.vx =
                        (
                            newCenter.x -
                            candidate.center.x
                        ) / dt;


                    candidate.vy =
                        (
                            newCenter.y -
                            candidate.center.y
                        ) / dt;


                    candidate.speed =
                        Math.hypot(
                            candidate.vx,
                            candidate.vy
                        );


                    candidate.previousCenter =
                        candidate.center;


                    candidate.center =
                        newCenter;


                    candidate.bbox =
                        detection.bbox;


                    candidate.score =
                        detection.score;


                    candidate.time =
                        now;


                    candidate.matched =
                        true;


                    candidate.history.push({
                        x: newCenter.x,
                        y: newCenter.y,
                        time: now
                    });


                    if (
                        candidate.history.length >
                        20
                    ) {

                        candidate.history.shift();
                    }

                }

                else {

                    this.tracks.push({

                        id:
                            this.nextID++,

                        className:
                            detection.class,

                        bbox:
                            detection.bbox,

                        score:
                            detection.score,

                        center:
                            newCenter,

                        previousCenter:
                            newCenter,

                        vx: 0,
                        vy: 0,

                        speed: 0,

                        time:
                            now,

                        matched:
                            true,

                        history: [
                            {
                                x:
                                    newCenter.x,

                                y:
                                    newCenter.y,

                                time:
                                    now
                            }
                        ]
                    });
                }
            });


        this.tracks =
            this.tracks.filter(

                track =>
                    now -
                    track.time <
                    this.maxAge
            );


        return this.tracks;
    }
}