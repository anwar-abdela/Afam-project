import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Sales() {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ productId: '', quantity: 1 });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const [prodRes, salesRes] = await Promise.all([
                api.get('/products'),
                api.get('/sales')
            ]);
            setProducts(prodRes.data.filter(p => !p.isArchived && p.quantity > 0));
            setSales(salesRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.productId) return toast.error('Select a product');

        setSubmitting(true);
        try {
            await api.post('/sales', {
                productId: formData.productId,
                quantity: Number(formData.quantity)
            });
            toast.success('Sale recorded successfully');
            setFormData({ productId: '', quantity: 1 });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to record sale');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-fade-in">
            {/* New Sale Form */}
            <div className="xl:col-span-1">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-6 sticky top-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Record Sale</h2>
                        <p className="text-sm text-gray-500 mt-1">Submit a new transaction</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Select Product</label>
                            <div className="relative group">
                                <select
                                    required
                                    value={formData.productId}
                                    onChange={e => setFormData({ ...formData, productId: e.target.value })}
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-semibold appearance-none cursor-pointer"
                                >
                                    <option value="">Choose a product...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} — ${Number(p.sellingPrice).toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                            {formData.productId && (
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter px-1 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    In Stock: {products.find(p => p.id === formData.productId)?.quantity} units
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                required
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-black text-lg"
                                placeholder="0"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl py-4 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95"
                            >
                                {submitting ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Record Sale
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Recent Sales Table */}
            <div className="xl:col-span-3">
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recent Transactions</h2>
                            <p className="text-sm text-gray-400 font-medium">Monitoring real-time sales performance</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-gray-500 border border-gray-100 shadow-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            Live Feed
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Time & Date</th>
                                    <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Product Information</th>
                                    <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Details</th>
                                    <th className="px-8 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Financial Impact</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-sm text-gray-400 font-medium">Fetching history...</p>
                                        </div>
                                    </td></tr>
                                ) : sales.length === 0 ? (
                                    <tr><td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <span className="text-4xl text-gray-300">📈</span>
                                            <p className="text-gray-500 font-medium text-sm">No sales data available yet.</p>
                                        </div>
                                    </td></tr>
                                ) : (
                                    sales.slice(0, 15).map((sale) => (
                                        <tr key={sale.id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <p className="text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors">{new Date(sale.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                <p className="text-[10px] font-medium text-gray-300 italic group-hover:text-gray-400 transition-colors">{new Date(sale.saleDate).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <p className="text-sm font-black text-gray-900 group-hover:text-indigo-700 transition-colors">{sale.product?.name || 'Archived Item'}</p>
                                                <p className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">{sale.product?.sku || 'N/A'}</p>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">{sale.quantity}x</span>
                                                    <span className="text-xs font-medium text-gray-400">@ ${Number(sale.unitPrice).toFixed(2)}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right">
                                                <p className="text-sm font-black text-indigo-600">${Number(sale.totalPrice).toFixed(2)}</p>
                                                <p className="text-[10px] font-bold text-emerald-500 opacity-75">+${Number(sale.profit).toFixed(2)} net profit</p>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {sales.length > 15 && (
                        <div className="p-4 bg-gray-50/50 text-center">
                            <button className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Load more activity</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
