
//! most functions do not change this matrix itself
//! instead they return a new matrix with the changed data
class Matrix
{
    constructor(rows = 1, cols = 1)
    {
        this.rows = rows;
        this.cols = cols;
        this.array=new Array(this.rows);
        for(let i = 0; i < this.rows; i++)
        {
            this.array[i]=new Array(this.cols);
        }
        this.setAllValuesTo(0);
    }

    //* does return this object but is not the main purpose
    //! CHANGES THIS MATRIX 
    setAllValuesTo(input)
    {
        this.everyElement((i,j)=> //callback for every element
        {
            this.replaceAt(i,j, input);
        });
        return this;
    }

    //* does return this object but is not the main purpose
    //! CHANGES THIS MATRIX 
    replaceAt(_row, _col, _input)
    {
        this.array[_row][_col] = _input;
        return this;
    }

    //* does return this object but is not the main purpose
    //! CHANGES THIS MATRIX
    randomise(_high = 10, _low = 2)
    {
        this.everyElement((i,j)=>
        {
            this.replaceAt(i,j, Math.floor(Math.random() * (1 + _high  - _low) + _low));
        });
        return this;
    }

    //* return a new matrix with the transposed values
    transpose()
    {
        // @param returnMatrix, the matrix that will be returned
        let returnMatrix = new Matrix(this.cols, this.rows);
        this.everyElement((i,j)=>
        {
            returnMatrix.replaceAt(j,i, this.array[i][j]);
        });
        return returnMatrix;
    }

    //* prints a formatted string to the console with the contents of this matrix
    printToConsole()
    {
        for(let i = 0; i < this.rows; i++)
        {
            for(let j = 0; j < this.cols; j++)
            {
                process.stdout.write(this.array[i][j].toFixed(3) +"\t");
            }
            console.log("\n");
        }
        console.log("");
    }

    printToString()
    {
        let returnString = '';
        for(let i = 0; i < this.rows; i++)
        {
            for(let j = 0; j < this.cols; j++)
            {
                returnString += this.array[i][j].toFixed(3) +"\t";
            }
            returnString += "\n";
        }
        returnString += "\n";
    }

    //* return a new Matrix widouth changing this one
    subtract(input) //!throws ERRCODE100
    {
        // @param returnMatrix, the matrix that will be returned
        let returnMatrix = new Matrix(this.rows, this.cols);
        //check if it is a matrix
        if(input instanceof Matrix)
        {
            //if it is make sure it has the same dimensions else throw error
            if(this.rows != input.rows || this.cols != input.cols){throw "Matrix dimension error in subtract {ERRCODE100}";}
            this.everyElement((i,j)=> //callback for every element
            {
                returnMatrix.replaceAt(i,j, this.array[i][j] - input.array[i][j]);
            });
            return returnMatrix;
        }
        else //if number
        {
            this.everyElement((i,j)=> //callback for every element
            {
                returnMatrix.replaceAt(i,j, this.array[i][j] - input);
            });
            return returnMatrix;
        }
    }

    //* return a new Matrix widouth changing this one
    add(input) //!throws ERRCODE103
    {
        // @param returnMatrix, the matrix that will be returned
        let returnMatrix = new Matrix(this.rows, this.cols);
        //check if it is a matrix
        if(input instanceof Matrix)
        {
            //if it is make sure it has the same dimensions else throw error
            if(this.rows != input.rows || this.cols != input.cols){throw "Matrix dimension error in add {ERRCODE103}";}
            this.everyElement((i,j)=> //callback for every element
            {
                returnMatrix.replaceAt(i,j, this.array[i][j] + input.array[i][j]);
            });
            return returnMatrix;
        }
        else //if number
        {
            this.everyElement((i,j)=> //callback for every element
            {
                returnMatrix.replaceAt(i,j, this.array[i][j] + input);
            });
            return returnMatrix;
        }
    }

    //* return a new Matrix widouth changing this one
    multiply(input) //!throws ERRCODE101
    {
        try {
            let returnMatrix;
            if(input instanceof Matrix)
            {
               if(this.cols !== input.rows){throw "Matrix dimension error in multiply {ERRCODE101}";}
                returnMatrix = new Matrix(this.rows, input.cols);
                for(let i = 0; i < this.rows; i++)
                {
                    for(let j = 0; j < input.cols; j++)
                    {
                        let sum = 0;
                        for(let k = 0; k < this.cols; k++)
                        {
                            sum += (this.array[i][k] * input.array[k][j]);
                        }
                        returnMatrix.replaceAt(i,j, sum);
                    }
                }
                return returnMatrix;
            }
            else //if number
            {
                returnMatrix = new Matrix(this.rows, this.cols);
                this.everyElement((i,j)=> //callback for every element
                {
                    returnMatrix.replaceAt(i,j, this.array[i][j] * input);
                });
                return returnMatrix;
            }
        } catch (error) {
            console.log('');
            console.trace(error);
            console.log("Stopping program ...\n\n");
            process.exit();
        }
        
    }

    //* return a new Matrix widouth changing this one
    elementWiseMultiply(input)//!throws ERRCODE102
    {
        try {
            if(input instanceof Matrix)
            {
                if(this.rows != input.rows){throw "Matrix dimension error in element multiply {ERRCODE102}";}
                let returnMatrix = new Matrix(this.rows, this.cols);
                this.everyElement((i,j)=>
                {
                    returnMatrix.replaceAt(i,j, this.array[i][j] * input.array[i][j]);
                });
                return returnMatrix;
            }
        } catch (error) {
            console.log(error);
            console.log("Stopping program ...\n\n");
            process.exit();
        }
    }

    //* rows and cols loop callback use: (i,j)=>{}
    everyElement(callback) //private use
    {
        for(let i = 0; i < this.rows; i++)
        {
            for(let j = 0; j < this.cols; j++)
            {
                callback(i,j);
            }
        }
    }

    //* if nothing gets returned in the callback, return this
    //! POSSIBLY CHANGES THIS MATRIX
    doAtEveryElement(callback) //public use
    {
        for(let i = 0; i < this.rows; i++)
        {
            for(let j = 0; j < this.cols; j++)
            {
                callback(this,i,j);
            }
        }
        return this;
    }
};

module.exports = Matrix;