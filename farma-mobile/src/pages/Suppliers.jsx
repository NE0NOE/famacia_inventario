import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Phone, Mail, MapPin, Globe, ExternalLink, Edit2, Trash2, Building2 } from 'lucide-react';
import Modal from '@/components/ui/modal';
import { suppliersAPI } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSupplier, setCurrentSupplier] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        category: ''
    });

    useEffect(() => {
        loadSuppliers();
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

    const resetForm = () => {
        setFormData({
            name: '',
            contact_person: '',
            phone: '',
            email: '',
            category: ''
        });
    };

    const handleAdd = async () => {
        if (!formData.name) {
            alert('El nombre de la empresa es requerido');
            return;
        }

        setIsSubmitting(true);
        try {
            await suppliersAPI.create(formData);
            await loadSuppliers();
            setIsAddModalOpen(false);
            resetForm();
        } catch (err) {
            alert('Error al crear proveedor: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async () => {
        if (!formData.name) {
            alert('El nombre de la empresa es requerido');
            return;
        }

        setIsSubmitting(true);
        try {
            await suppliersAPI.update(currentSupplier.id, formData);
            await loadSuppliers();
            setIsEditModalOpen(false);
            setCurrentSupplier(null);
            resetForm();
        } catch (err) {
            alert('Error al actualizar proveedor: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (supplier) => {
        if (!confirm(`¿Eliminar proveedor "${supplier.name}"?`)) return;

        try {
            await suppliersAPI.delete(supplier.id);
            await loadSuppliers();
        } catch (err) {
            alert('Error al eliminar proveedor: ' + err.message);
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

    const filteredSuppliers = suppliers.filter(s =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="bg-mesh-gradient pt-12 pb-24 px-4 md:px-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Proveedores</h2>
                        <p className="text-blue-100 text-base md:text-lg opacity-90">Gestión de alianzas y suministros</p>
                    </div>
                    <Button
                        className="bg-white text-primary hover:bg-blue-50 font-bold px-6 h-12 shadow-lg rounded-xl active:scale-95 transition-all"
                        onClick={() => {
                            resetForm();
                            setIsAddModalOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-5 w-5" /> Nuevo Proveedor
                    </Button>
                </div>
            </div>

            <div className="px-4 md:px-8 -mt-16 relative z-20 pb-12">
                <div className="mb-8 relative max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    <Input
                        className="pl-12 h-12 md:h-14 bg-white border-none shadow-xl rounded-2xl text-base md:text-lg"
                        placeholder="Buscar por nombre, contacto o categoría..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? (
                    <LoadingSpinner size="lg" text="Cargando proveedores..." className="py-20" />
                ) : error ? (
                    <ErrorMessage error={error} onRetry={loadSuppliers} className="py-20" />
                ) : suppliers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                        <Building2 size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground mb-4">No hay proveedores registrados</p>
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="mr-2" size={16} />
                            Agregar Primer Proveedor
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {filteredSuppliers.map((s, i) => (
                            <Card key={s.id || i} className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
                                <div className="h-2 bg-primary group-hover:h-3 transition-all duration-300"></div>
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 bg-white shadow text-blue-600 hover:bg-blue-50"
                                        onClick={() => openEditModal(s)}
                                    >
                                        <Edit2 size={14} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 bg-white shadow text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(s)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl md:text-2xl font-black text-gray-800 pr-20">{s.name}</CardTitle>
                                    {s.contact_person && (
                                        <p className="text-primary font-bold text-xs md:text-sm uppercase tracking-widest">{s.contact_person}</p>
                                    )}
                                    {s.category && (
                                        <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full">
                                            {s.category}
                                        </span>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-3 md:space-y-4 pt-4">
                                    {s.phone && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary shrink-0">
                                                <Phone size={16} />
                                            </div>
                                            <span className="font-semibold text-sm">{s.phone}</span>
                                        </div>
                                    )}
                                    {s.email && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary shrink-0">
                                                <Mail size={16} />
                                            </div>
                                            <span className="font-semibold text-sm truncate">{s.email}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                }}
                title="Nuevo Proveedor"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button onClick={handleAdd} disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar Proveedor'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Empresa / Razón Social *</label>
                        <Input
                            placeholder="Ej. Distribuidora Farma"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Contacto Principal</label>
                        <Input
                            placeholder="Ej. Ana García"
                            value={formData.contact_person}
                            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Categoría</label>
                        <Input
                            placeholder="Ej. Medicamentos"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Teléfono</label>
                            <Input
                                placeholder="+505 8888-8888"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email</label>
                            <Input
                                type="email"
                                placeholder="contacto@empresa.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    setCurrentSupplier(null);
                    resetForm();
                }}
                title="Editar Proveedor"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button onClick={handleEdit} disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Actualizar Proveedor'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Empresa / Razón Social *</label>
                        <Input
                            placeholder="Ej. Distribuidora Farma"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Contacto Principal</label>
                        <Input
                            placeholder="Ej. Ana García"
                            value={formData.contact_person}
                            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Categoría</label>
                        <Input
                            placeholder="Ej. Medicamentos"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Teléfono</label>
                            <Input
                                placeholder="+505 8888-8888"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email</label>
                            <Input
                                type="email"
                                placeholder="contacto@empresa.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default Suppliers;
