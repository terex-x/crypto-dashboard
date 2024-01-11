# Cryptocurrency Market Dashboard

## Overview
This standalone Vercel application replicates a cryptocurrency market dashboard, displaying historical data for various cryptocurrencies in a responsive grid layout. Each cell in the grid represents an individual chart for a cryptocurrency, with the color theme reflecting the daily percentage change.

## Features
- **Responsive Grid Layout**: Mirrors the design of the provided image, with each cell representing a different cryptocurrency.
- **Color-Themed Charts**: Green for positive daily changes and red for negative ones.
- **Data Integration**: Uses [CoinGecko API](https://api.coingecko.com/api/v3) to source historical cryptocurrency data.
- **Detailed Information Display**: For each cryptocurrency, the dashboard shows:
  - Name
  - Ticker symbol
  - Current price
  - Daily price change (percentage and absolute terms)
- **Interactive Charts**: Display price fluctuation over the last 24 hours, including high and low price indicators.

### Running the Application
1. To start the development server:
   ```bash
   npm start
   ```
2. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment
Deploy Link: [https://crypto-dashboard-smoky.vercel.app/](https://crypto-dashboard-smoky.vercel.app/)
Project Link: [https://github.com/terex-x/crypto-dashboard](https://github.com/terex-x/crypto-dashboard)

## Contact
James Edmiston [jms.edmiston.dev@gmail.com](mailto:jms.edmiston.dev@gmail.com)
