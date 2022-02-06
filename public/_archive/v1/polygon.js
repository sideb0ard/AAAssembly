class Polygon {
    constructor(c,W,H,margin,easing,timer,dotSize) {
        this.fill = c;
        this.W = W;
        this.H = H;
        this.margin = margin;
        this.easing = easing;
        this.timer = timer;
        this.dotSize = dotSize;
        this.positionsList = [
            "this.margin,random(this.H/2,this.H))",
            "random(this.W/2),this.H)",
            "random(this.W/2,this.W),this.H)",
            "this.W - random(0,100),random(this.H/2,this.H))",
            "this.W,random(this.margin*2,this.H/2))",
            "random(this.W/2,this.W),this.margin*2)",
            "random(this.margin*2,this.W/2),this.margin*2)"
        ];   

        // generate points set 
        this.points = [];  
        
        // Random Positions
        // for (let n=0; n < 6; n++) {
        //     let v = createVector(this.W-this.margin,this.H-this.margin);
        //     this.points.push(new Point(v,v,this.timer,this.dotSize))
        // }    

        // for (let n=0; n < 6; n++) {            
        //     let v = createVector(this.positionsList[n]);
        //     this.points.push(new Point(this.id,this.v,this.v,this.timer,this.dotSize,this.W,this.H,this.margin));
        // }          

        // point 0
        this.id = 0;
        this.v = createVector(this.margin*2,random(this.H/2,this.H));
        this.points.push(new Point(this.id,this.v,this.v,this.timer,this.dotSize,this.W,this.H,this.margin)); 

        // point 1
        this.id = 1;
        this.v = createVector(random(this.W/2),this.H);
        this.points.push(new Point(this.id,this.v,this.v,this.timer,this.dotSize,this.W,this.H,this.margin));         

        // point 2
        this.id = 2;
        this.v = createVector(random(this.W/2,this.W),this.H);
        this.points.push(new Point(this.id,this.v,this.v,this.timer,this.dotSize,this.W,this.H,this.margin));         

        // point 3
        this.id = 3;
        this.v = createVector(this.W - random(0,100),random(this.H/2,this.H));
        this.points.push(new Point(this.id,this.v,this.v,this.timer,this.dotSize,this.W,this.H,this.margin));         

        // point 4
        this.id = 4;
        this.v = createVector(this.W,random(this.margin*2,this.H/2));
        this.points.push(new Point(this.id,this.v,this.v,this.timer,this.dotSize,this.W,this.H,this.margin));         

        // point 5
        this.id = 5;
        this.v = createVector(random(this.W/2,this.W),this.margin*2);
        this.points.push(new Point(this.id,this.v,this.v,this.timer,this.dotSize,this.W,this.H,this.margin));   
        
        // point 6
        this.id = 6;
        this.v = createVector(random(this.margin*2,this.W/2),this.margin*2);
        this.points.push(new Point(this.id,this.v,this.v,this.timer,this.dotSize,this.W,this.H,this.margin));           

    }
  
    draw() {
        noStroke();

        fill('black');
        beginShape();
        this.points.forEach(p => {
            vertex(p.pos.x,p.pos.y);
        });
        endShape(CLOSE);   

        // fill('white');
        // this.points.forEach(p => {
        //     ellipse(p.pos.x,p.pos.y,5,5);
        // });    
    }
}


