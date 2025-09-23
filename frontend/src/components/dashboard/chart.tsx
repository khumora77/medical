import React, { useState } from 'react';

const VisitorInsightsDashboard: React.FC = () => {
  // Sample visitor data for each month
  const [visitorData, setVisitorData] = useState([
    { month: 'Jan', visitors: 320, newVisitors: 180, returningVisitors: 140 },
    { month: 'Feb', visitors: 380, newVisitors: 210, returningVisitors: 170 },
    { month: 'Mar', visitors: 410, newVisitors: 230, returningVisitors: 180 },
    { month: 'Apr', visitors: 370, newVisitors: 200, returningVisitors: 170 },
    { month: 'May', visitors: 450, newVisitors: 250, returningVisitors: 200 },
    { month: 'Jun', visitors: 520, newVisitors: 290, returningVisitors: 230 },
    { month: 'Jul', visitors: 580, newVisitors: 320, returningVisitors: 260 },
    { month: 'Aug', visitors: 610, newVisitors: 340, returningVisitors: 270 },
    { month: 'Sep', visitors: 540, newVisitors: 300, returningVisitors: 240 },
    { month: 'Oct', visitors: 490, newVisitors: 270, returningVisitors: 220 },
    { month: 'Nov', visitors: 430, newVisitors: 240, returningVisitors: 190 },
    { month: 'Dec', visitors: 390, newVisitors: 220, returningVisitors: 170 }
  ]);

  // Find the maximum value for scaling the chart
  const maxVisitors = Math.max(...visitorData.map(data => data.visitors));

  // Calculate statistics
  const totalVisitors = visitorData.reduce((sum, data) => sum + data.visitors, 0);
  const avgVisitors = Math.round(totalVisitors / visitorData.length);
  const maxMonth = visitorData.reduce((max, data) => 
    data.visitors > max.visitors ? data : max, visitorData[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Visitor Insights</h1>
          <p className="text-gray-600">Monthly visitor statistics and trends</p>
        </header>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Total Visitors</h3>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-blue-600">{totalVisitors.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Past 12 months</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Average Monthly</h3>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-green-600">{avgVisitors.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Visitors per month</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Peak Month</h3>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-purple-600">{maxMonth.visitors.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">in {maxMonth.month}</p>
          </div>
        </div>
        
        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Monthly Visitors Overview</h2>
          
          <div className="flex flex-col md:flex-row">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between mr-4 mb-4 md:mb-0" style={{ height: '320px' }}>
              {[500, 400, 300, 200, 100, 0].map(value => (
                <div key={value} className="text-right text-sm text-gray-500 pr-2" style={{ flex: 1 }}>
                  {value}
                </div>
              ))}
            </div>
            
            {/* Chart area */}
            <div className="flex-1">
              <div className="flex items-end justify-between" style={{ height: '320px' }}>
                {visitorData.map((data, index) => {
                  const barHeight = (data.visitors / maxVisitors) * 280;
                  const newVisitorsHeight = (data.newVisitors / data.visitors) * barHeight;
                  const returningVisitorsHeight = barHeight - newVisitorsHeight;
                  
                  return (
                    <div key={data.month} className="flex flex-col items-center" style={{ width: '7%' }}>
                      <div className="flex flex-col-reverse w-full" style={{ height: `${barHeight}px` }}>
                        <div 
                          className="bg-blue-400 rounded-t"
                          style={{ height: `${returningVisitorsHeight}px` }}
                          title={`Returning Visitors: ${data.returningVisitors}`}
                        ></div>
                        <div 
                          className="bg-blue-600 rounded-t"
                          style={{ height: `${newVisitorsHeight}px` }}
                          title={`New Visitors: ${data.newVisitors}`}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{data.month}</div>
                    </div>
                  );
                })}
              </div>
              
              {/* X-axis base line */}
              <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between">
                {[0, 100, 200, 300, 400, 500].map(value => (
                  <div key={value} className="text-xs text-gray-500">
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Chart legend */}
          <div className="flex justify-center mt-6 space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
              <span className="text-sm text-gray-600">New Visitors</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Returning Visitors</span>
            </div>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed Visitor Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Visitors</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Visitors</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returning Visitors</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitorData.map((data) => (
                  <tr key={data.month}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{data.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.visitors}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.newVisitors}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.returningVisitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorInsightsDashboard;