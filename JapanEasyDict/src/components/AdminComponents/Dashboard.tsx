import React from 'react';
import { BarChart3, Users, Search } from 'lucide-react';
import { ANALYTICS_DATA } from '../../data';

const Dashboard: React.FC = () => {
  const { dailySearches, mostSearchedKanji, userStatistics } = ANALYTICS_DATA;
  
  // Find the maximum search value for scaling the chart
  const maxSearches = Math.max(...dailySearches.map(day => day.searches));
  
  return (
    <div className="space-y-6">
      {/* Search History Graph */}
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Search Analytics</h2>
        <div className="h-[500px] relative p-8">
            {/* Y-axis */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-gray-400 pr-2">
                <span>{Math.round(maxSearches * 1)}</span>
                <span>{Math.round(maxSearches * 0.75)}</span>
                <span>{Math.round(maxSearches * 0.5)}</span>
                <span>{Math.round(maxSearches * 0.25)}</span>
                <span>0</span>
            </div>
            
            {[0.25, 0.5, 0.75, 1].map((level, index) => (
                <div
                key={index}
                className="absolute left-0 w-full border-t border-gray-600"
                style={{ bottom: `${level * 100}%` }}
                ></div>
            ))}

            {/* Graph bars */}
            <div className="ml-10 h-full flex items-end">
            <div className="flex-1 h-full flex items-end justify-between">
                {dailySearches.map((day, i) => {
                const height = (day.searches / (maxSearches * 1.1)) * 100;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end">
                    <div className="w-full h-[500px] flex items-end justify-center relative group">
                        <div
                        className="w-[50px] bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-400"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                        />
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {day.searches} searches
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">{day.date}</p>
                    </div>
                );
                })}
            </div>
            </div>
        </div>
        </div>


      {/* Top Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Searched Kanji */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Most Searched Kanji</h2>
          <div className="space-y-3">
            {mostSearchedKanji.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-xl font-bold">{item.kanji}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="text-white font-medium">#{index + 1}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Search className="w-4 h-4 text-blue-400 mr-2" />
                  <span>{item.searches}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">User Activity</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-900/40 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-gray-300">New Users Today</p>
              </div>
              <p className="text-xl font-bold">{userStatistics.newUsersToday}</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-900/40 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-gray-300">Active Users</p>
              </div>
              <p className="text-xl font-bold">{userStatistics.activeUsers}</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-900/40 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <Search className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-gray-300">Total Searches</p>
              </div>
              <p className="text-xl font-bold">{userStatistics.totalSearches}</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-900/40 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                  <BarChart3 className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-gray-300">Avg. Session Time</p>
              </div>
              <p className="text-xl font-bold">{userStatistics.averageSessionTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;