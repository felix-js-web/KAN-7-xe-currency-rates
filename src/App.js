import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('USD');

  const currencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CHF', 'CNY'];

  const fetchRates = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Using exchangerate-api as XE doesn't provide free API
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      const data = await response.json();
      
      if (data.rates) {
        setRates(data.rates);
      } else {
        setError('Failed to fetch rates');
      }
    } catch (err) {
      setError('Error fetching currency rates: ' + err.message);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, [baseCurrency]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>XE Currency Rates</h1>
        <p>Live Exchange Rates</p>
      </header>

      <div className="controls">
        <label>
          Base Currency:
          <select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>
            {currencies.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </label>
        <button onClick={fetchRates} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Rates'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="rates-grid">
        {Object.entries(rates)
          .filter(([currency]) => currencies.includes(currency) && currency !== baseCurrency)
          .map(([currency, rate]) => (
            <div key={currency} className="rate-card">
              <div className="currency-pair">
                {baseCurrency}/{currency}
              </div>
              <div className="rate-value">
                {parseFloat(rate).toFixed(4)}
              </div>
            </div>
          ))}
      </div>

      <footer>
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}

export default App;