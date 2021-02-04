///////////// main div ////////////////

const mainDiv = $(".main");

//////////// Arrays for local Storage ///////////

let checkedCheckbox = [];
let savedCoins = [];
let toogledCoinsData = [];

///////////////// Loaders /////////////////

const loaderRing = `<div class="lds-dual-ring"></div>`;
const loaderRoller = `<div class="lds-roller"><div></div>
<div></div><div></div><div></div><div></div><div></div><div>
</div><div></div></div>`;

////////////// Local Storage ////////////////////

const myStorage = window.localStorage;

const saveToLocalStorage = () => {
  myStorage.setItem("coinName", JSON.stringify(toogledCoinsData));
  myStorage.setItem("toogled", JSON.stringify(checkedCheckbox));
};

if (myStorage.getItem("toogled") !== null) {
  checkedCheckbox = JSON.parse(myStorage.getItem("toogled"));
  toogledCoinsData = JSON.parse(myStorage.getItem("coinName"));
}

if (myStorage.getItem("coins") !== null) {
  savedCoins = JSON.parse(myStorage.getItem("coins"));
}

/////////// Starting Loader //////////////

mainDiv.append(loaderRing);

////////////// API Call for all Coins //////////////

async function getContentFromApi() {
  mainDiv.html("");
  try {
    const result = await getCrypto({
      url: "https://api.coingecko.com/api/v3/coins/?_limit=100",
    });
    getDetails(result);
  } catch (err) {
    console.log(err);
  }
}

//////////// API Call for Searched coin ////////////////

const searchCoin = async () => {
  $(".navbar-collapse").removeClass("show");
  let inputVal = $(".me-2").val();
  if (!inputVal) return;
  mainDiv.html("");
  try {
    const currentCoin = await getCrypto({
      url: `https://api.coingecko.com/api/v3/coins/${inputVal}`,
    });

    drawCard(currentCoin);
  } catch (err) {
    console.log(err);
  }
};

///////// time out for UI Simulate waiting API request /////////

setTimeout(() => {
  getContentFromApi();
}, 1000);

////////////// map loop on coins Arr ////////////////

function getDetails(coinsArr) {
  coinsArr.map((item) => drawCard(item));
}

////////////////////////////////// Card Drawing Function //////////////////////////////////////////

const drawCard = (item) => {
  ////////////// Card ////////////////////

  mainDiv.append(`<div class="card" style="width: 18rem;">
    <div class="card-body">
    <label class="switch">
      <input id="checkbox${item.id}" 
   type="checkbox">
      <span class="slider round"></span>
    </label>
      <h5 class="card-title">${item.name}</h5>
      <p>
      <button id="moreInfo${item.id}" class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${item.id}" aria-expanded="false" aria-controls="collapseExample">
       More info
      </button>
    </p>
    <div class="collapse" id="${item.id}">
   
      </div>
    </div>
    </div>
    </div>`);

  //////////////// Toggle button /////////////////////

  let checkbox = document.querySelector(`#checkbox${item.id}`);
  checkbox.addEventListener("change", () => {
     if (checkedCheckbox.length > 4) {
       alert("you can choose no more than 5 coins");
       checkbox.checked = false;
     }
    if (checkbox.checked) {
      toogledCoinsData.push(item);
      checkedCheckbox.push(checkbox.id);
      saveToLocalStorage();
    } else {
      checkedCheckbox.map((item, i) => {
        if (item == checkbox.id) {
          checkedCheckbox.splice(i, 1);
          toogledCoinsData.splice(i, 1);
          saveToLocalStorage();
        }
      });
    }
  });
  toogledCoinsData.map((name) => {
    if (item.id == name.id) {
      checkbox.checked = true;
    }
  });

  ////////////////// More Info Button //////////////////

  let moreInfoDiv = document.querySelector(`#${item.id}`);
  moreInfoDiv.addEventListener("shown.bs.collapse", async (e) => {
    moreInfoDiv.innerHTML = loaderRoller;
    let checkIfDataSavedinLocal = savedCoins.find((coin) => {
      if (coin.id === e.target.id) {
        return true;
      } else {
        return false;
      }
    });
    if (checkIfDataSavedinLocal) {
      let currentCoin = savedCoins.find((coin) => coin.id === e.target.id);
      moreInfoDiv.innerHTML = `<div class="card card-body">
            <img class="coin_img" src=${currentCoin.image.small}>
            <p> Current Price :</br>${currentCoin.market_data.current_price.ils} ₪
            </br> ${currentCoin.market_data.current_price.eur} €
            </br> ${currentCoin.market_data.current_price.usd} $</p>
            </div>`;
    } else {
      setTimeout(async () => {
        // time out for UI Simulate waiting API request //
        try {
          const coinMoreInfo = await getCrypto({
            url: `https://api.coingecko.com/api/v3/coins/${e.target.id}`,
          });
          savedCoins.push(coinMoreInfo);
          myStorage.setItem("coins", JSON.stringify(savedCoins));
          setTimeout(() => {
            savedCoins.splice(coinMoreInfo, 1);
            myStorage.setItem("coins", JSON.stringify(savedCoins));
          }, 60000);
          moreInfoDiv.innerHTML = `<div class="card card-body">
              <img class="coin_img" src=${coinMoreInfo.image.small}>
              <p> Current Price :</br>${coinMoreInfo.market_data.current_price.ils} ₪
              </br> ${coinMoreInfo.market_data.current_price.eur} €
              </br> ${coinMoreInfo.market_data.current_price.usd} $</p>
              </div>`;
        } catch (err) {
          console.log(err);
        }
      }, 1000);
    }
  });
};
