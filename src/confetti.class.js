class Confetti {

    constructor(party, options) {
        this.party = party;
        // canvas
        this.canvas = party.canvas;

        // color and shape
        this.color = options.color;
        this.shape = options.shape;

        // rotation speed
        // this.rotation_speed = options.rotation;

        // speed
        this.speed = options.speed;

        // wind_force, determine if it will go left or right
        this.wind_force = options.wind_force;
        const wind_force_multiplier = Math.floor((Math.random() * 2) + 1)
        if (wind_force_multiplier == 2) {
            this.wind_force *= -1;
        }

        // interval for moving the confetti
        this.interval = null;
        this.isDone = false;

        this.move = this.move.bind(this);
    }

    position(x, y) {
        this.x = x;
        this.y = y;
    }

    move() {
        // increase according to speed
        this.y += this.speed / 30;
        this.angle += this.speed / 30;

        // point it to one direction
        const chance = this.party.getRandomInt(1, 1000);
        if(chance == 1000){
            this.wind_force *= -1;
        }
        this.x += this.wind_force / 80;

        // draw it again
        this.draw();
    }

    setUp() {
        this.width = Math.floor(Math.random() * 25 + 1);
        this.height = Math.floor(Math.random() * 40 + 1);

        if (this.shape == "rectangle" || this.shape == "triangle") {
            this.angle = Math.floor((Math.random() * 90) + 1);
            const angle_multiplier = Math.floor((Math.random() * 2) + 1)
            if (angle_multiplier == 2) {
                this.angle *= -1;
            }

            this.x_width = Math.abs(Math.cos(this.angle) * this.width);
        }

        this.interval = setInterval(this.party.redraw, 33);
    }

    isOut(){
        return this.y >= this.party.dom_canvas.height ||
            this.x + this.x_width <= 0 ||
            this.x >= this.party.dom_canvas.width;
    }

    draw() {
        if (this.isOut() && !this.isDone) {
            // clearInterval(this.interval);
            // this.interval = null;
            this.isDone = true;
            this.party.countDone();
        }
        else if(!this.isDone) {
            // save untraslated state
            this.canvas.save();

            // begin path
            this.canvas.beginPath();

            // translate for rotation
            var rotate = false;
            if (this.shape == "rectangle") {
                this.canvas.translate(this.x + this.width / 2, this.y + this.height / 2);
                rotate = true;
            }
            else if (this.shape == "triangle") {
                this.canvas.translate(this.x, this.y);
                rotate = true;
            }

            // rotate
            if (rotate) {
                this.canvas.rotate(this.angle * Math.PI / 180);
            }

            // set color
            this.canvas.fillStyle = this.color;
            this.canvas.strokeStyle = this.color;

            // draw
            if (this.shape == "rectangle") {
                this.canvas.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            }
            else if (this.shape == "circle") {
                this.canvas.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
            }
            else if (this.shape == "triangle") {
                const center_point_x = this.x;
                const center_point_y = this.y;

                const triangle_side = this.width;

                const triangle_height = triangle_side * Math.sqrt(3) / 2;
                const R = triangle_height * (2 / 3);
                const r = triangle_height / 3;

                const top_point = {
                    x: 0,
                    y: -R
                }

                const bottom_left_point = {
                    x: -(triangle_side / 2),
                    y: r
                }

                const bottom_right_point = {
                    x: (triangle_side / 2),
                    y: r
                }

                this.canvas.moveTo(top_point.x, top_point.y);
                this.canvas.lineTo(bottom_left_point.x, bottom_left_point.y);
                this.canvas.lineTo(bottom_right_point.x, bottom_right_point.y);
            }

            // close path
            this.canvas.closePath();
            this.canvas.fill();

            // draw actually
            this.canvas.stroke();

            // restore untraslated state for further drawing
            this.canvas.restore();
        }
    }

}