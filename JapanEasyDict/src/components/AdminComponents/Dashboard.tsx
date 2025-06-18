import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BarChart3 } from 'lucide-react';
import './Admin.css';

const API_URL = "http://localhost:8082/api/daily-views";

interface DailyViewCount {
  viewDate: string; // ISO date string (e.g., "2025-06-07")
  viewCount: number;
}

interface ChartData {
  name: string;
  current: number;
  previous: number;
}

const Dashboard: React.FC = () => {
  const [viewStats, setViewStats] = useState({
    totalViewsToday: 0,
    totalViews: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [allViewCounts, setAllViewCounts] = useState<DailyViewCount[]>([]); // Store raw API data

  // Fetch all daily view counts from API
  useEffect(() => {
    const fetchViewCounts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/all`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch view counts');
        }

        const viewCounts: DailyViewCount[] = await response.json();
        setAllViewCounts(viewCounts); // Store raw data
        processViewData(viewCounts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewCounts();
  }, []);

  // Process view data and generate statistics
  const processViewData = (viewCounts: DailyViewCount[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate total views and today's views
    const todayView = viewCounts.find(view => {
      const viewDate = new Date(view.viewDate);
      viewDate.setHours(0, 0, 0, 0);
      return viewDate.getTime() === today.getTime();
    });

    setViewStats({
      totalViews: viewCounts.reduce((sum, view) => sum + view.viewCount, 0),
      totalViewsToday: todayView ? todayView.viewCount : 0,
    });

    // Generate chart data based on time filter
    generateChartData(viewCounts, timeFilter);
  };

  // Generate chart data for current and previous periods
  const generateChartData = (viewCounts: DailyViewCount[], period: string) => {
    const now = new Date();
    const data: ChartData[] = [];
    const sortedViews = [...viewCounts].sort(
      (a, b) => new Date(a.viewDate).getTime() - new Date(b.viewDate).getTime()
    );

    switch (period) {
      case 'day': {
        const today = new Date(); // Use current date (June 7, 2025)
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const todayView = sortedViews.find(view => {
          const viewDate = new Date(view.viewDate);
          viewDate.setHours(0, 0, 0, 0);
          return viewDate.getTime() === today.getTime();
        });

        const yesterdayView = sortedViews.find(view => {
          const viewDate = new Date(view.viewDate);
          viewDate.setHours(0, 0, 0, 0);
          return viewDate.getTime() === yesterday.getTime();
        });

        data.push({
          name: `${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} vs ${yesterday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          current: todayView ? todayView.viewCount : 0,
          previous: yesterdayView ? yesterdayView.viewCount : 0,
        });
        break;
      }

      case 'week': {
        for (let i = 6; i >= 0; i--) {
          const day = new Date(now);
          day.setDate(now.getDate() - i);
          day.setHours(0, 0, 0, 0);

          const prevWeekDay = new Date(day);
          prevWeekDay.setDate(day.getDate() - 7);

          const currentDayView = sortedViews.find(view => {
            const viewDate = new Date(view.viewDate);
            viewDate.setHours(0, 0, 0, 0);
            return viewDate.getTime() === day.getTime();
          });

          const prevDayView = sortedViews.find(view => {
            const viewDate = new Date(view.viewDate);
            viewDate.setHours(0, 0, 0, 0);
            return viewDate.getTime() === prevWeekDay.getTime();
          });

          data.push({
            name: day.toLocaleDateString('en-US', { weekday: 'short' }),
            current: currentDayView ? currentDayView.viewCount : 0,
            previous: prevDayView ? prevDayView.viewCount : 0,
          });
        }
        break;
      }

      case 'month': {
        for (let i = 3; i >= 0; i--) {
          const weekEnd = new Date(now);
          weekEnd.setDate(now.getDate() - i * 7);
          weekEnd.setHours(23, 59, 59, 999);

          const weekStart = new Date(weekEnd);
          weekStart.setDate(weekEnd.getDate() - 6);
          weekStart.setHours(0, 0, 0, 0);

          const prevWeekStart = new Date(weekStart);
          prevWeekStart.setDate(weekStart.getDate() - 28); // 4 weeks back
          const prevWeekEnd = new Date(weekEnd);
          prevWeekEnd.setDate(weekEnd.getDate() - 28);

          const currentWeekViews = sortedViews
            .filter(view => {
              const viewDate = new Date(view.viewDate);
              return viewDate >= weekStart && viewDate <= weekEnd;
            })
            .reduce((sum, view) => sum + view.viewCount, 0);

          const prevWeekViews = sortedViews
            .filter(view => {
              const viewDate = new Date(view.viewDate);
              return viewDate >= prevWeekStart && viewDate <= prevWeekEnd;
            })
            .reduce((sum, view) => sum + view.viewCount, 0);

          data.push({
            name: `Week ${4 - i}`,
            current: currentWeekViews,
            previous: prevWeekViews,
          });
        }
        break;
      }

      case 'year': {
        for (let i = 11; i >= 0; i--) {
          const month = new Date(now);
          month.setMonth(now.getMonth() - i);
          const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
          const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);

          const prevMonthStart = new Date(monthStart);
          prevMonthStart.setFullYear(monthStart.getFullYear() - 1);
          const prevMonthEnd = new Date(monthEnd);
          prevMonthEnd.setFullYear(monthEnd.getFullYear() - 1);

          const currentMonthViews = sortedViews
            .filter(view => {
              const viewDate = new Date(view.viewDate);
              return viewDate >= monthStart && viewDate <= monthEnd;
            })
            .reduce((sum, view) => sum + view.viewCount, 0);

          const prevMonthViews = sortedViews
            .filter(view => {
              const viewDate = new Date(view.viewDate);
              return viewDate >= prevMonthStart && viewDate <= prevMonthEnd;
            })
            .reduce((sum, view) => sum + view.viewCount, 0);

          data.push({
            name: month.toLocaleDateString('en-US', { month: 'short' }),
            current: currentMonthViews,
            previous: prevMonthViews,
          });
        }
        break;
      }
    }

    setChartData(data);
  };

  // Handle time filter change
  const handleTimeFilterChange = (newFilter: 'day' | 'week' | 'month' | 'year') => {
    setTimeFilter(newFilter);
    generateChartData(allViewCounts, newFilter); // Use stored viewCounts
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-loading">Loading view data...</div>
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
        <div className="admin-user-stats-card">
          <h2 className="admin-user-stats-title">View Activity Overview</h2>
          <div className="admin-user-stats-list">
            <div className="admin-user-stat">
              <div className="admin-kanji-left">
                <div className="admin-stat-icon-container green">
                  <BarChart3 className="admin-stat-icon green" />
                </div>
                <p className="admin-stat-text">Views Today</p>
              </div>
              <p className="admin-stat-value">{viewStats.totalViewsToday}</p>
            </div>
            <div className="admin-user-stat">
              <div className="admin-kanji-left">
                <div className="admin-stat-icon-container blue">
                  <Users className="admin-stat-icon blue" />
                </div>
                <p className="admin-stat-text">Total Views</p>
              </div>
              <p className="admin-stat-value">{viewStats.totalViews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="admin-chart-section">
        <div className="admin-chart-header">
          <h2 className="admin-chart-title">View Count Analysis</h2>
          <div className="admin-time-filter">
            <button
              className={`admin-filter-btn ${timeFilter === 'day' ? 'active' : ''}`}
              onClick={() => handleTimeFilterChange('day')}
            >
              Day
            </button>
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
            <LineChart
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
              <Line
                type="monotone"
                dataKey="current"
                stroke="#4ade80"
                name="Current Period"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#3b82f6"
                name="Previous Period"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;