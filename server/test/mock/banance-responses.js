// https://api.binance.com/api/v1/exchangeInfo
const info = {
    timezone: 'UTC',
    serverTime: 1533050802891,
    symbols: [
        {
            symbol: 'ETHBTC',
            status: 'TRADING',
            baseAsset: 'ETH',
            baseAssetPrecision: 8,
            quoteAsset: 'BTC',
            quotePrecision: 8,
        },
        {
            symbol: 'EOSETH',
            status: 'TRADING',
            baseAsset: 'EOS',
            baseAssetPrecision: 8,
            quoteAsset: 'ETH',
            quotePrecision: 8,
        },
        {
            symbol: 'ETHUSDT',
            status: 'TRADING',
            baseAsset: 'ETH',
            baseAssetPrecision: 8,
            quoteAsset: 'USDT',
            quotePrecision: 8,
        }],
};

// https://api.binance.com/api/v3/ticker/price
const ticker = [
    {
        symbol: 'ETHBTC',
        price: '0.05558900',
    },
    {
        symbol: 'EOSETH',
        price: '0.01684600',
    },
    {
        symbol: 'ETHUSDT',
        price: '430.30000000',
    },
];

const formattedTicker = {
    ETH: {
        BTC: {
            last_price: '0.05558900',
        },
        USDT: {
            last_price: '430.30000000',
        },
    },
    EOS: {
        ETH: {
            last_price: '0.01684600',
        },
    },
};


module.exports = {
    info,
    ticker,
    formattedTicker,
};
