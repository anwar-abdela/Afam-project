import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SidebarItem({ to, label, current }) {
    const isActive = (current === to) || (to !== '/' && current.startsWith(to));
    return (
        <Link
            to={to}
            className={`${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-bold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'
                } group flex items-center px-4 py-3.5 text-[13px] rounded-2xl mb-1.5 transition-all duration-300 transform active:scale-95`}
        >
            <span className="flex items-center gap-3">
                {label}
            </span>
        </Link>
    );
}

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const currentPathLabel = () => {
        if (location.pathname === '/') return 'Dashboard Overview';
        const path = location.pathname.substring(1);
        return path.charAt(0)?.toUpperCase() + path.slice(1);
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <div className="w-72 bg-white border-r border-gray-100 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.02)] flex flex-col hidden lg:flex z-20">
                <div className="h-24 flex items-center px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center text-white font-black text-xl italic tracking-tighter">
                            A
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase italic">Artic</h1>
                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest opacity-80">Sync Manager</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide flex flex-col gap-1">
                    <SidebarItem to="/" label="󱂬 Dashboard" current={location.pathname} />
                    <SidebarItem to="/products" label="󱣧 Products" current={location.pathname} />
                    <SidebarItem to="/categories" label="󱡠 Categories" current={location.pathname} />
                    <SidebarItem to="/sales" label="󱥪 Sales" current={location.pathname} />
                    <SidebarItem to="/savings" label="󱙩 Savings" current={location.pathname} />
                    <SidebarItem to="/reports" label="󱓞 Reports" current={location.pathname} />
                </div>

                <div className="mx-6 mb-8 p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-indigo-600 border border-gray-100">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 truncate tracking-tight">{user.name}</p>
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">{user.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Secure Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-10 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="lg:hidden w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase italic opacity-70">
                            {currentPathLabel()}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                            <p className="text-xs font-black text-indigo-600 tracking-tight">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className="w-px h-8 bg-gray-100 hidden md:block"></div>
                        <div className="relative group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            </div>
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full"></span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent scrollbar-hide">
                    <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
