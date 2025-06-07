import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Users, Search, Calendar, TrendingUp, UserPlus } from 'lucide-react';
import './Admin.css';

const API_URL = "http://localhost:8082/api/users";

const UserManagement = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
  });
  
  const [allUsers, setAllUsers] = useState([]);
  const [todayNewUsers, setTodayNewUsers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [timeFilter, setTimeFilter] = useState('week'); // week, month, year
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const users = await response.json();
        setAllUsers(users);
        processUserData(users);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Process user data and generate statistics
  const processUserData = (users) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter users created today
    const newUsersToday = users.filter(user => {
      if (!user.createdAt) return false;
      const userDate = new Date(user.createdAt);
      userDate.setHours(0, 0, 0, 0);
      return userDate.getTime() === today.getTime();
    });

    setTodayNewUsers(newUsersToday);


    // Update user statistics
    setUserStats({
      totalUsers: users.length,
      newUsersToday: newUsersToday.length,
    });

    // Generate chart data based on time filter
    generateChartData(users, timeFilter);
  };

  // Generate chart data based on time period
const generateChartData = (users, period) => {
  const now = new Date();
  let data = [];

  // Ensure users are sorted chronologically
  const sortedUsers = [...users].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  switch (period) {
    case 'week': {
      const today = new Date(now);
      today.setHours(23, 59, 59, 999); // Set to end of day for totalUsersCount

      for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        day.setHours(0, 0, 0, 0); // Midnight for newUsersCount

        const dayEnd = new Date(day);
        dayEnd.setHours(23, 59, 59, 999); // End of day for totalUsersCount

        const newUsersCount = sortedUsers.filter(user => {
          const created = new Date(user.createdAt);
          created.setHours(0, 0, 0, 0);
          return created.getTime() === day.getTime();
        }).length;

        const totalUsersCount = sortedUsers.filter(user => {
          const created = new Date(user.createdAt);
          return created <= dayEnd;
        }).length;

        data.push({
          name: day.toLocaleDateString('en-US', { weekday: 'short' }),
          newUsers: newUsersCount,
          totalUsers: totalUsersCount,
        });
      }
      break;
    }

    case 'month': {
      for (let i = 3; i >= 0; i--) {
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() - (i * 7));
        weekEnd.setHours(23, 59, 59, 999);

        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekStart.getDate() - 6);
        weekStart.setHours(0, 0, 0, 0);

        const newUsersCount = sortedUsers.filter(user => {
          const created = new Date(user.createdAt);
          return created >= weekStart && created <= weekEnd;
        }).length;

        const totalUsersCount = sortedUsers.filter(user => {
          const created = new Date(user.createdAt);
          return created <= weekEnd;
        }).length;

        data.push({
          name: `Week ${4 - i}`,
          newUsers: newUsersCount,
          totalUsers: totalUsersCount,
        });
      }
      break;
    }

    case 'year': {
      for (let i = 11; i >= 0; i--) {
        const month = new Date(now);
        month.setMonth(month.getMonth() - i);
        const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
        const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);

        const newUsersCount = sortedUsers.filter(user => {
          const created = new Date(user.createdAt);
          return created >= monthStart && created <= monthEnd;
        }).length;

        const totalUsersCount = sortedUsers.filter(user => {
          const created = new Date(user.createdAt);
          return created <= monthEnd;
        }).length;

        data.push({
          name: month.toLocaleDateString('en-US', { month: 'short' }),
          newUsers: newUsersCount,
          totalUsers: totalUsersCount,
        });
      }
      break;
    }
  }

  setChartData(data);
};


  // Handle time filter change
  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
    generateChartData(allUsers, newFilter);
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-loading">Loading user data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Top Row Stats */}
      <div className="admin-stats-grid">
        {/* User Statistics */}
        <div className="admin-user-stats-card">
          <h2 className="admin-user-stats-title">User Activity Overview</h2>
          <div className="admin-user-stats-list">
            <div className="admin-user-stat">
              <div className="admin-kanji-left">
                <div className="admin-stat-icon-container green">
                  <UserPlus className="admin-stat-icon green" />
                </div>
                <p className="admin-stat-text">New Users Today</p>
              </div>
              <p className="admin-stat-value">{userStats.newUsersToday}</p>
            </div>
                     
            <div className="admin-user-stat">
              <div className="admin-kanji-left">
                <div className="admin-stat-icon-container blue">
                  <Users className="admin-stat-icon blue" />
                </div>
                <p className="admin-stat-text">Total Users</p>
              </div>
              <p className="admin-stat-value">{userStats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="admin-chart-section">
        <div className="admin-chart-header">
          <h2 className="admin-chart-title">User Registration & Activity Analysis</h2>
          <div className="admin-time-filter">
            <button 
              className={`admin-filter-btn ${timeFilter === 'week' ? 'active' : ''}`}
              onClick={() => handleTimeFilterChange('week')}
            >
              Week
            </button>
            <button 
              className={`admin-filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
              onClick={() => handleTimeFilterChange('month')}
            >
              Month
            </button>
            <button 
              className={`admin-filter-btn ${timeFilter === 'year' ? 'active' : ''}`}
              onClick={() => handleTimeFilterChange('year')}
            >
              Year
            </button>
          </div>
        </div>
        
        <div className="admin-chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="newUsers" fill="#4ade80" name="New Users" />
              <Bar dataKey="totalUsers" fill="#3b82f6" name="Total Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Users Today Section */}
      <div className="admin-new-users-section">
        <h2 className="admin-section-title">New Users Today ({todayNewUsers.length})</h2>
        <div className="admin-users-grid">
          {todayNewUsers.length > 0 ? (
            todayNewUsers.map(user => (
              <div key={user.id} className="admin-user-card">
                <div className="admin-user-info">
                  <div className="admin-user-avatar">
                    <Users size={24} />
                  </div>
                  <div className="admin-user-details">
                    <h3 className="admin-user-name">{user.username}</h3>
                    <p className="admin-user-email">{user.email}</p>
                    <p className="admin-user-date">
                      Joined: {new Date(user.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="admin-user-role">
                  <span className={`admin-role-badge ${user.role === 1 ? 'user' : 'admin'}`}>
                    {user.role === 1 ? 'User' : 'Admin'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-no-users">
              <Users size={48} />
              <p>No new users registered today</p>
            </div>
          )}
        </div>
      </div>

      {/* All Users Summary */}
      <div className="admin-all-users-section">
        <h2 className="admin-section-title">All Users Summary</h2>
        <div className="admin-summary-grid">
          <div className="admin-summary-card">
            <h3>User Distribution</h3>
            <div className="admin-distribution">
              <div className="admin-dist-item">
                <span className="admin-dist-label">Regular Users:</span>
                <span className="admin-dist-value">
                  {allUsers.filter(u => u.role === 1).length}
                </span>
              </div>
              <div className="admin-dist-item">
                <span className="admin-dist-label">Administrators:</span>
                <span className="admin-dist-value">
                  {allUsers.filter(u => u.role !== 1).length}
                </span>
              </div>
            </div>
          </div>
          
          <div className="admin-summary-card">
            <h3>Registration Trends</h3>
            <div className="admin-trends">
              <div className="admin-trend-item">
                <TrendingUp size={20} />
                <span>Growth rate: +{Math.floor(userStats.newUsersToday / 7 * 100)}% this week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;