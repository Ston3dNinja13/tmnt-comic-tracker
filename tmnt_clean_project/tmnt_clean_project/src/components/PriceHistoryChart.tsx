import React from 'react';
import { PriceHistoryResponse } from '@/app/api/comics/[id]/price-history/route';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PriceHistoryChartProps {
  priceHistory: PriceHistoryResponse;
}

export default function PriceHistoryChart({ priceHistory }: PriceHistoryChartProps) {
  // Prepare data for the chart
  const chartData = priceHistory.priceHistory.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    price: item.price,
    source: item.source,
    condition: item.condition || 'Unknown'
  }));

  // Sort by date (oldest first)
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Add current and previous lowest prices as special points
  if (priceHistory.currentLowestPrice) {
    chartData.push({
      date: new Date(priceHistory.currentLowestPrice.date).toLocaleDateString(),
      price: priceHistory.currentLowestPrice.price,
      source: priceHistory.currentLowestPrice.source,
      condition: priceHistory.currentLowestPrice.condition || 'Unknown',
      isCurrent: true
    });
  }

  if (priceHistory.previousLowestPrice) {
    chartData.push({
      date: new Date(priceHistory.previousLowestPrice.date).toLocaleDateString(),
      price: priceHistory.previousLowestPrice.price,
      source: priceHistory.previousLowestPrice.source,
      condition: priceHistory.previousLowestPrice.condition || 'Unknown',
      isPrevious: true
    });
  }

  // Custom tooltip to show more information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-md">
          <p className="font-bold">{label}</p>
          <p className="text-green-600 font-semibold">${data.price.toFixed(2)}</p>
          <p>Source: {data.source}</p>
          <p>Condition: {data.condition}</p>
          {data.isCurrent && (
            <p className="text-blue-600 font-bold">Current Lowest Price</p>
          )}
          {data.isPrevious && (
            <p className="text-orange-600 font-bold">Previous Lowest Price</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-green-800 mb-4">
        Price History for {priceHistory.title} #{priceHistory.issueNumber}
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4">
        <h4 className="font-bold text-lg">Price Tracking Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="border border-gray-200 rounded p-3">
            <h5 className="font-semibold text-green-700">Current Lowest Price</h5>
            <p className="text-xl font-bold">${priceHistory.currentLowestPrice.price.toFixed(2)}</p>
            <p>Found on: {new Date(priceHistory.currentLowestPrice.date).toLocaleDateString()}</p>
            <p>Source: {priceHistory.currentLowestPrice.source}</p>
            <p>Condition: {priceHistory.currentLowestPrice.condition || 'Unknown'}</p>
          </div>
          
          {priceHistory.previousLowestPrice && (
            <div className="border border-gray-200 rounded p-3">
              <h5 className="font-semibold text-orange-700">Previous Lowest Price</h5>
              <p className="text-xl font-bold">${priceHistory.previousLowestPrice.price.toFixed(2)}</p>
              <p>Found on: {new Date(priceHistory.previousLowestPrice.date).toLocaleDateString()}</p>
              <p>Source: {priceHistory.previousLowestPrice.source}</p>
              <p>Condition: {priceHistory.previousLowestPrice.condition || 'Unknown'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
