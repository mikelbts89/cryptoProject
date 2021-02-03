async function displayAboutPage() {
  if (toogledCoinsData.length === 0) {
    alert("you need to toggle one or more coins");
  } else {
    $(".navbar").collapse("hide");
    getCoinsData();
    liveCoinsReport();
  }
}

const getCoinsData = async () => {
  try {
    let coinsData = toogledCoinsData.map((coin) => coin.symbol);
    const currentCoin = await getCrypto({
      url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsData}&tsyms=USD,EUR`,
    });
    return currentCoin;
  } catch (err) {
    console.log(err);
  }
};

const liveCoinsReport = () => {
  mainDiv.html("");
  mainDiv.html(
    `    <div id="chartContainer" style="height: 40rem; width: 100%;"></div>`,
  );
  var options = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: `Crypto Value`,
    },
    subtitles: [
      {
        text: "",
      },
    ],
    axisX: {
      title: "Time Line",
    },
    axisY: {
      title: "Value in $",
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
  setInterval(async () => {
    let result = await getCoinsData();
    let objVal = Object.values(result);
    let coinsDataArray = [];
    objVal.forEach((element) => {
      coinsDataArray.push(element.USD);
    });
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
