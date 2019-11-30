const trainDot = require('./TrainingDot.js');
const Matrix = require('./Matrix.js');

class trainingDataDotCollection
{
    constructor(dataSize, amountOfSets, amountOfInputs)
    {
        this.amountOfInputs = amountOfInputs;
        this.inputData = new Array(amountOfSets);
        for(let i = 0; i < amountOfSets; i++)
        {
            this.inputData[i] = new Array(dataSize);
            for(let j = 0; j < dataSize; j++)
            {
                this.inputData[i][j] = new trainDot();
            }
        }
    }

    getInputDatasetMatrixAt(index)
    {
        let returnMatrix = new Matrix(this.inputData[0].length, this.amountOfInputs);
        for(let i = 0; i < this.inputData[0].length; i++)
        {
            returnMatrix.replaceAt(i,0, this.inputData[index][i].pointX);
            returnMatrix.replaceAt(i,1, this.inputData[index][i].pointY);
            returnMatrix.replaceAt(i,2, 1.0);
        }
        return returnMatrix;
    }

    getOutputDatasetMatrixAt(index)
    {
        let returnMatrix = new Matrix(this.inputData[0].length, 1);
        for(let i = 0; i < this.inputData[0].length; i++)
        {
            returnMatrix.replaceAt(i,0, this.inputData[index][i].label);
        }
        return returnMatrix;
    }
};

module.exports = trainingDataDotCollection;