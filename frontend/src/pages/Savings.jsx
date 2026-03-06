import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Savings() {
    const [members, setMembers] = useState([]);
    const [report, setReport] = useState({ members: [], groupTotal: 0 });
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ memberId: '', amount: 10, isMissed: false });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const [memRes, repRes] = await Promise.all([
                api.get('/savings/members'),
                api.get('/savings/report/group')
            ]);
            setMembers(memRes.data);
            setReport(repRes.data);
        } catch (error) {
            toast.error('Failed to load savings data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.memberId) return toast.error('Select a member');

        setSubmitting(true);
        try {
            await api.post('/savings/contributions', {
                memberId: formData.memberId,
                amount: Number(formData.amount),
                isMissed: formData.isMissed
            });
            toast.success('Contribution recorded');
            setFormData({ memberId: '', amount: 10, isMissed: false });
            fetchData();
        } catch (error) {
            toast.error('Failed to record contribution');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* New Contribution Form */}
            <div className="lg:col-span-4">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-6 sticky top-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Daily Contribution</h2>
                        <p className="text-sm text-gray-400 mt-1">Update member savings state</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Cooperative Member</label>
                            <div className="relative group">
                                <select
                                    required
                                    value={formData.memberId}
                                    onChange={e => setFormData({ ...formData, memberId: e.target.value })}
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-semibold appearance-none cursor-pointer"
                                >
                                    <option value="">Select Member...</option>
                                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Fixed Amount ($)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    disabled={formData.isMissed}
                                    value={formData.isMissed ? 0 : formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl pl-8 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                            <input
                                id="isMissed"
                                type="checkbox"
                                checked={formData.isMissed}
                                onChange={e => setFormData({ ...formData, isMissed: e.target.checked, amount: e.target.checked ? 0 : 10 })}
                                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-100 rounded-lg cursor-pointer transition-all"
                            />
                            <label htmlFor="isMissed" className="text-sm font-bold text-purple-700 cursor-pointer select-none">
                                Mark as Absent (Missed Today)
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-2xl py-4 transition-all shadow-xl shadow-purple-100 flex items-center justify-center gap-2 active:scale-95"
                        >
                            {submitting ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Verify & Save
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Member Savings Overview */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-gradient-to-br from-purple-600 to-violet-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-purple-100 flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
                    <div className="relative z-10 text-center sm:text-left">
                        <p className="text-purple-100 text-xs font-black uppercase tracking-widest mb-2 opacity-80">Total Pooled Capital</p>
                        <h2 className="text-5xl font-black tracking-tighter">${Number(report.groupTotal).toFixed(2)}</h2>
                        <p className="text-purple-200 text-sm mt-3 font-medium">Shared amongst {report.members.length} active cooperative members</p>
                    </div>
                    <div className="relative z-10 w-full sm:w-auto">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl flex flex-col items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-1">Group Status</span>
                            <span className="text-sm font-bold block">Active & Healthy</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Member Portfolios</h2>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-sm text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Live Ranking
                        </div>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {loading ? (
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm text-gray-400 font-medium">Reconciling cooperative ledger...</p>
                            </div>
                        ) : report.members.length === 0 ? (
                            <div className="p-20 text-center flex flex-col items-center gap-4 opacity-30">
                                <span className="text-5xl">🏦</span>
                                <p className="text-gray-500 font-medium tracking-tight">The vault is currently empty.</p>
                            </div>
                        ) : (
                            report.members.sort((a, b) => b.total - a.total).map((row) => (
                                <div key={row.member.id} className="p-6 sm:px-8 hover:bg-purple-50/30 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-lg font-black text-purple-600 border border-gray-100 group-hover:bg-white group-hover:scale-110 transition-all">
                                            {row.member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 leading-tight">{row.member.name}</h3>
                                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {row.entries.length} days
                                                </span>
                                                {row.missed > 0 && (
                                                    <span className="text-rose-500 font-bold flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                        {row.missed} missed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-gray-900 group-hover:text-purple-600 transition-colors tracking-tight">${row.total.toFixed(2)}</div>
                                        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5 opacity-80">Personal Stake</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
