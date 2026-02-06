import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, ArrowUpDown, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/modal';
import { productsAPI } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        category: '',
        price: '',
        stock: ''
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productsAPI.getAll();
            setProducts(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            sku: '',
            name: '',
            category: '',
            price: '',
            stock: ''
        });
    };

    const handleAdd = async () => {
        if (!formData.name || !formData.sku || !formData.price) {
            alert('Por favor complete los campos requeridos (SKU, Nombre, Precio)');
            return;
        }

        setIsSubmitting(true);
        try {
            await productsAPI.create({
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0
            });
            await loadProducts();
            setIsAddModalOpen(false);
            resetForm();
        } catch (err) {
            alert('Error al crear producto: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async () => {
        if (!formData.name || !formData.sku || !formData.price) {
            alert('Por favor complete los campos requeridos');
            return;
        }

        setIsSubmitting(true);
        try {
            await productsAPI.update(currentProduct.id, {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0
            });
            await loadProducts();
            setIsEditModalOpen(false);
            setCurrentProduct(null);
            resetForm();
        } catch (err) {
            alert('Error al actualizar producto: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (product) => {
        if (!confirm(`¿Eliminar "${product.name}"?`)) return;

        try {
            await productsAPI.delete(product.id);
            await loadProducts();
        } catch (err) {
            alert('Error al eliminar producto: ' + err.message);
        }
    };

    const openEditModal = (product) => {
        setCurrentProduct(product);
        setFormData({
            sku: product.sku,
            name: product.name,
            category: product.category || '',
            price: product.price.toString(),
            stock: product.stock.toString()
        });
        setIsEditModalOpen(true);
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return 'Agotado';
        if (stock <= 20) return 'Bajo Stock';
        return 'Disponible';
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="bg-mesh-gradient pt-12 pb-24 px-4 md:px-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Inventario</h2>
                        <p className="text-blue-100 text-base md:text-lg opacity-90">Gestión de productos y existencias</p>
                    </div>
                    <Button
                        className="bg-white text-primary hover:bg-blue-50 font-bold px-6 h-12 shadow-lg rounded-xl active:scale-95 transition-all"
                        onClick={() => {
                            resetForm();
                            setIsAddModalOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-5 w-5" /> Agregar Producto
                    </Button>
                </div>
            </div>

            <div className="px-4 md:px-8 -mt-16 relative z-20 pb-12">
                <Card className="border-none shadow-xl transition-all duration-300">
                    <CardHeader className="p-4 md:p-6 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    className="pl-10 h-11 bg-slate-50 border-none shadow-inner"
                                    placeholder="Buscar por nombre, código o categoría..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <LoadingSpinner size="lg" text="Cargando inventario..." className="py-20" />
                        ) : error ? (
                            <ErrorMessage error={error} onRetry={loadProducts} className="py-20" />
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground">
                                <Package size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No hay productos en el inventario</p>
                                <Button onClick={() => setIsAddModalOpen(true)} className="mt-4">
                                    <Plus className="mr-2" size={16} />
                                    Agregar Primer Producto
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-gray-100">
                                                <th className="px-4 md:px-6 py-4 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">SKU</th>
                                                <th className="px-4 md:px-6 py-4 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">Producto</th>
                                                <th className="hidden md:table-cell px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Categoría</th>
                                                <th className="px-4 md:px-6 py-4 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider text-right">Precio</th>
                                                <th className="px-4 md:px-6 py-4 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider text-center">Stock</th>
                                                <th className="hidden lg:table-cell px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider text-center">Estado</th>
                                                <th className="px-4 md:px-6 py-4 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredProducts.map((product) => {
                                                const status = getStockStatus(product.stock);
                                                return (
                                                    <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                                                        <td className="px-4 md:px-6 py-4 font-mono text-xs text-gray-500">{product.sku}</td>
                                                        <td className="px-4 md:px-6 py-4">
                                                            <span className="font-bold text-gray-800">{product.name}</span>
                                                        </td>
                                                        <td className="hidden md:table-cell px-6 py-4">
                                                            <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">
                                                                {product.category || 'Sin categoría'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 md:px-6 py-4 text-right font-black text-gray-700">
                                                            C$ {Number(product.price).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 md:px-6 py-4 text-center">
                                                            <span className={cn(
                                                                "font-bold",
                                                                product.stock <= 20 ? "text-orange-600" : "text-gray-800"
                                                            )}>
                                                                {product.stock}
                                                            </span>
                                                        </td>
                                                        <td className="hidden lg:table-cell px-6 py-4 text-center">
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                                status === 'Disponible' && "bg-green-50 text-green-600 border-green-200",
                                                                status === 'Bajo Stock' && "bg-orange-50 text-orange-600 border-orange-200",
                                                                status === 'Agotado' && "bg-red-50 text-red-600 border-red-200",
                                                            )}>
                                                                {status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 md:px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-100"
                                                                    onClick={() => openEditModal(product)}
                                                                >
                                                                    <Edit2 size={16} />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-red-600 hover:bg-red-100"
                                                                    onClick={() => handleDelete(product)}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 md:p-6 border-t border-gray-100 flex justify-between items-center bg-slate-50/30">
                                    <span className="text-sm text-muted-foreground font-medium">
                                        Mostrando {filteredProducts.length} de {products.length} productos
                                    </span>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                }}
                title="Agregar Nuevo Producto"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button onClick={handleAdd} disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Nombre del Producto *</label>
                            <Input
                                placeholder="Ej. Paracetamol"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Código / SKU *</label>
                            <Input
                                placeholder="Ej. PARA500"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Categoría</label>
                        <Input
                            placeholder="Ej. Analgésicos"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Precio (C$) *</label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Stock Inicial</label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setCurrentProduct(null);
                    resetForm();
                }}
                title="Editar Producto"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button onClick={handleEdit} disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Actualizar Producto'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Nombre del Producto *</label>
                            <Input
                                placeholder="Ej. Paracetamol"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Código / SKU *</label>
                            <Input
                                placeholder="Ej. PARA500"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Categoría</label>
                        <Input
                            placeholder="Ej. Analgésicos"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Precio (C$) *</label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Stock</label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default Inventory;
