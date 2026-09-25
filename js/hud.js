export class ChiliHUD {

    constructor(
        canvas,
        video
    ) {

        this.canvas =
            canvas;

        this.video =
            video;

        this.ctx =
            canvas.getContext(
                "2d"
            );
    }


    resize() {

        this.canvas.width =
            this.video.videoWidth;

        this.canvas.height =
            this.video.videoHeight;
    }


    clear() {

        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }


    scale() {

        return {

            x:
                this.canvas.width /
                this.video.videoWidth,

            y:
                this.canvas.height /
                this.video.videoHeight
        };
    }


    drawTrack(track) {

        const ctx =
            this.ctx;


        const [
            x,
            y,
            width,
            height
        ] =
            track.bbox;


        let color =
            "#00ff88";


        let state =
            "LOCKED";


        if (
            track.speed >
            500
        ) {

            color =
                "#ffd500";

            state =
                "MOTION";
        }


        if (
            track.vy >
            900
        ) {

            color =
                "#ff3344";

            state =
                "DROP";
        }


        ctx.strokeStyle =
            color;


        ctx.lineWidth =
            3;


        ctx.strokeRect(
            x,
            y,
            width,
            height
        );


        const label =

            track.className
                .toUpperCase()

            +

            " #" +

            String(
                track.id
            ).padStart(
                3,
                "0"
            )

            +

            "  " +

            Math.round(
                track.score *
                100
            )

            +

            "%  " +

            state;


        ctx.font =
            "bold 15px Arial";


        const labelWidth =
            ctx.measureText(
                label
            ).width + 10;


        ctx.fillStyle =
            "rgba(0,0,0,.75)";


        ctx.fillRect(
            x,
            Math.max(
                0,
                y - 23
            ),

            labelWidth,
            23
        );


        ctx.fillStyle =
            color;


        ctx.fillText(
            label,

            x + 5,

            Math.max(
                16,
                y - 6
            )
        );


        this.drawTrajectory(
            track,
            color
        );
    }


    drawTrajectory(
        track,
        color
    ) {

        if (
            track.history.length <
            2
        )
            return;


        const ctx =
            this.ctx;


        ctx.beginPath();


        ctx.moveTo(
            track.history[0].x,
            track.history[0].y
        );


        for (
            const point
            of track.history
        ) {

            ctx.lineTo(
                point.x,
                point.y
            );
        }


        ctx.strokeStyle =
            color;


        ctx.lineWidth =
            2;


        ctx.stroke();
    }


    drawFace(face) {

        const ctx =
            this.ctx;


        const x =
            face.start[0];

        const y =
            face.start[1];


        const width =
            face.end[0] -
            face.start[0];


        const height =
            face.end[1] -
            face.start[1];


        ctx.strokeStyle =
            "#00eaff";


        ctx.lineWidth =
            2;


        ctx.strokeRect(
            x,
            y,
            width,
            height
        );


        ctx.font =
            "bold 14px Arial";


        ctx.fillStyle =
            "#00eaff";


        ctx.fillText(

            "FACE #" +

            String(
                face.id
            ).padStart(
                2,
                "0"
            )

            +

            " // TRACKING",

            x,

            Math.max(
                18,
                y - 7
            )
        );


        if (
            face.landmarks
        ) {

            for (
                const point
                of face.landmarks
            ) {

                ctx.beginPath();

                ctx.arc(
                    point[0],
                    point[1],
                    3,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    "#00eaff";

                ctx.fill();
            }
        }
    }


    drawZones(zones) {

        const ctx =
            this.ctx;


        zones.forEach(
            zone => {

                const x =
                    zone.x *
                    this.canvas.width;

                const y =
                    zone.y *
                    this.canvas.height;

                const width =
                    zone.width *
                    this.canvas.width;

                const height =
                    zone.height *
                    this.canvas.height;


                ctx.strokeStyle =
                    "rgba(0,255,204,.40)";


                ctx.lineWidth =
                    2;


                ctx.setLineDash(
                    [10, 8]
                );


                ctx.strokeRect(
                    x,
                    y,
                    width,
                    height
                );


                ctx.setLineDash(
                    []
                );


                ctx.fillStyle =
                    "#00ffcc";


                ctx.font =
                    "11px Arial";


                ctx.fillText(
                    zone.name,
                    x + 5,
                    y + 15
                );
            });
    }
}