const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchCryptoExchangeData = async () => {
    const response = await fetch(`${BASE_URL}/exchange_rates`);
    const responseJSON = await response.json();

    return responseJSON.rates;
}

export const fetchCryptoMarketData = async (vsCurrency) => {
    const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h&locale=en`);
    const responseJSON = await response.json();
    
    return responseJSON;
};