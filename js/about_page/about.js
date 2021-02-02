let coinsDataArray = [];

async function displayAboutPage() {
  myStorage.removeItem("livereport");
  mainDiv.html("");
  mainDiv.html(
    `    <div id="chartContainer" style="height: 500px; width: 100%;"></div>`,
  );

  for (let i = 0; i < toogledCoinsData.length; i++) {
    try {
      const currentCoin = await getCrypto({
        url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${toogledCoinsData[i].symbol}&tsyms=USD,EUR`,
      });
      let coinsData = Object.values(currentCoin);
      coinsDataArray.push(coinsData[0].USD);
      myStorage.setItem("livereport", JSON.stringify(coinsDataArray));
    } catch (err) {
      console.log(err);
    }
  }
  liveCoinsReport();
}

console.log(coinsDataArray);

const liveCoinsReport = () => {
  if (toogledCoinsData.length === 0){
    alert("you need to toggle one or more coins");
    
  }
  var options = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: `Coins Value Over Time`,
    },
    subtitles: [
      {
        text: "",
      },
    ],
    axisX: {
      title: "Real Time (in sec)",
    },
    axisY: {
      title: "Coin Value (in USD $)",
      titleFontColor: "#4F81BC",
      lineColor: "#4F81BC",
      labelFontColor: "#4F81BC",
      tickColor: "#4F81BC",
    },
    axisY2: {
      title: "Profit in USD",
      titleFontColor: "#C0504E",
      lineColor: "#C0504E",
      labelFontColor: "#C0504E",
      tickColor: "#C0504E",
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: "pointer",
      itemclick: toggleDataSeries,
    },
    data: [],
  };
  for (let i = 0; i < toogledCoinsData.length; i++) {
    options.data.push({
      type: "spline",
      name: `${toogledCoinsData[i].symbol.toUpperCase()}`,
      showInLegend: true,
      dataPoints: [],
    });
    options.subtitles[0].text += `${toogledCoinsData[
      i
    ].symbol.toUpperCase()}, `;
  }

  setInterval(() => {
    let currentTime = new Date().toLocaleTimeString();

    for (let i = 0; i < coinsDataArray.length; i++) {
      let myCoin = options.data[i].dataPoints;
      myCoin.push({ y: coinsDataArray[i], label: currentTime });
    }

    $("#chartContainer").CanvasJSChart(options);
  }, 2000);

  function toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  }
};

// const reportsLive = async () => {
//   try {
//     clearInterval(myReportsInterval);
//     activating("reports");
//     const divContent = document.querySelector(".my-content");
//     divContent.innerHTML = "";
//     divContent.innerHTML = `<div id="chartContainer" class="my-chart-report"></div>`;

//     //this is the graph template,where the whole chart is built
//     var options = {
//       animationEnabled: true,
//       title: { text: `Coins Value Over Time` },
//       subtitles: [{ text: `` }],
//       axisX: {
//         title: "Real Time (in sec)",
//         titleFontColor: "#C0504E",
//         lineColor: "#C0504E",
//         labelFontColor: "#C0504E",
//         tickColor: "#C0504E",
//       },
//       axisY: {
//         title: "Coin Value (in USD $)",
//         titleFontColor: "#4F81BC",
//         lineColor: "#4F81BC",
//         labelFontColor: "#4F81BC",
//         tickColor: "#4F81BC",
//       },
//       toolTip: { shared: true },
//       legend: {
//         //this makes the legend dynamic,
//         //using the "toggleDataSeries" that is a few line after:
//         cursor: "pointer",
//         itemclick: toggleDataSeries,
//       },
//       //this is the graph data where the graph for each coins is build:
//       data: [],
//     };
//     var chart = new CanvasJS.Chart("chartContainer", options);

//     if (coinsSymbol.length === 0)
//       throw "Sorry, you need to choose coins for this function";
//     //this is how I insert the info for each coin:
//     for (let i = 0; i < coinsSymbol.length; i++) {
//       options.data.push({
//         type: "spline",
//         name: `${coinsSymbol[i].symbol.toUpperCase()}`,
//         showInLegend: true,
//         dataPoints: [],
//       });
//       options.subtitles[0].text += `${coinsSymbol[i].symbol.toUpperCase()}, `;
//     }
//     let theSlice = options.subtitles[0].text.slice(0, -2);
//     options.subtitles[0].text = theSlice;

//     //this function been called every 2 sec, asking for the info by the "GET" method
//     const updateChart = async () => {
//       //the "mySelectedCoins" is getting the info, "listOfCoins()" building the url:
//       let mySelectedCoins = await listOfCoins();

//       //"coinsValues" is creating [] to just the values of the info,
//       //this info will be the y value:
//       let coinsObj = Object.values(mySelectedCoins);
//       let coinsValues = [];
//       coinsObj.forEach((coin) => coinsValues.push(coin.USD));

//       //is creating the current time for x values:
//       let myTime = new Date().toLocaleTimeString();

//       //this for loop is pushing the info for each coin. for both x, y values:
//       for (let i = 0; i < coinsValues.length; i++) {
//         if (options.data[i] === undefined) {
//           errorWithCoin("Sorry, you need to choose coins for this function");
//         }
//         let myCoin = options.data[i].dataPoints;
//         myCoin.push({ y: coinsValues[i], label: myTime });
//       }
//       //making sure the info will show on screen:
//       chart.render();
//     };

//     //this function is creating the legend,
//     //from witch you could remove or add the graph for each coin
//     function toggleDataSeries(e) {
//       if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
//         e.dataSeries.visible = false;
//       } else {
//         e.dataSeries.visible = true;
//       }
//       e.chart.render();
//     }
//     //making sure the info will show on screen:
//     chart.render();
//     //the interval:
//     myReportsInterval = setInterval(() => updateChart(), 2000);
//   } catch (error) {
//     //if you didn't toggled-on any coins:
//     errorWithCoin(error);
//   }
// };
