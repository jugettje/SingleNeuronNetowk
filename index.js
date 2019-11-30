const trainCollection = require('./TrainingDataCollection.js');
const neuralNet = require('./NeuralNetwork.js');


//
const Express = require('express');
const app = Express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 3000;
//split up from main
// set routes in different file
const setupExpress = ()=>
{
    app.use(Express.static('webpage'));

    app.get('/', (req, res)=>
    {
        res.status(200).sendFile('./index.html');
    });

    app.get('/test', (req, res)=>
    {
        sendSomething();

        res.status(200).send();
    });

    io.on('connection', (socket)=>
    {
        console.log(`user connected IP: ${socket.handshake.address}`);

        socket.on('test', (msg)=>
        {
            console.log(msg);
        });
    });

    http.listen(PORT, ()=>
    {
        console.log(`Listening on port ${PORT}`);
        console.log('Ready for connection!');
    })
}
//

//keep this in main
const settings = require('./networkSettings.js');
let trainSettings = settings.settingsNonBlockingTraining;
let testSettings = settings.settingsNonBlockingTesting;
//



//===================================================================
//===================================================================
//===================================================================
const trainChunkStates =
{
    TRAININGDONE : "trainingDone",
    CALCULATENEWLEARNINGRATE : "CalculateNewLearningRate",
    SETUP : "setup",
    TRAIN : "train"
}

let trainState = trainChunkStates.SETUP;

let trainChunkSettings =
{
    trainingSetCounter : 0,
    trainingDataCollectionCounter :0,
    testSetCounter : 0,
    testScore : 0,
    testItterationCounter : 0,
    score : 0
}

let network;
let trainData;
let testData;


function trainChunk(funcSettings)
{
    switch (trainState) {
        case trainChunkStates.SETUP:
            trainData = new trainCollection(trainSettings.dataPerInput, trainSettings.dataSets, trainSettings.networkInputs);
            network = new neuralNet();
            trainState = trainChunkStates.TRAIN;
            setImmediate(trainChunk, funcSettings); // put this function back in queue and leave it
            break;
        case trainChunkStates.TRAIN:
            // train on around 10 samples and return to then call
            // this function again to continue with the next 10.
            // do this till you have reached the amount of training
            // that has been set up. then calculate the new learning
            // rate. do this till the required %correct is achieved

            network.train(trainData.getInputDatasetMatrixAt(funcSettings.trainingSetCounter), trainData.getOutputDatasetMatrixAt(funcSettings.trainingSetCounter), trainSettings.itterations);
            funcSettings.trainingSetCounter++;
            //console.log("training");
            if (funcSettings.trainingSetCounter >= trainSettings.amountOfLearningData)
            {
                if(funcSettings.trainingDataCollectionCounter >= trainSettings.itterationLoops) 
                {
                    trainState = trainChunkStates.CALCULATENEWLEARNINGRATE;
                    funcSettings.trainingDataCollectionCounter = 0;
                    funcSettings.trainingSetCounter = -1;
                }
                //trainState = trainChunkStates.CALCULATENEWLEARNINGRATE;
                trainData = new trainCollection(trainSettings.dataPerInput, trainSettings.dataSets, trainSettings.networkInputs);
                funcSettings.trainingSetCounter = 0; //reset the train counter because of the new data set
                funcSettings.trainingDataCollectionCounter++;
            }
            setImmediate(trainChunk, funcSettings); // put this function back in queue and leave it
            break;
        case trainChunkStates.CALCULATENEWLEARNINGRATE:
            // take around 100 samples of test data and calculate 
            // the % difference (100 - %correct) set the new 
            // learning rate and continue training
            testData = new trainCollection(testSettings.dataPerInput, testSettings.dataSets, testSettings.networkInputs);
            //? make new datasets?
            funcSettings.testScore += network.calculateScore(testData.getInputDatasetMatrixAt(funcSettings.testSetCounter), testData.getOutputDatasetMatrixAt(funcSettings.testSetCounter));
            funcSettings.testSetCounter ++;
            
            if(funcSettings.testSetCounter >= testSettings.itterationLoops)
            {
                funcSettings.score = funcSettings.testScore / (funcSettings.testSetCounter);
                trainSettings.learningRate *= 0.9;  //(100.0 - funcSettings.score) / 100;
                network.learningRate = trainSettings.learningRate;
                funcSettings.testItterationCounter ++;
                let xData = funcSettings.testItterationCounter + 0.0;
                let htmlData = 
                {
                    x: xData,
                    y: trainSettings.learningRate,
                    z: funcSettings.score
                };
                io.emit('getNewDataPoint', htmlData);
                htmlData = 
                {
                    x : testData.inputData[0][0].pointX,
                    y : testData.inputData[0][0].pointY,
                    z : testData.inputData[0][0].label
                };
                console.table(htmlData);
                if(funcSettings.score >= 99.99 || funcSettings.testItterationCounter >= 50) 
                {
                    trainState = trainChunkStates.TRAININGDONE;
                    funcSettings.testItterationCounter = 0;
                }
                else 
                {
                    trainData = new trainCollection(trainSettings.dataPerInput, trainSettings.dataSets, trainSettings.networkInputs);
                    trainState = trainChunkStates.TRAIN;
                }
                funcSettings.testSetCounter = 0;
                funcSettings.score = 0;
                funcSettings.testScore = 0;
            }
            // also send a socket.emit to display the changed learningrates

            setImmediate(trainChunk, funcSettings); // put this function back in queue and leave it
            break;
        case trainChunkStates.TRAININGDONE:
            console.log("training DONE!");
            console.log(`Score : ${funcSettings.score}`);
            trainState = trainChunkStates.SETUP;
            setImmediate(trainChunk, funcSettings); // put this function back in queue and leave it
            break;
        default:
            console.log("no state ...?!?!");
            break;
    }
}

trainChunk(trainChunkSettings);

setInterval(()=>
{
    io.emit('test', "WORKING!");
}, 500);

//===================================================================
//===================================================================
//===================================================================


function printSettings(_settings)
{
    console.log(`\ngoing to train on ${_settings.dataPerInput * _settings.dataSets} dots\n
            every dataset has ${_settings.dataPerInput} dots\n
            there are ${_settings.dataSets} datasets\n
            the network will train on ${_settings.amountOfLearningData} datasets\n
            every dataset will be itterated ${_settings.itterations} times\n
            this process will then be repeated for ${_settings.itterationLoops} times\n
            the total number of training dots = ${_settings.dataPerInput * _settings.amountOfLearningData}\n
            the total number of weight changes = ${_settings.networkInputs * _settings.dataPerInput * _settings.amountOfLearningData * _settings.itterations * _settings.itterationLoops}\n
            the network will be tested with ${_settings.amountOfTestData} datasets\n
            that is a total of ${_settings.amountOfTestData * _settings.dataPerInput} dots\n`
            );
}

setupExpress();
//testNetwork();