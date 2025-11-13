import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

/**
 * Discount & Rewards Donut Chart Component
 * 
 * Props:
 *  - data (object) - object with totalDiscount and totalRewards
 *  - title (string) - default "Discount & Rewards"
 */
export default function DiscountRewards({ 
  title = "Discount & Rewards",
  data: apiData 
}) {
  // Fake data for demonstration
  const fakeData = {
    totalDiscount: 12500,
    totalRewards: 8750
  };

  // Use API data if available, otherwise use fake data
  const data = apiData || fakeData;

  // Transform data to chart format
  const totalDiscount = data?.totalDiscount || 0;
  const totalRewards = data?.totalRewards || 0;

  const chartData = [
    { 
      name: "Total discount", 
      value: totalDiscount,
      color: "#ef4444" // red-500
    },
    { 
      name: "Total rewards", 
      value: totalRewards,
      color: "#22c55e" // green-500
    }
  ];

  // Calculate total and percentages
  const total = totalDiscount + totalRewards;
  const dataWithPercentages = chartData.map(item => ({
    ...item,
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
  }));

  // Custom legend component
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-col gap-3 mt-6">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700 font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">${payload[0].value.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{payload[0].payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  // Custom label to show percentage in the center
  const renderLabel = (entry) => {
    return `${entry.percentage}%`;
  };

  return (
    <div className="h-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-green-600">{title}</h2>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {apiData ? 'Live Data' : 'Demo Data'}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">${totalDiscount.toLocaleString()}</div>
          <div className="text-sm text-red-700">Total Discounts</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">${totalRewards.toLocaleString()}</div>
          <div className="text-sm text-green-700">Total Rewards</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 flex flex-col items-center min-h-0">
        <div className="w-full flex-1" style={{ minHeight: "250px" }}>
          {total > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Pie
                  data={dataWithPercentages}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={85}
                  innerRadius={55}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={450}
                >
                  {dataWithPercentages.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No discount or rewards data available
            </div>
          )}
        </div>

        {/* Custom Legend */}
        {total > 0 && (
          <div className="w-full mt-2">
            <CustomLegend payload={dataWithPercentages} />
          </div>
        )}

        {/* Summary */}
        {total > 0 && (
          <div className="w-full mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Amount</span>
              <span className="text-lg font-bold text-gray-800">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
