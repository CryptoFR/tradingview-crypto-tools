/**
 * Market Cap Evolution
 * Known bug : don't reduce the supply in history
 */
const howMany = 10; // Cryptos in TOP #...
const symbol_equivalents = { // Symbol translations from CMC to TV
    MIOTA: 'IOT'
};

const request = new XMLHttpRequest();
request.open('GET', 'https://api.coinmarketcap.com/v1/ticker/?limit=' + howMany, true);
request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
        const res = JSON.parse(request.responseText);
        const symbolsOps = [];
        let btcMkCap = 0;
        for (let i in res) {
            if (res[i].symbol != 'BTC') {
                if (typeof symbol_equivalents[res[i].symbol] != 'undefined') {
                    res[i].symbol = symbol_equivalents[res[i].symbol];
                }
                symbolsOps.push(res[i].symbol + 'BTC*' + res[i].available_supply);
            } else {
                btcMkCap = res[i].symbol + 'USD*' + res[i].available_supply;
            }
        }
        let symbolsStr = 'BTCUSD*(' + symbolsOps.join('+') + ')+' + btcMkCap;
        window.location = 'https://www.tradingview.com/chart/?symbol=' + encodeURIComponent(symbolsStr);
    } else {
        console.error("Wrong response from CMC")
    }
};
request.onerror = () => { console.error("Connection Error") };
request.send();