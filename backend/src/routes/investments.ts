import express from 'express';
const router = express.Router();

// Investment data by country with more detailed and realistic data
const investmentData: any = {
  India: {
    currency: 'INR',
    stockMarket: {
      name: 'NSE/BSE',
      topPicks: [
        { name: 'TCS', price: '₹3,420', change: '+2.3%', sector: 'IT' },
        { name: 'Reliance', price: '₹2,890', change: '+1.8%', sector: 'Energy' },
        { name: 'HDFC Bank', price: '₹1,650', change: '+0.9%', sector: 'Banking' },
        { name: 'Infosys', price: '₹1,420', change: '-0.5%', sector: 'IT' },
        { name: 'ITC', price: '₹480', change: '+1.2%', sector: 'FMCG' }
      ],
      returns: '12-15%',
      marketCap: '₹280L Cr'
    },
    fixedDeposits: {
      topBanks: [
        { bank: 'SBI', rate: '7.1%', tenure: '1-5 years', minAmount: '₹1,000' },
        { bank: 'HDFC', rate: '7.0%', tenure: '1-10 years', minAmount: '₹5,000' },
        { bank: 'ICICI', rate: '6.9%', tenure: '1-5 years', minAmount: '₹1,000' },
        { bank: 'Axis', rate: '6.8%', tenure: '1-10 years', minAmount: '₹2,500' }
      ],
      avgReturns: '6.5-7.5%',
      taxBenefit: 'Section 80C up to ₹1.5L'
    },
    crypto: {
      trending: [
        { name: 'Bitcoin', price: '$43,250', change: '+5.2%', marketCap: '$850B' },
        { name: 'Ethereum', price: '$2,680', change: '+3.8%', marketCap: '$320B' },
        { name: 'Solana', price: '$98', change: '+12.5%', marketCap: '$42B' }
      ],
      risk: 'High',
      regulation: 'Under SEBI review'
    },
    mutualFunds: {
      recommended: [
        { name: 'Axis Bluechip', type: 'Large Cap', returns3y: '14.2%', risk: 'Moderate' },
        { name: 'Mirae Asset Large Cap', type: 'Large Cap', returns3y: '15.8%', risk: 'Moderate' },
        { name: 'Parag Parikh Flexi Cap', type: 'Multi Asset', returns3y: '16.5%', risk: 'Moderate' }
      ],
      returns: '10-12%',
      aum: '₹12L Cr'
    },
    bonds: [
      { name: 'G-Secs', yield: '7.2%', maturity: '5-30 years', credit: 'AAA' },
      { name: 'AAA Bonds', yield: '8-9%', maturity: '3-10 years', credit: 'AAA' }
    ]
  },
  USA: {
    currency: 'USD',
    stockMarket: {
      name: 'NYSE/NASDAQ',
      topPicks: [
        { name: 'Apple', price: '$180', change: '+2.1%', sector: 'Tech' },
        { name: 'Microsoft', price: '$380', change: '+1.8%', sector: 'Tech' },
        { name: 'Amazon', price: '$155', change: '+3.2%', sector: 'E-commerce' },
        { name: 'Google', price: '$140', change: '+1.5%', sector: 'Tech' },
        { name: 'Tesla', price: '$250', change: '+4.5%', sector: 'Auto' }
      ],
      returns: '10-12%',
      marketCap: '$40T'
    },
    fixedDeposits: {
      topBanks: [
        { bank: 'Chase', rate: '4.5%', tenure: '1-5 years', minAmount: '$1,000' },
        { bank: 'Bank of America', rate: '4.3%', tenure: '1-5 years', minAmount: '$500' },
        { bank: 'Wells Fargo', rate: '4.2%', tenure: '1-5 years', minAmount: '$1,000' }
      ],
      avgReturns: '4-5%',
      taxBenefit: 'Taxable'
    },
    crypto: {
      trending: [
        { name: 'Bitcoin', price: '$43,250', change: '+5.2%' },
        { name: 'Ethereum', price: '$2,680', change: '+3.8%' },
        { name: 'Cardano', price: '$0.45', change: '+2.1%' }
      ],
      risk: 'High'
    },
    mutualFunds: {
      recommended: [
        { name: 'Vanguard S&P 500', type: 'Index', returns3y: '12.5%', risk: 'Moderate' },
        { name: 'Fidelity 500 Index', type: 'Index', returns3y: '12.3%', risk: 'Moderate' },
        { name: 'SPDR S&P 500', type: 'ETF', returns3y: '12.4%', risk: 'Moderate' }
      ],
      returns: '9-11%'
    },
    bonds: [
      { name: 'Treasury Bonds', yield: '4.5%', maturity: '2-30 years', credit: 'AAA' },
      { name: 'Investment Grade Bonds', yield: '5-6%', maturity: '5-10 years', credit: 'AAA' }
    ]
  },
  UK: {
    currency: 'GBP',
    stockMarket: {
      name: 'LSE',
      topPicks: [
        { name: 'Shell', price: '£22', change: '+1.2%', sector: 'Energy' },
        { name: 'AstraZeneca', price: '£85', change: '+0.8%', sector: 'Pharma' },
        { name: 'HSBC', price: '£6', change: '+1.5%', sector: 'Banking' },
        { name: 'Unilever', price: '£40', change: '+0.5%', sector: 'Consumer' },
        { name: 'BP', price: '£4', change: '+2.1%', sector: 'Energy' }
      ],
      returns: '8-10%',
      marketCap: '£4T'
    },
    fixedDeposits: {
      topBanks: [
        { bank: 'Barclays', rate: '4.8%', tenure: '1-5 years', minAmount: '£1,000' },
        { bank: 'HSBC', rate: '4.5%', tenure: '1-5 years', minAmount: '£500' },
        { bank: 'Lloyds', rate: '4.3%', tenure: '1-5 years', minAmount: '£1,000' }
      ],
      avgReturns: '4-5%',
      taxBenefit: 'Taxable'
    },
    crypto: {
      trending: [
        { name: 'Bitcoin', price: '£32,000', change: '+5.2%' },
        { name: 'Ethereum', price: '£2,000', change: '+3.8%' },
        { name: 'Ripple', price: '£0.35', change: '+2.1%' }
      ],
      risk: 'High'
    },
    mutualFunds: {
      recommended: [
        { name: 'Vanguard FTSE 100', type: 'Index', returns3y: '8.5%', risk: 'Moderate' },
        { name: 'iShares Core FTSE 100', type: 'ETF', returns3y: '8.3%', risk: 'Moderate' },
        { name: 'L&G UK Index', type: 'Index', returns3y: '8.4%', risk: 'Moderate' }
      ],
      returns: '7-9%'
    },
    bonds: [
      { name: 'Gilts', yield: '4.2%', maturity: '5-50 years', credit: 'AAA' },
      { name: 'IG Bonds', yield: '5-6%', maturity: '5-15 years', credit: 'AAA' }
    ]
  },
  Canada: {
    currency: 'CAD',
    stockMarket: {
      name: 'TSX',
      topPicks: [
        { name: 'Royal Bank', price: 'CAD$120', change: '+1.2%', sector: 'Banking' },
        { name: 'TD Bank', price: 'CAD$80', change: '+0.8%', sector: 'Banking' },
        { name: 'Shopify', price: 'CAD$90', change: '+3.5%', sector: 'Tech' },
        { name: 'Enbridge', price: 'CAD$55', change: '+1.1%', sector: 'Energy' },
        { name: 'CNR', price: 'CAD$150', change: '+2.0%', sector: 'Rail' }
      ],
      returns: '9-11%',
      marketCap: 'CAD$3T'
    },
    fixedDeposits: {
      topBanks: [
        { bank: 'TD', rate: '4.5%', tenure: '1-5 years', minAmount: 'CAD$1,000' },
        { bank: 'RBC', rate: '4.3%', tenure: '1-5 years', minAmount: 'CAD$500' },
        { bank: 'Scotiabank', rate: '4.2%', tenure: '1-5 years', minAmount: 'CAD$1,000' }
      ],
      avgReturns: '4-5%',
      taxBenefit: 'Taxable'
    },
    crypto: {
      trending: [
        { name: 'Bitcoin', price: 'CAD$55,000', change: '+5.2%' },
        { name: 'Ethereum', price: 'CAD$3,500', change: '+3.8%' },
        { name: 'Polkadot', price: 'CAD$25', change: '+2.1%' }
      ],
      risk: 'High'
    },
    mutualFunds: {
      recommended: [
        { name: 'TD Canadian Index', type: 'Index', returns3y: '10.5%', risk: 'Moderate' },
        { name: 'RBC Canadian Equity', type: 'Equity', returns3y: '10.3%', risk: 'Moderate' },
        { name: 'BMO S&P/TSX', type: 'ETF', returns3y: '10.4%', risk: 'Moderate' }
      ],
      returns: '8-10%'
    },
    bonds: [
      { name: 'Canada Bonds', yield: '4.0%', maturity: '2-30 years', credit: 'AAA' },
      { name: 'IG Corporate Bonds', yield: '5-6%', maturity: '5-10 years', credit: 'AAA' }
    ]
  },
  Australia: {
    currency: 'AUD',
    stockMarket: {
      name: 'ASX',
      topPicks: [
        { name: 'BHP', price: 'AUD$40', change: '+2.1%', sector: 'Mining' },
        { name: 'Commonwealth Bank', price: 'AUD$110', change: '+1.2%', sector: 'Banking' },
        { name: 'CSL', price: 'AUD$280', change: '+0.8%', sector: 'Pharma' },
        { name: 'Westpac', price: 'AUD$25', change: '+1.5%', sector: 'Banking' },
        { name: 'NAB', price: 'AUD$30', change: '+1.8%', sector: 'Banking' }
      ],
      returns: '9-11%',
      marketCap: 'AUD$2T'
    },
    fixedDeposits: {
      topBanks: [
        { bank: 'CBA', rate: '4.5%', tenure: '1-5 years', minAmount: 'AUD$1,000' },
        { bank: 'Westpac', rate: '4.3%', tenure: '1-5 years', minAmount: 'AUD$500' },
        { bank: 'ANZ', rate: '4.2%', tenure: '1-5 years', minAmount: 'AUD$1,000' }
      ],
      avgReturns: '4-5%',
      taxBenefit: 'Taxable'
    },
    crypto: {
      trending: [
        { name: 'Bitcoin', price: 'AUD$65,000', change: '+5.2%' },
        { name: 'Ethereum', price: 'AUD$4,000', change: '+3.8%' },
        { name: 'Chainlink', price: 'AUD$20', change: '+2.1%' }
      ],
      risk: 'High'
    },
    mutualFunds: {
      recommended: [
        { name: 'Vanguard Australian Shares', type: 'Index', returns3y: '9.5%', risk: 'Moderate' },
        { name: 'iShares ASX 200', type: 'ETF', returns3y: '9.3%', risk: 'Moderate' },
        { name: 'BetaShares A200', type: 'ETF', returns3y: '9.4%', risk: 'Moderate' }
      ],
      returns: '8-10%'
    },
    bonds: [
      { name: 'Govt Bonds', yield: '4.2%', maturity: '2-30 years', credit: 'AAA' },
      { name: 'Corporate Bonds', yield: '5-6%', maturity: '5-10 years', credit: 'AAA' }
    ]
  }
};

router.get('/:country', (req, res) => {
  const country = req.params.country;
  const data = investmentData[country];
  
  if (!data) {
    return res.status(404).json({ error: 'Country not supported' });
  }
  
  res.json(data);
});

export default router;
