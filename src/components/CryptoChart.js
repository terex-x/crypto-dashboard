import React, { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

// Components
import { CryptoContext } from './Dashboard';

// Utils
import { formatPrice, generateBackgroundColor, generateChartData } from '../utils/utils';

// Styles
import './CryptoChart.scss';

export const CryptoChart = ({ id, vsCurrency, name }) => {
  const { cryptoMarketData, getPriceInCurrency } = useContext(CryptoContext);
  const [chartData, setChartData] = useState(generateChartData([]));
  const [prices, setPrices] = useState({
    low: 0,
    high: 0,
    current: 0,
    change: 0,
    changePercentage: 0,
  });

  useEffect(() => {
    const marketData = cryptoMarketData[vsCurrency]?.exchanges?.find((d) => (d.id === id)) ?? {};
    setPrices({
      low: marketData['low_24h'] ?? 0,
      high: marketData['high_24h'] ?? 0,
      current: marketData['current_price'] ?? 0,
      change: marketData['price_change_24h'] ?? 0,
      changePercentage: marketData['price_change_percentage_24h'] ?? 0,
    });
    let pricesIn24h = marketData['sparkline_in_7d']?.price?.slice(-23) ?? [];
    pricesIn24h = pricesIn24h.map((price) => getPriceInCurrency(price, vsCurrency));
    if (pricesIn24h.length === 23) {
      pricesIn24h.push(marketData['current_price']);
      setChartData(generateChartData(pricesIn24h))
    }
  }, [cryptoMarketData]);

  return (
    <div
      className='crypto-chart'
      style={{
        backgroundColor: generateBackgroundColor(prices.changePercentage),
      }}
    >
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            xAxis: {
              display: false,
            }
          },
          pointStyle: false,
          borderWidth: 1,
          borderColor: 'white',
          scales: {
            x: {
              ticks: {
                color: 'white',
                callback: (val, index) => (index > 0 ? chartData.labels[val] : ''),
                maxRotation: 0,
                minRotation: 0,
              },
              grid: {
                display: false
              },
              border: {
                color: 'white',
              },
            },
            y: {
              ticks: {
                display: false,
              },
              grid: {
                display: false
              },
              border:{
                display:false
              }
            },
          },
        }}
      />
      <div className='crypto-details'>
        <div className='details-left'>
          <span className='crypto-name'>{name}</span>
          <span className='price-current'>{formatPrice(prices.current)}</span>
        </div>
        <div className='details-right'>
          <span className='price-change'>{`${formatPrice(prices.changePercentage)}% ${prices.change > 0 ? '+' : ''}${formatPrice(prices.change)}`}</span>
          <span className='price-high'>{`H ${formatPrice(prices.high)}`}</span>
          <span className='price-low'>{`L ${formatPrice(prices.low)}`}</span>
        </div>
      </div>
    </div>
  );
};