import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Products() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', sku: '', categoryId: '', quantity: 0, purchasePrice: 0, sellingPrice: 0
    });

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch {
            // silently fail
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', sku: '', categoryId: '', quantity: 0, purchasePrice: 0, sellingPrice: 0 });
        setEditingProduct(null);
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                sku: product.sku,
                categoryId: product.category?.id || '',
                quantity: product.quantity,
                purchasePrice: product.purchasePrice,
                sellingPrice: product.sellingPrice
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (!payload.categoryId) delete payload.categoryId;

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
                toast.success('Product updated successfully');
            } else {
                await api.post('/products', payload);
                toast.success('Product created successfully');
            }
            setIsModalOpen(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    const handleArchive = async (id, name) => {
        if (!window.confirm(`Archive "${name}"? It will be hidden from the active inventory.`)) return;
        try {
            await api.patch(`/products/${id}/archive`);
            toast.success('Product archived');
            fetchProducts();
        } catch {
            toast.error('Failed to archive product');
        }
    };

    const stockBadge = (qty) => {
        if (qty === 0) return 'bg-rose-100 text-rose-700 ring-1 ring-rose-200';
        if (qty < 5) return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200';
        return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200';
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        {products.length} active products in stock
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {isAdmin && (
                        <>
                            <a
                                href="/categories"
                                className="hidden md:flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors gap-1"
                            >
                                Manage Categories <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </a>
                            <button
                                onClick={() => handleOpenModal()}
                                className="flex-1 sm:flex-none bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                            >
                                + Add Product
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">SKU Details</th>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Product Name</th>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">In Stock</th>
                                <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pricing (Buy/Sell)</th>
                                {isAdmin && (
                                    <th className="px-8 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={isAdmin ? 6 : 5} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-sm text-gray-400 font-medium font-sans">Syncing inventory...</p>
                                    </div>
                                </td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={isAdmin ? 6 : 5} className="px-8 py-20 text-center flex flex-col items-center justify-center gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl opacity-50">📦</div>
                                    <p className="text-gray-400 font-medium">No products found in your inventory.</p>
                                </td></tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-500 font-mono tracking-tighter">
                                                {p.sku}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{p.name}</p>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            {p.category ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-600">
                                                    {p.category.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 text-xs italic">Uncategorized</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${stockBadge(p.quantity)}`}>
                                                {p.quantity} {p.quantity === 1 ? 'unit' : 'units'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 line-through">${Number(p.purchasePrice).toFixed(2)}</span>
                                                <span className="text-sm font-black text-gray-900">${Number(p.sellingPrice).toFixed(2)}</span>
                                            </div>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-8 py-5 whitespace-nowrap text-right text-xs font-bold space-x-4">
                                                <button
                                                    onClick={() => handleOpenModal(p)}
                                                    className="text-gray-400 hover:text-indigo-600 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleArchive(p.id, p.name)}
                                                    className="text-rose-400 hover:text-rose-600 transition"
                                                >
                                                    Archive
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => { setIsModalOpen(false); resetForm(); }} />
                    <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-8 py-8 text-white">
                            <h3 className="text-2xl font-bold tracking-tight">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <p className="text-indigo-100 text-sm mt-1 opacity-90">
                                {editingProduct ? `Updating inventory for ${editingProduct.name}` : 'Create a new item in your digital catalog'}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Name *</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                                        placeholder="e.g. Arabica Coffee"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">SKU / Code *</label>
                                    <input
                                        type="text" required
                                        value={formData.sku}
                                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium font-mono"
                                        placeholder="e.g. COF-001"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium appearance-none cursor-pointer"
                                >
                                    <option value="">— Uncategorized —</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {categories.length === 0 && (
                                    <p className="text-[10px] text-amber-600 mt-2 font-bold uppercase tracking-wider">No categories found. <a href="/categories" className="underline underline-offset-2">Go create one first</a></p>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Quantity</label>
                                    <input
                                        type="number" min="0" required
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Buy Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                        <input
                                            type="number" step="0.01" min="0" required
                                            value={formData.purchasePrice}
                                            onChange={e => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                                            className="w-full bg-gray-50 border border-transparent rounded-2xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-bold text-rose-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sell Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                        <input
                                            type="number" step="0.01" min="0" required
                                            value={formData.sellingPrice}
                                            onChange={e => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                                            className="w-full bg-gray-50 border border-transparent rounded-2xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-bold text-emerald-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl py-4 text-sm transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
                                >
                                    {editingProduct ? 'Save Changes' : 'Create Product'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setIsModalOpen(false); resetForm(); }}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl py-4 text-sm transition-all active:scale-[0.98]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
