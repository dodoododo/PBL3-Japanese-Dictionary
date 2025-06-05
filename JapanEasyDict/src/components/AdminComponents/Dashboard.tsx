import React from 'react';
import { BarChart3, Users, Search } from 'lucide-react';
import { ANALYTICS_DATA } from '../../data';
import './Admin.css';

const Dashboard: React.FC = () => {
  const { dailySearches, mostSearchedKanji, userStatistics } = ANALYTICS_DATA;
  
  // Find the maximum search value for scaling the chart
  const maxSearches = Math.max(...dailySearches.map(day => day.searches));
  
  return (
    <div className="admin-dashboard-container">
      {/* Search History Graph */}
      <div className="admin-chart-container">
        <h2 className="admin-chart-title">Daily Search Analytics</h2>
        <div className="admin-chart-area">
            {/* Y-axis */}
            <div className="admin-y-axis">
                <span>{Math.round(maxSearches * 1)}</span>
                <span>{Math.round(maxSearches * 0.75)}</span>
                <span>{Math.round(maxSearches * 0.5)}</span>
                <span>{Math.round(maxSearches * 0.25)}</span>
                <span>0</span>
            </div>
            
            {[0.25, 0.5, 0.75, 1].map((level, index) => (
                <div
                key={index}
                className="admin-grid-line"
                style={{ bottom: `${level * 100}%` }}
                ></div>
            ))}

            {/* Graph bars */}
            <div className="admin-chart-bars">
            <div className="admin-bar-container">
                {dailySearches.map((day, i) => {
                const height = (day.searches / (maxSearches * 1.1)) * 100;
                return (
                    <div key={i} className="admin-bar-item">
                    <div className="admin-bar-wrapper">
                        <div
                        className="admin-bar"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                        />
                        <div className="admin-bar-tooltip">
                        {day.searches} searches
                        </div>
                    </div>
                    <p className="admin-bar-label">{day.date}</p>
                    </div>
                );
                })}
            </div>
            </div>
        </div>
      </div>

      {/* Top Row Stats */}
      <div className="admin-stats-grid">
        {/* Most Searched Kanji */}
        <div className="admin-kanji-card">
          <h2 className="admin-kanji-title">Most Searched Kanji</h2>
          <div className="admin-kanji-list">
            {mostSearchedKanji.map((item, index) => (
              <div key={index} className="admin-kanji-item">
                <div className="admin-kanji-left">
                  <div className="admin-kanji-box">
                    <span className="admin-kanji-text">{item.kanji}</span>
                  </div>
                  <div className="admin-kanji-rank">
                    <span className="admin-kanji-rank-number">#{index + 1}</span>
                  </div>
                </div>
                <div className="admin-search-count">
                  <Search className="admin-search-icon" />
                  <span>{item.searches}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Statistics */}
        <div className="admin-user-stats-card">
          <h2 className="admin-user-stats-title">User Activity</h2>
          <div className="admin-user-stats-list">
            <div className="admin-user-stat">
              <div className="admin-kanji-left">
                <div className="admin-stat-icon-container green">
                  <Users className="admin-stat-icon green" />
                </div>
                <p className="admin-stat-text">New Users Today</p>
              </div>
              <p className="admin-stat-value">{userStatistics.newUsersToday}</p>
            </div>
            
            <div className="admin-user-stat">
              <div className="admin-kanji-left">
                <div className="admin-stat-icon-container blue">
                  <Users className="admin-stat-icon blue" />
                </div>
                <p className="admin-stat-text">Active Users</p>
              </div>
              <p className="admin-stat-value">{userStatistics.activeUsers}</p>
            </div>
            
            <div className="admin-user-stat">
              <div className="admin-kanji-left">
                <div className="admin-stat-icon-container purple">
                  <Search className="admin-stat-icon purple" />
                </div>
                <p className="admin-stat-text">Total Searches</p>
              </div>
              <p className="admin-stat-value">{userStatistics.totalSearches}</p>
            </div>
            
            <div className="admin-user-stat">
              <div className="admin-kanji-left">
                <div className="admin-stat-icon-container yellow">
                  <BarChart3 className="admin-stat-icon yellow" />
                </div>
                <p className="admin-stat-text">Avg. Session Time</p>
              </div>
              <p className="admin-stat-value">{userStatistics.averageSessionTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;