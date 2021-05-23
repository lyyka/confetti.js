class ConfettiParty {

    constructor(options) {
        // store confetties
        this.confetties = [];

        // set options for later user
        this.options = options;

        // get element
        this.dom_canvas = document.getElementById(options.id);

        // if the canvas should be fullscreen
        if(options.fullscreen != undefined && options.fullscreen){
            this.dom_canvas.parentElement.style.position = "relative";            
            this.dom_canvas.style.position = "fixed";            
            // this.dom_canvas.width = document.body.clientWidth;
            // this.dom_canvas.height = document.body.clientHeight;
            this.dom_canvas.width = window.innerWidth;
            this.dom_canvas.height = window.innerHeight;
        }

        // get context
        this.canvas = this.dom_canvas.getContext("2d");

        // bind this to redraw as it is a callback function on interval
        this.redraw = this.redraw.bind(this);
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    start() {
        // clear previous confetties
        this.confetties = [];

        // the display property when the party starts
        if (this.options.display != undefined) {
            this.dom_canvas.style.display = this.options.display;
        }
        else {
            this.dom_canvas.style.display = "block";
        }
        
        // z index of the canvas element
        if(this.options.zIndex != undefined){
            this.dom_canvas.style.zIndex = this.options.zIndex;
        }
        else{
            this.dom_canvas.style.zIndex = "1";
        }

        // colors for confetties
        let colors = [];

        if (this.options.colors != undefined){
            colors = this.options.colors;
        }
        else{
            colors = [
                "red",
                "lightgreen",
                "lightblue",
                "yellow"
            ];
        }

        // shape(s) of confetties
        let shapes = [];

        if(this.options.shapes != undefined){
            shapes = this.options.shapes;
        }
        else{
            shapes = [
                "rectangle",
                "circle",
                "triangle"
            ];
        }

        // set confetti number and starting position
        const conf_number = this.options.number != undefined ? this.options.number : 500;
        let x = 0;
        let y = -300;

        // generate speed boundaries
        let speed = this.options.speed != undefined ? this.options.speed : 2500;
        let bottom_speed = speed / 2;
        let top_speed = speed * 3/2

        // generate wind boundaries
        let wind = this.options.wind != undefined ? this.options.wind : 250;
        let bottom_wind = wind / 2;
        let top_wind = wind * 3 / 2

        for (let i = 1; i < conf_number + 1; i++) {
            // get random color
            const rand_color = colors[this.getRandomInt(0, colors.length - 1)];

            // get random shape
            const rand_shape = shapes[this.getRandomInt(0, shapes.length - 1)];

            // construct confetti
            let conf = new Confetti(this, {
                color: rand_color,
                shape: rand_shape,
                speed: this.getRandomInt(bottom_speed, top_speed),
                wind_force: this.getRandomInt(bottom_wind, top_wind)
            });

            conf.id = i;

            // position the confetti
            conf.position(x, y);

            // set it up
            // conf.setUp();

            this.confetties.push(conf);

            x += 30;
            if (x > this.dom_canvas.width) {
                x = 10;
            }
        }

        for(let i = 0; i < this.confetties.length; i++) {
            this.confetties[i].setUp();
        }

        this.interval = setInterval(this.redraw, 33);
    }

    countDone() {
        if (this.done == null) {
            this.done = 0;
        }

        this.done++;

        if (this.done == this.confetties.length) {
            clearInterval(this.interval);
            this.interval = null;
            this.done = null;
            if(this.options.removeAfterEnd){
                this.dom_canvas.style.display = "none";
                this.dom_canvas.style.zIndex = "-1";
            }
        }
    }

    redraw() {
        console.log("redraw call");
        this.canvas.beginPath();
        this.canvas.clearRect(0, 0, this.dom_canvas.width, this.dom_canvas.height);
        this.canvas.stroke();
        for (let i = 0; i < this.confetties.length; i++) {
            const conf = this.confetties[i];

            // move!!!
            if(!conf.isDone){
                conf.move();
            }
        }
        // requestAnimationFrame(this.redraw);
    }

}