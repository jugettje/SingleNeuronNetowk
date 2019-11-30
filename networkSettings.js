const settings = 
{
    settingsTemplate : 
    {
        dataPerInput : 25,
        dataSets : 50,
        networkInputs : 3,
        learningRate : 0.01,
        itterations : 500,
        amountOfLearningData : 5,
        itterationLoops : 10,
        amountOfTestData : 25
    },

    settingsHeavyTask : 
    {
        dataPerInput : 1000,
        dataSets : 50000,
        networkInputs : 3,
        learningRate : 0.01,
        itterations : 500,
        amountOfLearningData : 100,
        itterationLoops : 10,
        amountOfTestData : 49900
    },

    settingsOptimal : 
    {
        dataPerInput : 1000,
        dataSets : 5000,
        networkInputs : 3,
        learningRate : 0.02,
        itterations : 50,
        amountOfLearningData : 100,
        itterationLoops : 1,
        amountOfTestData : 4900
    },

    settingsNonBlockingTraining : 
    {
        dataPerInput : 2000,
        dataSets : 200,
        networkInputs : 3,
        learningRate : 0.02,
        itterations : 10,
        amountOfLearningData : 200,
        itterationLoops : 2,
        amountOfTestData : 0
    },

    settingsNonBlockingTesting : 
    {
        dataPerInput : 2000,
        dataSets : 2000,
        networkInputs : 3,
        learningRate : 0.02,
        itterations : 0,
        amountOfLearningData : 0,
        itterationLoops : 5,
        amountOfTestData : 2000
    },

    settingsTest : 
    {
        dataPerInput : 50,
        dataSets : 1000,
        networkInputs : 3,
        learningRate : 0.01,
        itterations : 100,
        amountOfLearningData : 100,
        itterationLoops : 20,
        amountOfTestData : 900
    }
}

module.exports = settings;