'use client';
import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as PieTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip,
  BarChart, Bar, Tooltip as BarTooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from './admin.module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardCharts({ 
  pieData, 
  lineData, 
  barData, 
  users 
}: { 
  pieData: any[], 
  lineData: any[], 
  barData: any[],
  users: any[]
}) {
  const [activeTab, setActiveTab] = useState('Trends');

  return (
    <div className={styles.dashboardContainer}>
      
      {/* Top Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Search bar ......" className={styles.searchInput} />
        </div>
        <div className={styles.toolbarActions}>
          <button className={styles.toolBtn}>Group by</button>
          <button className={styles.toolBtn}>Filter</button>
          <button className={styles.toolBtn}>Sort by...</button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        {['Manage Users', 'Popular cities', 'Popular Activities', 'Trends'].map(tab => (
          <button 
            key={tab} 
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'Trends' ? 'User Trends and Analytics' : tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className={styles.contentArea}>
        
        {activeTab === 'Trends' && (
          <div className={styles.trendsGrid}>
            <div className={styles.chartCard}>
              <h3>User Role Distribution</h3>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <PieTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3>New Users (Last 7 Days)</h3>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <LineTooltip />
                    <Line type="monotone" dataKey="users" stroke="#ff8042" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3>Popular Cities</h3>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <BarTooltip />
                    <Bar dataKey="visits" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Manage Users' && (
          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.firstName} {u.lastName}</td>
                    <td>{u.email}</td>
                    <td><span className={`${styles.roleBadge} ${styles[u.role]}`}>{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeTab === 'Popular cities' || activeTab === 'Popular Activities') && (
          <div className={styles.comingSoon}>
            <h3>More deep-dive analytics coming soon...</h3>
            <p>View the "Trends" tab for the current overview.</p>
          </div>
        )}

      </div>
    </div>
  );
}
