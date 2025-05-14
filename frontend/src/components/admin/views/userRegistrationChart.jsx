import React from 'react';

const UserRegistrationChart = ({ userRegistrationData, isDark, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className={`h-full w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'} animate-pulse`}></div>
      </div>
    );
  }

  // Handle empty data case
  if (!userRegistrationData || userRegistrationData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          No registration data available
        </p>
      </div>
    );
  }

  // Find the maximum count to scale bars properly
  const maxCount = Math.max(...userRegistrationData.map(item => item.count));
  
  // Generate Y-axis scale values
  const yAxisValues = [0, Math.round(maxCount * 0.25), Math.round(maxCount * 0.5), Math.round(maxCount * 0.75), maxCount];
  
  return (
    <div className="h-64 w-full">
      <div className="h-full relative">
        {/* Chart grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pr-12 pb-8">
          {yAxisValues.map((_, i) => (
            <div 
              key={i} 
              className={`w-full border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
            ></div>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute top-0 right-0 h-full pr-2 flex flex-col justify-between text-right pb-8">
          {yAxisValues.map((value, i) => (
            <div key={i} className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {value}
            </div>
          ))}
        </div>
        
        {/* X-axis (date labels) - use responsive sizing based on number of data points */}
        <div className="absolute bottom-0 left-0 right-12 flex justify-between">
          {userRegistrationData.map((item, index) => {
            // For large datasets, only show some labels to avoid overcrowding
            const showLabel = userRegistrationData.length <= 12 ? true : 
                              userRegistrationData.length <= 30 ? index % 3 === 0 : 
                              index % 5 === 0;
                              
            return (
              <div key={index} className={`text-xs text-center ${showLabel ? '' : 'opacity-0'}`}>
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Chart bars */}
        <div className="absolute bottom-8 top-0 left-0 right-12 flex justify-between items-end">
          {userRegistrationData.map((item, index) => {
            const barHeight = maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%';
            
            // Adjust bar width based on number of data points
            const barWidthClass = 
              userRegistrationData.length <= 10 ? "w-12" :
              userRegistrationData.length <= 20 ? "w-6" :
              userRegistrationData.length <= 40 ? "w-4" : "w-2";
            
            return (
              <div key={index} className="flex justify-center items-end h-full">
                <div 
                  className={`${barWidthClass} rounded-t-sm bg-purple-500 bg-opacity-80 hover:bg-opacity-100 transition-all relative group`}
                  style={{ height: barHeight }}
                  data-count={item.count}
                  data-date={item.date}
                  role="graphics-symbol"
                  aria-label={`${item.date}: ${item.count} users`}
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-opacity z-10">
                    {item.date}: {item.count.toLocaleString()} users
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationChart;