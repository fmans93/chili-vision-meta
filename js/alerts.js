export class ChiliAlerts {

    constructor(element) {

        this.element =
            element;

        this.timeout =
            null;
    }


    show(
        message,
        danger = false
    ) {

        clearTimeout(
            this.timeout
        );


        this.element.textContent =
            message;


        this.element.style.opacity =
            "1";


        if (danger) {

            this.element.style.color =
                "#ffffff";

            this.element.style.borderColor =
                "#ff3344";

            this.element.style.background =
                "rgba(180,0,0,.85)";
        }

        else {

            this.element.style.color =
                "#00ff88";

            this.element.style.borderColor =
                "#00ff88";

            this.element.style.background =
                "rgba(0,20,15,.80)";
        }


        this.timeout =
            setTimeout(() => {

                this.element.style.opacity =
                    "0";

            }, 1800);
    }
}