import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Phone, Mail, MapPin, Globe, ExternalLink, Edit2, Trash2, Building2, ShoppingCart, CheckCircle } from 'lucide-react';
import Modal from '@/components/ui/modal';
import AlertModal from '@/components/ui/AlertModal';
import { suppliersAPI, productsAPI, purchasesAPI } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentSupplier, setCurrentSupplier] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Order State
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [orderCost, setOrderCost] = useState(0);
    const [pendingPurchases, setPendingPurchases] = useState([]);

    // Alert State
    const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    const showAlert = (title, message, type = 'info') => {
        setAlertState({ isOpen: true, title, message, type });
    };

    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        category: ''
    });

    useEffect(() => {
        loadSuppliers();
        loadProducts();
        loadPurchases();
    }, []);

    const loadSuppliers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await suppliersAPI.getAll();
            setSuppliers(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            const data = await productsAPI.getAll();
            setProducts(data);
        } catch (err) {
            console.error('Error loading products:', err);
        }
    };

    const loadPurchases = async () => {
        try {
            const data = await purchasesAPI.getAll();
            const pending = data.filter(p => p.status === 'pending');
            setPendingPurchases(pending);
        } catch (err) {
            console.error('Error loading purchases:', err);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', contact_person: '', phone: '', email: '', category: '' });
        setCurrentSupplier(null);
    };

    const handleAdd = async () => {
        if (!formData.name) return showAlert('Error', 'El nombre es requerido', 'error');
        setIsSubmitting(true);
        try {
            await suppliersAPI.create(formData);
            await loadSuppliers();
            setIsAddModalOpen(false);
            resetForm();
            showAlert('Éxito', 'Proveedor creado correctamente', 'success');
        } catch (err) {
            showAlert('Error', err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async () => {
        if (!formData.name) return showAlert('Error', 'El nombre es requerido', 'error');
        setIsSubmitting(true);
        try {
            await suppliersAPI.update(currentSupplier.id, formData);
            await loadSuppliers();
            setIsEditModalOpen(false);
            setCurrentSupplier(null);
            resetForm();
            showAlert('Éxito', 'Proveedor actualizado correctamente', 'success');
        } catch (err) {
            showAlert('Error', err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (supplier) => {
        if (!confirm(`¿Eliminar proveedor "${supplier.name}"?`)) return;
        try {
            await suppliersAPI.delete(supplier.id);
            await loadSuppliers();
            showAlert('Éxito', 'Proveedor eliminado', 'success');
        } catch (err) {
            showAlert('Error', err.message, 'error');
        }
    };

    const openEditModal = (supplier) => {
        setCurrentSupplier(supplier);
        setFormData({
            name: supplier.name,
            contact_person: supplier.contact_person || '',
            phone: supplier.phone || '',
            email: supplier.email || '',
            category: supplier.category || ''
        });
        setIsEditModalOpen(true);
    };

    const openOrderModal = (supplier) => {
        setCurrentSupplier(supplier);
        setOrderItems([]);
        setIsOrderModalOpen(true);
    };

    const addToOrder = () => {
        if (!selectedProduct) return;
        const product = products.find(p => p.id.toString() === selectedProduct);
        if (!product) return;

        setOrderItems([...orderItems, {
            product_id: product.id,
            name: product.name,
            quantity: parseInt(orderQuantity),
            cost_price: parseFloat(orderCost)
        }]);
        setOrderQuantity(1);
        setOrderCost(0);
    };

    const removeFromOrder = (index) => {
        const newItems = [...orderItems];
        newItems.splice(index, 1);
        setOrderItems(newItems);
    };

    const handleCreateOrder = async () => {
        if (orderItems.length === 0) return showAlert('Atención', 'Agrega al menos un producto', 'error');
        setIsSubmitting(true);
        try {
            const total = orderItems.reduce((sum, item) => sum + (item.quantity * item.cost_price), 0);
            await purchasesAPI.create({
                supplier_id: currentSupplier.id,
                total: total,
                items: orderItems
            });
            setIsOrderModalOpen(false);
            loadPurchases();
            showAlert('¡Solicitud Enviada!', 'El pedido está PENDIENTE. Confírmalo al recibir la carga.', 'success');
        } catch (err) {
            showAlert('Error', err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReceiveOrder = async (purchaseId) => {
        try {
            await purchasesAPI.receive(purchaseId);
            showAlert('¡Recibido!', 'Stock actualizado correctamente.', 'success');
            loadPurchases();
            loadProducts();
        } catch (err) {
            showAlert('Error', err.message, 'error');
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.contact_person?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="bg-mesh-gradient pt-8 pb-20 px-4 text-white relative">
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-3xl font-black mb-1">Proveedores</h2>
                        <p className="text-blue-100 text-sm opacity-90">Gestión de suministros</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30"
                            onClick={() => setIsPendingModalOpen(true)}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Pendientes ({pendingPurchases.length})
                        </Button>
                        <Button
                            className="flex-1 bg-white text-primary hover:bg-blue-50"
                            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Nuevo
                        </Button>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-12 relative z-20 pb-20">
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                        <Input
                            className="pl-10 h-12 bg-white border-none shadow-lg rounded-xl"
                            placeholder="Buscar proveedor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid gap-4">
                        {filteredSuppliers.map((s) => (
                            <Card key={s.id} className="border-none shadow-md overflow-hidden">
                                <CardHeader className="pb-2 p-4">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-bold text-gray-800">{s.name}</CardTitle>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => openEditModal(s)}><Edit2 size={16} /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(s)}><Trash2 size={16} /></Button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-uppercase font-bold text-primary tracking-wider">{s.contact_person}</p>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone size={14} className="text-primary" /> {s.phone || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail size={14} className="text-primary" /> {s.email || 'N/A'}
                                    </div>
                                    <Button
                                        className="w-full mt-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                                        onClick={() => openOrderModal(s)}
                                    >
                                        <ShoppingCart size={16} className="mr-2" /> Solicitar Pedido
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isAddModalOpen || isEditModalOpen}
                onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                title={isEditModalOpen ? "Editar" : "Nuevo Proveedor"}
                footer={
                    <div className="flex gap-2 w-full">
                        <Button variant="outline" className="flex-1" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>Cancelar</Button>
                        <Button className="flex-1" onClick={isEditModalOpen ? handleEdit : handleAdd} disabled={isSubmitting}>Guardar</Button>
                    </div>
                }
            >
                <div className="space-y-3">
                    <Input placeholder="Nombre Empresa *" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <Input placeholder="Contacto" value={formData.contact_person} onChange={e => setFormData({ ...formData, contact_person: e.target.value })} />
                    <Input placeholder="Teléfono" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    <Input placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <Input placeholder="Categoría" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                </div>
            </Modal>

            {/* Order Modal */}
            <Modal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                title="Nueva Solicitud"
                footer={
                    <div className="flex gap-2 w-full">
                        <Button variant="outline" className="flex-1" onClick={() => setIsOrderModalOpen(false)}>Cancelar</Button>
                        <Button className="flex-1" onClick={handleCreateOrder} disabled={isSubmitting || orderItems.length === 0}>Confirmar</Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                        <label className="text-xs font-bold uppercase text-gray-500">Agregar Producto</label>
                        <select className="w-full p-2 text-sm border rounded-md" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                            <option value="">Seleccionar...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <div className="flex gap-2">
                            <Input type="number" placeholder="Cant." min="1" className="flex-1" value={orderQuantity} onChange={e => setOrderQuantity(e.target.value)} />
                            <Input type="number" placeholder="Costo" min="0" className="flex-1" value={orderCost} onChange={e => setOrderCost(e.target.value)} />
                            <Button size="icon" onClick={addToOrder} disabled={!selectedProduct}><Plus size={18} /></Button>
                        </div>
                    </div>

                    <div className="max-h-40 overflow-y-auto border rounded-lg">
                        {orderItems.length === 0 ? (
                            <p className="text-center py-4 text-xs text-gray-400">Sin productos</p>
                        ) : (
                            orderItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 border-b text-sm">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} x C$ {item.cost_price}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeFromOrder(idx)}><Trash2 size={14} /></Button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="text-right font-bold text-primary">
                        Total: C$ {orderItems.reduce((sum, item) => sum + (item.quantity * item.cost_price), 0).toFixed(2)}
                    </div>
                </div>
            </Modal>

            {/* Pending Orders Modal */}
            <Modal
                isOpen={isPendingModalOpen}
                onClose={() => setIsPendingModalOpen(false)}
                title="Pedidos Pendientes"
                footer={<Button variant="outline" className="w-full" onClick={() => setIsPendingModalOpen(false)}>Cerrar</Button>}
            >
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {pendingPurchases.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay pedidos pendientes</p>
                    ) : (
                        pendingPurchases.map(p => (
                            <div key={p.id} className="bg-white border rounded-xl p-3 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-sm">{p.supplier_name}</h4>
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Pendiente</span>
                                    </div>
                                    <span className="font-bold text-primary">C$ {parseFloat(p.total).toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-3">{new Date(p.timestamp).toLocaleString()}</p>
                                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleReceiveOrder(p.id)}>
                                    <CheckCircle size={14} className="mr-2" /> Confirmar Recepción
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </Modal>

            <AlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />
        </Layout>
    );
};

export default Suppliers;
