import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { investmentAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface InvestmentData {
  currency: string;
  stockMarket: {
    name: string;
    topPicks: Array<{ name: string; price: string; change: string; sector: string }>;
    returns: string;
    marketCap: string;
  };
  fixedDeposits: {
    topBanks: Array<{ bank: string; rate: string; tenure: string; minAmount: string }>;
    avgReturns: string;
    taxBenefit: string;
  };
  crypto: { trending: Array<{ name: string; price: number; change: number }>; risk: string };
  mutualFunds: { recommended: Array<{ name: string; type: string; returns3y: string; risk: string }>; returns: string };
  bonds: Array<{ name: string; yield: string; maturity: string; credit: string }>;
}

const Investments = () => {
  const { user } = useAuth();
  const [data, setData] = useState<InvestmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      if (user?.country) {
        try {
          const response = await investmentAPI.getByCountry(user.country);
          setData(response.data);
        } catch (error) {
          console.error('Failed to fetch investments:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchInvestments();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="space-y-4 w-full max-w-md px-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (!data) return <div className="text-center mt-20 text-red-500">Failed to load data</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">Investment Recommendations</h1>
      <p className="text-gray-600 mb-8">Personalized for {user?.country} ({data.currency})</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stock Market */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-3">📈 Stock Market</h2>
          <p className="text-sm text-blue-700 mb-2">{data.stockMarket.name} • Market Cap: {data.stockMarket.marketCap}</p>
          <p className="text-green-600 font-semibold mb-3">Expected Returns: {data.stockMarket.returns}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.stockMarket.topPicks.map((stock) => (
              <Card key={stock.name}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{stock.name}</h3>
                  <p>₹{stock.price}</p>
                  <p className={parseFloat(stock.change) > 0 ? 'text-green-500' : 'text-red-500'}>
                    {stock.change}%
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fixed Deposits */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200">
          <h2 className="text-2xl font-bold text-green-900 mb-3">🏦 Fixed Deposits</h2>
          <p className="text-green-600 font-semibold mb-2">Average Returns: {data.fixedDeposits.avgReturns}</p>
          <p className="text-sm text-green-700 mb-3">{data.fixedDeposits.taxBenefit}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.fixedDeposits.topBanks.map((bank) => (
              <Card key={bank.bank}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{bank.bank}</h3>
                  <p>{bank.rate}</p>
                  <p>{bank.tenure}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Crypto/NFT */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-900 mb-3">🪙 Crypto & NFT</h2>
          <p className="text-red-600 font-semibold mb-3">Risk Level: {data.crypto.risk}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.crypto.trending.map((investment) => (
              <Card key={investment.name}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{investment.name}</h3>
                  <p>{investment.price?.toLocaleString()}</p>
                  <p className={investment.change > 0 ? 'text-green-500' : 'text-red-500'}>
                    {investment.change}%
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mutual Funds */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg border border-orange-200">
          <h2 className="text-2xl font-bold text-orange-900 mb-3">📊 Mutual Funds</h2>
          <p className="text-green-600 font-semibold mb-3">Expected Returns: {data.mutualFunds.returns}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.mutualFunds.recommended.map((fund) => (
              <Card key={fund.name}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{fund.name}</h3>
                  <p>{fund.returns3y}</p>
                  <p>{fund.risk}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bonds */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border border-yellow-200">
          <h2 className="text-2xl font-bold text-yellow-900 mb-3">📜 Bonds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.bonds && Array.isArray(data.bonds) ? data.bonds.map((bond) => (
              <Card key={bond.name}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{bond.name}</h3>
                  <p>{bond.yield}%</p>
                  <p>{bond.maturity}</p>
                  <p>{bond.credit}</p>
                </CardContent>
              </Card>
            )) : <p>No bond data available</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investments;
