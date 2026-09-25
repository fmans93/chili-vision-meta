export class ChiliEvents {

    constructor() {

        this.events = [];
    }


    add(
        type,
        message,
        data = {}
    ) {

        const event = {

            time:
                new Date(),

            type,

            message,

            data
        };


        this.events.push(
            event
        );


        if (
            this.events.length >
            200
        ) {

            this.events.shift();
        }


        console.log(
            "[CHILI EVENT]",
            event
        );


        return event;
    }


    count() {

        return this.events.length;
    }
}