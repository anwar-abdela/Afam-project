import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            toast.success('Access Granted');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] relative overflow-hidden font-sans">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-500/20 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full"></div>

            <div className="max-w-md w-full mx-4 relative z-10">
                <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-10 group">
                    <div className="text-center space-y-2">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-700 rounded-3xl mx-auto shadow-2xl shadow-blue-500/20 flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-500">
                            <span className="text-white text-4xl font-black italic tracking-tighter">A</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
                            Artic Sync
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                            Central Command Portal
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Identity</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                                    placeholder="operator@artic.sync"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Access Key</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-3 py-4 border border-transparent text-sm font-black italic uppercase rounded-2xl text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>Initiate Auth</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                            Secured by Artic Protocol v4.0.2<br />
                            <span className="text-primary-500 opacity-60">Authorized personnel only</span>
                        </p>
                    </div>
                </div>

                <p className="text-center mt-10 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    &copy; 2026 Artic Global Systems
                </p>
            </div>
        </div>
    );
}
