
let dataSize = 2;
let xArray = [1,2];
let yArray = [2,3];
let zArray = [3,4];
let traceText = ['a', 'b'];

top.glob.emit('test', 'tested in plotter');

var traceTemplate = {
  x: [],
  y: [],
  z: [], 
  mode: 'markers',
  marker: {
    size: 5,
    line: {
      color: 'rgba(217, 217, 217, 0.14)',
      width: 0.5
    },
    opacity: 0.8
  },
  type: 'scatter3d'
};

let trace3 = 
{
    x: [],  y: [], z: [],
    text: traceText, 
    mode: 'markers',
    marker: {
    color: 'rgb(217, 217, 217)',
    size: 5,
    symbol: 'circle',
    line: {
        color: 'rgb(204, 204, 204)',
        width: 1
    },
    opacity: 0.9
    },
    type: 'scatter3d'
};
var data = [trace3];
var layout = {
      dragmode: true,
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
  },
    scene : {
        xaxis: {title: 'x as'},
        yaxis: {title: 'y as'},
        zaxis: {title: 'z as'}
    }};

//Plotly.newPlot('graph2', [trace1, trace2], layout, {showSendToCloud: true});

function addData()
{
  let testData = {
    x: [[Math.random()*10]],
    y: [[Math.random()*10]],
    z: [[Math.random()*10]]
  };
  console.log('added data?');  
    Plotly.extendTraces('graph1', testData, [0]);          
}

let colorArray = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb 	(255,255,0)', 'rgb(255,255,255)',
                  'rgb(255,0,255)', 'rgb(192,192,192)', 'rgb(128,0,0)', 'rgb(128,128,0)', 'rgb(128,0,128)',];
let traceArray = new Array(10);
let traceCounter = 0;
for(let i = 0; i < traceArray.length; i++)
{
  traceArray[i] = {
    x: [],
    y: [],
    z: [], 
    mode: 'lines',
    marker: {
      size: 5,
      line: {
        color: 'rgba(217, 217, 217, 0.14)',
        width: 0.5
      },
      opacity: 0.8
    },
    type: 'scatter3d'
  };
  console.log(traceArray[i]);
  traceArray[i].color = colorArray[i];
}
console.table(traceArray);

top.glob.on('getNewDataPoint', (msg)=>
        {
          let testData = {
            x: [[msg.x]],
            y: [[msg.y]],
            z: [[msg.z]]
          };

          traceArray[traceCounter].x.push(msg.x);
          traceArray[traceCounter].y.push(msg.y);
          traceArray[traceCounter].z.push(msg.z);
          
          Plotly.extendTraces('graph1', testData, [traceCounter])
          if(msg.x >= 300 || msg.z >= 99.99)
          {
            //Plotly.newPlot('graph1', traceArray, layout, {showSendToCloud: true});
            console.log(traceCounter);
            traceCounter ++;
          }
          if(traceCounter >= 10)
          {
            traceCounter = 0;
          }

            console.log(msg);
});

Plotly.newPlot('graph1', traceArray, layout);