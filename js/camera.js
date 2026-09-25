export class ChiliCamera {

    constructor(video) {

        this.video = video;
        this.stream = null;
    }


    async start() {

        this.stream =
            await navigator.mediaDevices
                .getUserMedia({

                    video: {
                        facingMode:
                            "environment",

                        width: {
                            ideal: 1280
                        },

                        height: {
                            ideal: 720
                        }
                    },

                    audio: false
                });


        this.video.srcObject =
            this.stream;


        await this.video.play();


        return this.video;
    }
}