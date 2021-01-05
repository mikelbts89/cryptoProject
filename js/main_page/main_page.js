const mainDiv = $(".main")


async function getContentFromApi() {
    try {
        const result = await getCrypto({
            url: "https://api.coingecko.com/api/v3/coins/?_limit=100",
        });
        console.log(result);
        getDetails(result)
    } catch (err) {
        console.log(err);
    }
}

window.onload = getContentFromApi()

function getDetails(coinsArr) {
    for (let key in coinsArr) {
        coinsNameArr = coinsArr[key].name;
        coinsImgArr = coinsArr[key].image.small;
        coinsIDArr = coinsArr[key].id;
        drawCard(coinsNameArr, coinsImgArr, coinsIDArr)
    }
}

const drawCard = (name, img, id) => {
    mainDiv.append(`<div class="card" style="width: 18rem;">
<div class="card-body">
<label class="switch">
  <input id="${id}" type="checkbox">
  <span class="slider round"></span>
</label>
  <h5 class="card-title">${name}</h5>
  <p>
  <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false" aria-controls="collapseExample">
   More info
  </button>
</p>
<div class="collapse" id="${id}">
  <div class="card card-body">
  <img src=${img}>
  </div>
</div>
</div>
</div>`)
    let inputToggle = $(`#${id}`)
    inputToggle.change(() => {
        console.log(inputToggle)
    })
}