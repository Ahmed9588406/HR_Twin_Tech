import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

/**
 * Department Distribution Donut Chart Component
 * 
 * Props:
 *  - data (array) - array from API: deptNumOfEmp with name and numberOfEmp
 *  - title (string) - default "Department Distribution"
 */
export default function Department({ 
  title = "Department",
  data: apiData 
}) {
  // Dummy data for demonstration
  const dummyData = [
    { name: "Information Technology", numberOfEmp: 45 },
    { name: "Human Resources", numberOfEmp: 12 },
    { name: "Sales", numberOfEmp: 28 },
    { name: "Marketing", numberOfEmp: 18 },
    { name: "Operations", numberOfEmp: 22 },
    { name: "Finance", numberOfEmp: 15 },
    { name: "Customer Service", numberOfEmp: 10 }
  ];

  // Modern gradient color palette
  const colors = [
    "#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444",
    "#ec4899", "#6366f1", "#14b8a6", "#84cc16", "#f97316",
    "#a855f7", "#22d3ee", "#fbbf24"
  ];

  // Use API data if available, otherwise use dummy data
  const data = apiData || dummyData;

  // Transform API data to chart format
  const transformedData = data?.map((dept, index) => ({
    name: dept.name,
    value: dept.numberOfEmp,
    color: colors[index % colors.length]
  })) || [];

  // Calculate total for percentages
  const total = transformedData.reduce((sum, item) => sum + item.value, 0);

  // Add percentage to data
  const chartData = transformedData.map(item => ({
    ...item,
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
  }));

  // Determine if we have many departments (adjust layout accordingly)
  const hasManyDepartments = chartData.length > 7;

  // Custom legend component with adaptive layout
  const CustomLegend = ({ payload }) => {
    return (
      <div 
        className={`
          grid gap-2 mt-4 px-2
          ${hasManyDepartments 
            ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 max-h-64' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 max-h-48'
          }
          overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        `}
      >
        {payload.map((entry, index) => (
          <div 
            key={`legend-${index}`} 
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: entry.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate" title={entry.name}>
                {entry.name}
              </p>
              <p className="text-xs text-gray-500">
                {entry.value} ({entry.percentage}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Custom tooltip with modern design
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-gray-200">
          <p className="text-sm font-bold text-gray-900 mb-1">{payload[0].name}</p>
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: payload[0].payload.color }}
            />
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{payload[0].value}</span> employees
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            {payload[0].payload.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label with adaptive font size
  const renderLabel = (entry) => {
    // Only show label if percentage is above threshold
    const percentage = parseFloat(entry.percentage);
    if (percentage < 3) return ""; // Hide label for small slices
    return entry.value > 0 ? `${entry.value}` : "";
  };

  // Calculate responsive chart dimensions
  const getChartDimensions = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return { outer: 70, inner: 45 }; // mobile
      if (width < 1024) return { outer: 85, inner: 55 }; // tablet
      return { outer: 95, inner: 60 }; // desktop
    }
    return { outer: 85, inner: 55 };
  };

  const [dimensions, setDimensions] = React.useState(getChartDimensions());

  React.useEffect(() => {
    const handleResize = () => setDimensions(getChartDimensions());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-full bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Header with gradient accent */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs sm:text-sm font-semibold text-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 rounded-full border border-green-200 shadow-sm">
            <span className="text-green-600">{total}</span>
            <span className="text-gray-500 ml-1 hidden sm:inline">Total</span>
          </div>
          {hasManyDepartments && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full hidden md:block">
              {chartData.length} depts
            </div>
          )}
        </div>
      </div>

      {/* Chart Container with adaptive layout */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        {/* Chart */}
        <div className={`${hasManyDepartments ? 'lg:w-2/5' : 'lg:w-1/2'} min-h-[250px] sm:min-h-[300px]`}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {chartData.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.8} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={dimensions.outer}
                  innerRadius={dimensions.inner}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={chartData.length > 10 ? 1 : 2}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#gradient-${index})`}
                      className="hover:opacity-80 transition-opacity cursor-pointer drop-shadow-sm hover:drop-shadow-md" 
                      strokeWidth={2}
                      stroke="white"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm text-center px-6">
              <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="font-medium">No department data available</p>
            </div>
          )}
        </div>

        {/* Legend */}
        {chartData.length > 0 && (
          <div className={`${hasManyDepartments ? 'lg:w-3/5' : 'lg:w-1/2'} overflow-hidden`}>
            <CustomLegend payload={chartData} />
          </div>
        )}
      </div>

      {/* Footer Stats (optional) */}
      {chartData.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Largest: <span className="font-semibold text-gray-700">
              {Math.max(...chartData.map(d => d.value))} employees
            </span>
          </span>
          <span>
            Average: <span className="font-semibold text-gray-700">
              {Math.round(total / chartData.length)} employees
            </span>
          </span>
        </div>
      )}
    </div>
  );
}