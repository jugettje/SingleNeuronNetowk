const Matrix = require('./Matrix.js');
// TODO make it so you have to pass the library refrence
// TODO so you never have to go back to the code and change 
// TODO the path if it changes.

function sigmoid(x) { return 1/ (1+ Math.exp(x * -1)); }
function sigmoidDerivative(x) { return sigmoid(x) * (1 - sigmoid(x)); }
function sign(x) { return Math.floor(x + 0.5) }

class NeuralNetwork
{
    constructor(learningRate = 0.05, inputs = 3)
    {
        this.weights = new Matrix(inputs, 1).randomise(1,-1);
        this.weights.replaceAt(2,0, 1.0);
        this.learningRate = learningRate;
    }

    // blocking task split up in parts?
    // put the weight calculation in array and sum them up at the end
    // to get the average over those training sessions
    // 
    train(trainingInputs, trainingOutputs, itterations)
    {
        for(let i = 0; i < itterations; i++)
        {
            let deltaWeigths = this.calculateWeights(trainingInputs, trainingOutputs);
            this.weights = this.weights.add(deltaWeigths);
        }
    }

    // guess = sigmoid( weights * inputs )
    think(trainingInputs)
    {
        return trainingInputs.multiply(this.weights).doAtEveryElement((mtrx, i, j)=>
        {
            mtrx.replaceAt(i,j, sigmoid(mtrx.array[i][j]));
        });
    }

    // error = answer - guess
    // Delta weights = input * (error * (sigmoid () ) )
    calculateWeights(trainingInputs, trainingOutputs)
    {
        let output = this.think(trainingInputs)
        let error = trainingOutputs.subtract(output);
        let sigmoidOut = output.doAtEveryElement((mtrx, i, j)=>
        {
            mtrx.replaceAt(i,j, sigmoidDerivative(mtrx.array[i][j]));
        });
        let TMP = error.elementWiseMultiply(sigmoidOut);
        return trainingInputs.transpose().multiply(TMP).multiply(this.learningRate);
    }

    calculateScore(trainingInputs, trainingOutputs)
    {
        let output = this.think(trainingInputs).doAtEveryElement((mtrx, i, j)=>
        {
            mtrx.replaceAt(i,j, sign(mtrx.array[i][j]));
        });

        let sum = 0.0;
        for(let i = 0; i < output.rows; i++)
        {
            if(output.array[i][0] == trainingOutputs.array[i][0]) { sum++;}
        }
        //console.log(`sum: ${sum} total: ${output.rows}`);
        return  (sum/output.rows) *100;
    }
};

module.exports = NeuralNetwork;