import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import debounce from 'lodash.debounce';

// Components
import { CryptoChart } from './CryptoChart';
import { Overlay } from './Overlay';

// Utils
import { fetchCryptoMarketData, fetchCryptoExchangeData } from '../utils/apis';
import { isLatestData } from '../utils/utils';

// Styles
import './Dashboard.scss';

Chart.register(...registerables);

const MarketDataKey = 'crypto_market_data';
const ExchangeDataKey = 'crypto_exchange_data';

const chartsList = [
    {
        id: 'bitcoin',
        vsCurrency: 'usd',
        name: 'BTC/USD',
    },
    {
        id: 'litecoin',
        vsCurrency: 'usd',
        name: 'LTC/USD',
    },
    {
        id: 'ethereum',
        vsCurrency: 'usd',
        name: 'ETH/USD',
    },
    {
        id: 'ripple',
        vsCurrency: 'usd',
        name: 'XRP/USD',
    },
    {
        id: 'bitcoin-cash',
        vsCurrency: 'usd',
        name: 'BCH/USD',
    },
    {
        id: 'bitcoin',
        vsCurrency: 'eur',
        name: 'BTC/EUR',
    },
    {
        id: 'litecoin',
        vsCurrency: 'eur',
        name: 'LTC/EUR',
    },
    {
        id: 'ethereum',
        vsCurrency: 'eur',
        name: 'ETH/EUR',
    },
    {
        id: 'ripple',
        vsCurrency: 'eur',
        name: 'XRP/EUR',
    },
    {
        id: 'bitcoin-cash',
        vsCurrency: 'eur',
        name: 'BCH/EUR',
    },
    {
        id: 'usd-coin',
        vsCurrency: 'btc',
        name: 'USDC/BTC',
    },
    {
        id: 'litecoin',
        vsCurrency: 'btc',
        name: 'LTC/BTC',
    },
    {
        id: 'ethereum',
        vsCurrency: 'btc',
        name: 'ETH/BTC',
    },
    {
        id: 'ripple',
        vsCurrency: 'btc',
        name: 'XRP/BTC',
    },
    {
        id: 'bitcoin-cash',
        vsCurrency: 'btc',
        name: 'BCH/BTC',
    },
];

export const CryptoContext = createContext({});

export const Dashboard = () => {
  // store crypto data in localstorage for caching
  const [cryptoMarketData, setCryptoMarketData] = useState(JSON.parse(localStorage.getItem(MarketDataKey)) ?? {});
  const [cryptoExchangeData, setCryptoExchangeData] = useState(JSON.parse(localStorage.getItem(ExchangeDataKey)) ?? {});
  const [loadingMarketData, setLoadingMarketData] = useState(false);
  const [loadingExchangeData, setLoadingExchangeData] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadCryptoMarketData();
      loadCryptoExchangeData();
    }, 5 * 60 * 1000); // refresh the dashboard every 5 mins
    
    loadCryptoMarketData();
    loadCryptoExchangeData();

    return () => {
      clearInterval(intervalId);
    }
  }, []);

  const loadCryptoMarketData = debounce(useCallback(async () => {
    try {
      setLoadingMarketData(true);
      let newCryptoMarketData = { ...cryptoMarketData };
      for (const chartParams of chartsList) {
        const { vsCurrency } = chartParams;
        if (!newCryptoMarketData[vsCurrency] || !isLatestData(newCryptoMarketData[vsCurrency])) {
          const marketDataResponse = await fetchCryptoMarketData(vsCurrency);
          newCryptoMarketData = {
            ...newCryptoMarketData,
            [vsCurrency]: {
              exchanges: marketDataResponse,
              timestamp: new Date().getTime(),
            }
          };
        }
      }
      localStorage.setItem(MarketDataKey, JSON.stringify(newCryptoMarketData));
      setCryptoMarketData(newCryptoMarketData);
      setLoadingMarketData(false);
    } catch(err) {
      console.error('Error fetching data: ', err);
      setLoadingMarketData(false);
    }
  }, [cryptoMarketData]), 50);

  const loadCryptoExchangeData = debounce(useCallback(async () => {
    try {
      if (!cryptoExchangeData || !isLatestData(cryptoExchangeData)) {
        setLoadingExchangeData(true);
        const exchangeDataResponse = await fetchCryptoExchangeData();
        const newExchangeData = {
          ...exchangeDataResponse,
          timestamp: new Date().getTime(),
        }
        localStorage.setItem(ExchangeDataKey, JSON.stringify(newExchangeData));
        setCryptoExchangeData(newExchangeData);
        setLoadingExchangeData(false);
      }
    } catch(err) {
      console.error('Error fetching data: ', err);
      setLoadingExchangeData(false);
    }
  }, [cryptoExchangeData]), 50);

  const getPriceInCurrency = useCallback((priceInUSD, currencyType = 'usd') => {
    const btcToUSD = cryptoExchangeData.usd?.value;
    const btcToCurrency = cryptoExchangeData[currencyType]?.value;
    if (!btcToUSD || !btcToCurrency) {
      return 0;
    }
    if (currencyType === 'usd') {
      return priceInUSD;
    }
    return priceInUSD / btcToUSD * btcToCurrency;
  }, [cryptoExchangeData]);

  return (
    <CryptoContext.Provider value={{ cryptoMarketData, getPriceInCurrency }}>
      {(loadingMarketData || loadingExchangeData) && (
        <Overlay content='Loading...' />
      )}
      <div className='dashboard'>
        <h2 className='header'>CRYPTO DASHBOARD</h2>
        <div className='wrapper'>
          {chartsList.map(({ id, vsCurrency, name }) => (
            <CryptoChart
              key={name}
              id={id}
              vsCurrency={vsCurrency}
              name={name}
            />
          ))}
        </div>
      </div>
    </CryptoContext.Provider>
  );
};
