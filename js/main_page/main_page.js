const mainDiv = $(".main")
let checkedCoins = []
let savedCoins = []
let toogledCoinsName = []
const loaderRing = `<div class="lds-dual-ring"></div>`
const loaderRoller = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`
const myStorage = window.localStorage
mainDiv.append(loaderRing)

const saveToLocalStorage = () => {
    myStorage.setItem("coinName", JSON.stringify(toogledCoinsName))
    myStorage.setItem("toogled", JSON.stringify(checkedCoins))
}



if (myStorage.getItem("toogled") !== null) {
    checkedCoins = JSON.parse(myStorage.getItem("toogled"))
    toogledCoinsName = JSON.parse(myStorage.getItem("coinName"))
}



if (myStorage.getItem("coins") !== null) {
    savedCoins = JSON.parse(myStorage.getItem("coins"))
    setInterval(() => {
        myStorage.clear()
    }, 120000);

}

async function getContentFromApi() {
    mainDiv.html("")
    try {
        const result = await getCrypto({
            url: "https://api.coingecko.com/api/v3/coins/?_limit=100",
        });
        getDetails(result)
    } catch (err) {
        console.log(err);
    }
}

const searchCoin = async () => {
    let inputVal = $(".me-2").val()
    if (!inputVal) return
    mainDiv.html("")
    try {
        const currentCoin = await getCrypto({
            url: `https://api.coingecko.com/api/v3/coins/${inputVal}`
        });
        console.log(currentCoin);
        const coinName = currentCoin.name

        const coinId = currentCoin.id
        drawCard(coinName, coinId)
    } catch (err) {
        console.log(err);
    }
}

setTimeout(() => {
    getContentFromApi()
}, 1000);

function getDetails(coinsArr) {
    for (let key in coinsArr) {
        coinsNameArr = coinsArr[key].name;
        coinsIDArr = coinsArr[key].id;
        drawCard(coinsNameArr, coinsIDArr)
    }
}




////////////////////////////////// Card //////////////////////////////////////////


const drawCard = (name, id) => {
    mainDiv.append(`<div class="card" style="width: 18rem;">
    <div class="card-body">
    <label class="switch">
      <input  id="checkbox${id}" type="checkbox">
      <span class="slider round"></span>
    </label>
      <h5 class="card-title">${name}</h5>
      <p>
      <button id="moreInfo${id}" class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false" aria-controls="collapseExample">
       More info
      </button>
    </p>
    <div class="collapse" id="${id}">
   
      </div>
    </div>
    </div>
    </div>`)

    let checkbox = document.querySelector(`#checkbox${id}`)
    checkbox.addEventListener("click", () => {
        if (checkedCoins.length >= 5) {
            checkbox.checked = false

        }
        if (checkbox.checked && checkedCoins.length < 5) {
            toogledCoinsName.push(checkbox.parentElement.parentElement.children[3].id)
            checkedCoins.push(checkbox.id)
            saveToLocalStorage()

        } else {
            for (let i = 0; i < checkedCoins.length; i++) {
                if (checkedCoins[i] == checkbox.id) {
                    checkedCoins.splice(i, 1)
                    toogledCoinsName.splice(i, 1)
                    saveToLocalStorage()

                }
            }
        }
    })

    let moreInfoDiv = document.querySelector(`#${id}`)
    moreInfoDiv.addEventListener("shown.bs.collapse", async (e) => {
        moreInfoDiv.innerHTML = loaderRoller
        let checker12 = savedCoins.find(coin => {
            if (coin.id === e.target.id) {
                return true
            } else {
                return false
            }
        })
        if (checker12) {
            let currentCoin = savedCoins.find(coin => coin.id === e.target.id)
            moreInfoDiv.innerHTML = `<div class="card card-body">
            <img class="coin_img" src=${currentCoin.image.small}>
            <p> Current Price :</br>${currentCoin.market_data.current_price.ils} ₪
            </br> ${currentCoin.market_data.current_price.eur} €
            </br> ${currentCoin.market_data.current_price.usd} $</p>
            </div>`
        } else {
            setTimeout(async () => {
                try {
                    const coinMoreInfo = await getCrypto({
                        url: `https://api.coingecko.com/api/v3/coins/${e.target.id}`
                    });
                    coinMoreInfo.currentTime = Date.parse(new Date())
                    savedCoins.push(coinMoreInfo)
                    myStorage.setItem("coins", JSON.stringify(savedCoins))
                    moreInfoDiv.innerHTML = `<div class="card card-body">
              <img class="coin_img" src=${coinMoreInfo.image.small}>
              <p> Current Price :</br>${coinMoreInfo.market_data.current_price.ils} ₪
              </br> ${coinMoreInfo.market_data.current_price.eur} €
              </br> ${coinMoreInfo.market_data.current_price.usd} $</p>
              </div>`
                } catch (err) {
                    console.log(err)
                }


            }, 1000);
        }


    })

}