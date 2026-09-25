export class ChiliFaces {

    constructor() {

        this.model = null;

        this.faces = [];

        this.nextID = 1;

        this.previousFaces = [];
    }


    async load() {

        this.model =
            await blazeface.load();
    }


    distance(a, b) {

        return Math.hypot(
            a.x - b.x,
            a.y - b.y
        );
    }


    async detect(video) {

        if (!this.model)
            return [];


        const predictions =
            await this.model
                .estimateFaces(
                    video,
                    false
                );


        const newFaces = [];


        predictions.forEach(
            prediction => {

                const start =
                    prediction.topLeft;

                const end =
                    prediction.bottomRight;


                const center = {

                    x:
                        (
                            start[0] +
                            end[0]
                        ) / 2,

                    y:
                        (
                            start[1] +
                            end[1]
                        ) / 2
                };


                let best = null;
                let bestDistance =
                    Infinity;


                for (
                    const previous
                    of this.previousFaces
                ) {

                    const d =
                        this.distance(
                            center,
                            previous.center
                        );


                    if (
                        d <
                        bestDistance &&
                        d < 120
                    ) {

                        best =
                            previous;

                        bestDistance =
                            d;
                    }
                }


                newFaces.push({

                    id:
                        best
                            ? best.id
                            : this.nextID++,

                    center,

                    start,

                    end,

                    landmarks:
                        prediction.landmarks,

                    probability:
                        prediction.probability
                            ? prediction
                                .probability[0]
                            : 1
                });
            });


        this.previousFaces =
            newFaces;


        this.faces =
            newFaces;


        return newFaces;
    }
}