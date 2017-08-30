/**
 * Market Cap. ponderation of TOP Cryptos
 * Known bug : MkCap used is current one, don't move in history
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
        const symbols = [];
        const globalMcap = res.reduce((a, b) => { return a + parseFloat(b.market_cap_usd); }, 0);
        for (let i in res) {
            if (res[i].symbol != 'BTC') {
                if (typeof symbol_equivalents[res[i].symbol] != 'undefined') {
                    res[i].symbol = symbol_equivalents[res[i].symbol];
                }
                symbols.push('BTCUSD*' + res[i].symbol + 'BTC*' + res[i].market_cap_usd);
            } else {
                symbols.push('BTCUSD*' + res[i].market_cap_usd);
            }
        }
        let symbolsStr = '(' + symbols.join('+') + ')/' + globalMcap;
        window.location = 'https://www.tradingview.com/chart/?symbol=' + encodeURIComponent(symbolsStr);
    } else {
        console.error("Wrong response from CMC")
    }
};
request.onerror = () => { console.error("Connection Error") };
request.send();