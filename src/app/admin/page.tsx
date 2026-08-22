import React from 'react';
import { getAdminAnalytics, getManageUsers } from '../actions/adminActions';
import DashboardCharts from './DashboardCharts';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import styles from './admin.module.css';

export default async function AdminPage() {
  // Fetch data on the server
  const analytics = await getAdminAnalytics();
  const users = await getManageUsers();

  return (
    <>
      <Nav />
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1>GlobeTrotter</h1>
        </div>
        <DashboardCharts 
          pieData={analytics.pieData} 
          lineData={analytics.lineData} 
          barData={analytics.barData} 
          users={users}
        />
      </div>
      <Footer />
    </>
  );
}
