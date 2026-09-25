export class ChiliDetector {

    constructor() {

        this.model = null;

        this.confidence = 0.55;
    }


    async load() {

        this.model =
            await cocoSsd.load();

        return true;
    }


    async detect(video) {

        if (!this.model)
            return [];


        const results =
            await this.model.detect(
                video
            );


        return results.filter(
            object =>
                object.score >=
                this.confidence
        );
    }
}