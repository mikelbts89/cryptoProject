async function displayAboutPage() {
    mainDiv.html("")
    for (let i = 0; i < toogledCoinsName.length; i++) {
        try {
            const currentCoin = await getCrypto({
                url: `https://api.coingecko.com/api/v3/coins/${toogledCoinsName[i]}`
            });
            console.log(currentCoin);
            const coinName = currentCoin.name

            const coinId = currentCoin.id
            drawCard(coinName, coinId)
        } catch (err) {
            console.log(err);
        }
    }
}