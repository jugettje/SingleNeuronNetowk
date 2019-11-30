//const Matrix = require (".\Matrix.js");
// make lib widouth Matrix if possible

class Dot
{
    constructor(_x = Math.random(), _y = Math.random())
    {
        this.pointX = _x;
        this.pointY = _y;
        this.array = new Array(2);
        this.array[0]= _x;
        this.array[1]= _y;
        this.label = this.calculateLabel();
    }

    getDisplayData()
    {
        // TODO format the data of this dot and return it
    }
    
    static lineFormula(x, m = 1, b = 0){ return m * x + b; }
    print(){ return `Point: x:${this.pointX.toFixed(3)}, y:${this.pointY.toFixed(3)}, label:${this.label}`; }
    calculateLabel() { if(this.pointY >= Dot.lineFormula(this.pointX)){ return 1; } return 0; }
};

module.exports = Dot;