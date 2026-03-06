import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Categories() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCategory) {
                await api.patch(`/categories/${editingCategory.id}`, formData);
                toast.success(`Category "${formData.name}" updated!`);
            } else {
                await api.post('/categories', formData);
                toast.success(`Category "${formData.name}" created!`);
            }
            handleCloseModal();
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, name, productCount) => {
        if (productCount > 0) {
            toast.error(`Cannot delete "${name}" — it has ${productCount} product(s). Re-assign them first.`);
            return;
        }
        if (!window.confirm(`Permanently delete category "${name}"?`)) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success(`Category "${name}" deleted`);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Category Management</h1>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        {categories.length} categories defined
                    </p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                        + New Category
                    </button>
                )}
            </div>

            {/* Info banner for non-admins */}
            {!isAdmin && (
                <div className="bg-indigo-50/50 backdrop-blur-sm border border-indigo-100 rounded-2xl px-5 py-4 text-sm text-indigo-700 flex items-center gap-3">
                    <span className="text-lg">ℹ️</span>
                    You are viewing categories in read-only mode. Only Admins can create or modify categories.
                </div>
            )}

            {/* Category Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-gray-50 animate-pulse rounded-2xl border border-gray-100"></div>
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-20 flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl">📦</div>
                    <div>
                        <p className="text-gray-500 font-semibold text-lg">No categories yet</p>
                        <p className="text-gray-400 text-sm">Start by creating a category to organize your products.</p>
                    </div>
                    {isAdmin && (
                        <button onClick={() => handleOpenModal()} className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
                            Create your first category →
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => {
                        const productCount = cat.products?.length ?? 0;
                        return (
                            <div key={cat.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{cat.name}</h3>
                                        {cat.description ? (
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                                        ) : (
                                            <p className="text-sm text-gray-300 italic mt-1 font-light">No description provided</p>
                                        )}
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${productCount > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-400'}`}>
                                        {productCount} {productCount === 1 ? 'item' : 'items'}
                                    </span>
                                </div>
                                {isAdmin && (
                                    <div className="pt-4 border-t border-gray-50 flex items-center gap-4">
                                        <button
                                            onClick={() => handleOpenModal(cat)}
                                            className="text-xs font-bold text-gray-500 hover:text-indigo-600 transition flex items-center gap-1.5"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id, cat.name, productCount)}
                                            disabled={productCount > 0}
                                            className={`text-xs font-bold transition flex items-center gap-1.5 ${productCount > 0 ? 'text-gray-200 cursor-not-allowed' : 'text-rose-500 hover:text-rose-700'}`}
                                            title={productCount > 0 ? 'Cannot delete — has linked products' : 'Delete category'}
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity" onClick={handleCloseModal} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10 animate-in fade-in zoom-in duration-300">
                        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-8 py-6 text-white">
                            <h3 className="text-xl font-bold tracking-tight">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                            <p className="text-indigo-100 text-sm mt-1 opacity-90">
                                {editingCategory ? `Modifying "${editingCategory.name}"` : 'Organize your inventory effectively'}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category Name *</label>
                                <input
                                    type="text" required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                                    placeholder="e.g. Beverages, Electronics..."
                                    maxLength={100}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description <span className="font-normal lowercase text-gray-400 opacity-75">(optional)</span></label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium resize-none"
                                    rows={3}
                                    placeholder="Brief description of this category..."
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl py-3.5 text-sm transition-all shadow-lg shadow-indigo-200 active:scale-95"
                                >
                                    {submitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Saving...
                                        </span>
                                    ) : editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl py-3.5 text-sm transition-all active:scale-95"
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
