import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHUD from './TopHUD';
import './Layout.css';

const Layout = ({ user, onLogout, updateUser }) => {
  return (
    <div className="layout-container">
      <Sidebar onLogout={onLogout} />
      <div className="main-content-wrapper">
        <TopHUD user={user} />
        <main className="main-content">
          <Outlet context={{ user, updateUser }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
