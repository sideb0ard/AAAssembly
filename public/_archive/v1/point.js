class Point {
    constructor(id,pos,target,timer,dotSize,W,H,margin) {
        this.id = id;
        this.pos = pos,
        this.target = target,
        this.dx = 0,
        this.dy = 0;
        this.easing = 0.09;
        this.timer = timer; // in seconds
        this.dotSize = dotSize;
        this.W = W;
        this.H = H;
        this.margin = margin;        

    }
 
    shuffle() {
        if (frameCount % (this.timer*10) === 0) {
            this.update();
        }
    }

    update() {        
        if(this.id == 0) {
            this.target = createVector(this.margin*2,random(this.margin*2,this.H));        
        } else if(this.id == 1) {
            this.target = createVector(random(this.W/2),this.H);           
        } else if(this.id == 2) {
            this.target = createVector(random(this.W/2,this.W),this.H);         
        } else if(this.id == 3) {
            this.target = createVector(this.W - random(0,100),random(this.H/2,this.H));         
        } else if(this.id == 4) {
            this.target = createVector(this.W,random(this.margin*2,this.H/2));       
        } else if(this.id == 5) {
            this.target = createVector(random(this.W/2,this.W),this.margin*2);      
        } else if(this.id == 6) {
            this.target = createVector(random(this.margin*2,this.W/2),this.margin*2);         
        }                

        // this.target = createVector(random(width),random(height));
    }

    draw() {

        /// move and easing
        this.dx = this.target.x - this.pos.x;
        this.dy = this.target.y - this.pos.y;  
        this.pos.x += this.dx * this.easing;
        this.pos.y += this.dy * this.easing;  
        
        fill(255);
        // text(this.id,this.pos.x + 10,this.pos.y + 10);
        ellipse(this.pos.x,this.pos.y,3,3);        
    }
}
