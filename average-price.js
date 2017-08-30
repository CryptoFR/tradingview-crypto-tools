/**
 * Average price for the actual Top Cryptos in USD
 */
const howMany = 10; // How many in the top ?
const symbols = [];
const symbol_equivalents = { // Symbol translations from CMC to TV
    MIOTA: 'IOT'
};

const request = new XMLHttpRequest();
request.open('GET', 'https://api.coinmarketcap.com/v1/ticker/?limit=' + howMany, true);
request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
        const res = JSON.parse(request.responseText);
        for (let i in res) {
            if (res[i].symbol != 'BTC') {
                if (typeof symbol_equivalents[res[i].symbol] != 'undefined') {
                    res[i].symbol = symbol_equivalents[res[i].symbol];
                }
                symbols.push(res[i].symbol + 'BTC');
            }
        }
        let symbolsStr = 'BTCUSD*(' + symbols.join('+') + '+1)/' + res.length;
        window.location = 'https://www.tradingview.com/chart/?symbol=' + encodeURIComponent(symbolsStr);
    } else {
        console.error("Wrong response from CMC")
    }
};
request.onerror = () => { console.error("Connection Error") };
request.send();