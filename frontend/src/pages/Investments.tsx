import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

interface InvestmentData {
  currency: string;
  stockMarket: { name: string; topPicks: string[]; returns: string };
  fixedDeposits: { topBanks: string[]; avgReturns: string };
  crypto: { trending: string[]; risk: string };
  mutualFunds: { recommended: string[]; returns: string };
  bonds: { government: string; corporate: string };
}

const Investments = () => {
  const { user } = useAuth();
  const [data, setData] = useState<InvestmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/investments/${user?.country}`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch investments', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.country) fetchData();
  }, [user]);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading...</div></div>;
  if (!data) return <div className="text-center mt-20 text-red-500">Failed to load data</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">Investment Recommendations</h1>
      <p className="text-gray-600 mb-8">Personalized for {user?.country} ({data.currency})</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stock Market */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-3">📈 Stock Market</h2>
          <p className="text-sm text-blue-700 mb-2">{data.stockMarket.name}</p>
          <p className="text-green-600 font-semibold mb-3">Expected Returns: {data.stockMarket.returns}</p>
          <div className="space-y-2">
            {data.stockMarket.topPicks.map((stock, i) => (
              <div key={i} className="bg-white p-3 rounded-lg shadow-sm">{stock}</div>
            ))}
          </div>
        </div>

        {/* Fixed Deposits */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200">
          <h2 className="text-2xl font-bold text-green-900 mb-3">🏦 Fixed Deposits</h2>
          <p className="text-green-600 font-semibold mb-3">Average Returns: {data.fixedDeposits.avgReturns}</p>
          <div className="space-y-2">
            {data.fixedDeposits.topBanks.map((bank, i) => (
              <div key={i} className="bg-white p-3 rounded-lg shadow-sm">{bank}</div>
            ))}
          </div>
        </div>

        {/* Crypto/NFT */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-900 mb-3">🪙 Crypto & NFT</h2>
          <p className="text-red-600 font-semibold mb-3">Risk Level: {data.crypto.risk}</p>
          <div className="space-y-2">
            {data.crypto.trending.map((coin, i) => (
              <div key={i} className="bg-white p-3 rounded-lg shadow-sm">{coin}</div>
            ))}
          </div>
        </div>

        {/* Mutual Funds */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg border border-orange-200">
          <h2 className="text-2xl font-bold text-orange-900 mb-3">📊 Mutual Funds</h2>
          <p className="text-green-600 font-semibold mb-3">Expected Returns: {data.mutualFunds.returns}</p>
          <div className="space-y-2">
            {data.mutualFunds.recommended.map((fund, i) => (
              <div key={i} className="bg-white p-3 rounded-lg shadow-sm">{fund}</div>
            ))}
          </div>
        </div>

        {/* Bonds */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border border-yellow-200 md:col-span-2">
          <h2 className="text-2xl font-bold text-yellow-900 mb-3">📜 Bonds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-yellow-800">Government Bonds</p>
              <p className="text-green-600">{data.bonds.government}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-yellow-800">Corporate Bonds</p>
              <p className="text-green-600">{data.bonds.corporate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investments;
