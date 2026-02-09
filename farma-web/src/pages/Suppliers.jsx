import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Phone, Mail, MapPin, ExternalLink, ShoppingCart, Loader2, Trash2, Edit2, CheckCircle } from 'lucide-react';
import Modal from '@/components/ui/modal';
import AlertModal from '@/components/ui/AlertModal';
import { suppliersAPI, productsAPI, purchasesAPI } from '@/services/api';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Alert State
    const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    const showAlert = (title, message, type = 'info') => {
        setAlertState({ isOpen: true, title, message, type });
    };

    // Forms
    const [supplierForm, setSupplierForm] = useState({ name: '', contact_person: '', phone: '', email: '', address: '', category: '' });

    // Order Form
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [orderCost, setOrderCost] = useState(0);
    const [pendingPurchases, setPendingPurchases] = useState([]);

    useEffect(() => {
        loadSuppliers();
        loadProducts();
        loadPurchases();
    }, []);

    const loadPurchases = async () => {
        try {
            const data = await purchasesAPI.getAll();
            const pending = data.filter(p => p.status === 'pending');
            setPendingPurchases(pending);
        } catch (err) {
            console.error('Error loading purchases:', err);
        }
    };

    const loadSuppliers = async () => {
        try {
            setLoading(true);
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
            console.error('Error loading products for orders:', err);
        }
    };

    const handleSaveSupplier = async () => {
        if (!supplierForm.name) return showAlert('Campo Requerido', 'El nombre de la empresa es obligatorio', 'error');
        setIsSubmitting(true);
        try {
            if (selectedSupplier) {
                await suppliersAPI.update(selectedSupplier.id, supplierForm);
            } else {
                await suppliersAPI.create(supplierForm);
            }
            await loadSuppliers();
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
            showAlert('Éxito', selectedSupplier ? 'Proveedor actualizado correctamente' : 'Proveedor creado correctamente', 'success');
        } catch (err) {
            showAlert('Error', err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (supplier) => {
        setSelectedSupplier(supplier);
        setSupplierForm(supplier);
        setIsEditModalOpen(true);
    };

    const openOrderModal = (supplier) => {
        setSelectedSupplier(supplier);
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

        // Reset item fields
        setOrderQuantity(1);
        setOrderCost(0);
    };

    const removeFromOrder = (index) => {
        const newItems = [...orderItems];
        newItems.splice(index, 1);
        setOrderItems(newItems);
    };

    const handleCreateOrder = async () => {
        if (orderItems.length === 0) return showAlert('Atención', 'Debes agregar al menos un producto al pedido', 'error');
        setIsSubmitting(true);
        try {
            const total = orderItems.reduce((sum, item) => sum + (item.quantity * item.cost_price), 0);
            await purchasesAPI.create({
                supplier_id: selectedSupplier.id,
                total: total,
                items: orderItems
            });
            setIsOrderModalOpen(false);
            loadPurchases(); // Refresh pending orders
            showAlert('¡Solicitud Enviada!', 'El pedido se ha registrado como PENDIENTE. Confírmalo cuando recibas la mercadería.', 'success');
        } catch (err) {
            showAlert('Error en Pedido', err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReceiveOrder = async (purchaseId) => {
        try {
            await purchasesAPI.receive(purchaseId);
            showAlert('¡Mercadería Recibida!', 'El stock se ha actualizado correctamente.', 'success');
            loadPurchases(); // Refresh list
            loadProducts(); // Refresh product stock (if we displayed it)
        } catch (err) {
            showAlert('Error al Recepcionar', err.message, 'error');
        }
    };

    const resetForm = () => {
        setSupplierForm({ name: '', contact_person: '', phone: '', email: '', address: '', category: '' });
        setSelectedSupplier(null);
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.contact_person && s.contact_person.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <Layout>
            <div className="bg-mesh-gradient pt-12 pb-24 px-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">Proveedores</h2>
                        <p className="text-blue-100 text-lg opacity-90">Gestión de alianzas y pedidos de reabastecimiento</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 h-12 shadow-lg rounded-xl active:scale-95 transition-all backdrop-blur-sm border border-white/30"
                            onClick={() => setIsPendingModalOpen(true)}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Pendientes ({pendingPurchases.length})
                        </Button>
                        <Button
                            className="bg-white text-primary hover:bg-blue-50 font-bold px-6 h-12 shadow-lg rounded-xl active:scale-95 transition-all"
                            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                        >
                            <Plus className="mr-2 h-5 w-5" /> Nuevo Proveedor
                        </Button>
                    </div>
                </div>
            </div>

            <div className="px-8 -mt-16 relative z-20 pb-12">
                <div className="mb-8 relative max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    <Input
                        className="pl-12 h-14 bg-white border-none shadow-xl rounded-2xl text-lg"
                        placeholder="Buscar por nombre, contacto o ubicación..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSuppliers.map((s) => (
                            <Card key={s.id} className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                                <div className="h-2 bg-primary group-hover:h-3 transition-all duration-300"></div>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-2xl font-black text-gray-800">{s.name}</CardTitle>
                                        <Button variant="ghost" size="icon" className="text-primary hover:bg-blue-50" onClick={() => openEditModal(s)}>
                                            <Edit2 size={18} />
                                        </Button>
                                    </div>
                                    <p className="text-primary font-bold text-sm uppercase tracking-widest">{s.contact_person || 'Sin contacto'}</p>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                                            <Phone size={16} />
                                        </div>
                                        <span className="font-semibold">{s.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                                            <Mail size={16} />
                                        </div>
                                        <span className="font-semibold truncate">{s.email || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-600">
                                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary mt-1">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="text-sm font-medium">{s.address || 'N/A'}</span>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase">{s.category}</span>
                                        <Button
                                            variant="secondary"
                                            className="px-4 py-1 h-8 text-xs font-black uppercase tracking-tighter rounded-lg gap-2"
                                            onClick={() => openOrderModal(s)}
                                        >
                                            <ShoppingCart size={14} /> Solicitar Pedido
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Supplier Modal */}
            <Modal
                isOpen={isAddModalOpen || isEditModalOpen}
                onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                title={isEditModalOpen ? "Editar Proveedor" : "Nuevo Proveedor"}
                footer={
                    <>
                        <Button variant="outline" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>Cancelar</Button>
                        <Button onClick={handleSaveSupplier} disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Empresa / Razón Social *</label>
                        <Input
                            placeholder="Ej. Distribuidora Farma"
                            value={supplierForm.name}
                            onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Contacto</label>
                            <Input
                                placeholder="Ej. Ana García"
                                value={supplierForm.contact_person}
                                onChange={e => setSupplierForm({ ...supplierForm, contact_person: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Categoría</label>
                            <Input
                                placeholder="Ej. Medicamentos"
                                value={supplierForm.category}
                                onChange={e => setSupplierForm({ ...supplierForm, category: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Teléfono</label>
                            <Input
                                placeholder="+505 8888-8888"
                                value={supplierForm.phone}
                                onChange={e => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email</label>
                            <Input
                                placeholder="contacto@empresa.com"
                                value={supplierForm.email}
                                onChange={e => setSupplierForm({ ...supplierForm, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Dirección</label>
                        <Input
                            placeholder="Dirección completa..."
                            value={supplierForm.address}
                            onChange={e => setSupplierForm({ ...supplierForm, address: e.target.value })}
                        />
                    </div>
                </div>
            </Modal>

            {/* Create Order (Purchase) Modal */}
            <Modal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                title={`Nueva Solicitud a ${selectedSupplier?.name}`}
                className="max-w-2xl"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsOrderModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreateOrder} disabled={isSubmitting || orderItems.length === 0}>
                            {isSubmitting ? 'Procesando...' : 'Confirmar Solicitud'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 className="font-bold text-blue-800 mb-3 text-sm uppercase">Agregar Producto al Pedido</h4>
                        <div className="grid grid-cols-12 gap-3 items-end">
                            <div className="col-span-12 md:col-span-5">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Producto</label>
                                <select
                                    className="w-full h-10 rounded-lg border-gray-300 text-sm"
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                >
                                    <option value="">Seleccionar...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-6 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Cant.</label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={orderQuantity}
                                    onChange={(e) => setOrderQuantity(e.target.value)}
                                    className="h-10"
                                />
                            </div>
                            <div className="col-span-6 md:col-span-3">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Costo Unit.</label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={orderCost}
                                    onChange={(e) => setOrderCost(e.target.value)}
                                    className="h-10"
                                />
                            </div>
                            <div className="col-span-12 md:col-span-2">
                                <Button onClick={addToOrder} className="w-full h-10 font-bold" disabled={!selectedProduct}>
                                    <Plus size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">Resumen del Pedido</h4>
                        <div className="border rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-500 font-bold">
                                    <tr>
                                        <th className="px-4 py-2">Producto</th>
                                        <th className="px-4 py-2 text-center">Cant.</th>
                                        <th className="px-4 py-2 text-right">Costo</th>
                                        <th className="px-4 py-2 text-right">Subtotal</th>
                                        <th className="px-4 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orderItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-gray-400 italic">No hay productos agregados</td>
                                        </tr>
                                    ) : (
                                        orderItems.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2 font-medium">{item.name}</td>
                                                <td className="px-4 py-2 text-center">{item.quantity}</td>
                                                <td className="px-4 py-2 text-right">C$ {item.cost_price.toFixed(2)}</td>
                                                <td className="px-4 py-2 text-right font-bold">C$ {(item.cost_price * item.quantity).toFixed(2)}</td>
                                                <td className="px-4 py-2 text-right">
                                                    <button onClick={() => removeFromOrder(idx)} className="text-red-500 hover:text-red-700">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                <tfoot className="bg-gray-50 font-bold text-gray-800">
                                    <tr>
                                        <td colSpan="3" className="px-4 py-3 text-right">TOTAL ESTIMADO</td>
                                        <td className="px-4 py-3 text-right text-lg text-primary">
                                            C$ {orderItems.reduce((sum, item) => sum + (item.quantity * item.cost_price), 0).toFixed(2)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Pending Orders Modal */}
            <Modal
                isOpen={isPendingModalOpen}
                onClose={() => setIsPendingModalOpen(false)}
                title="Pedidos Pendientes de Recepción"
                className="max-w-4xl"
                footer={
                    <Button variant="outline" onClick={() => setIsPendingModalOpen(false)}>Cerrar</Button>
                }
            >
                <div className="space-y-4">
                    {pendingPurchases.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No hay pedidos pendientes</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pendingPurchases.map(p => (
                                <div key={p.id} className="bg-white border border-l-4 border-l-yellow-400 rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">Pendiente</span>
                                            <span className="text-gray-400 text-sm">{new Date(p.timestamp).toLocaleString()}</span>
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-lg">{p.supplier_name || 'Proveedor Desconocido'}</h4>
                                        <p className="text-gray-600">Total: <span className="font-black text-primary">C$ {parseFloat(p.total).toFixed(2)}</span></p>
                                    </div>
                                    <Button
                                        onClick={() => handleReceiveOrder(p.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" /> Confirmar Recepción
                                    </Button>
                                </div>
                            ))}
                        </div>
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
