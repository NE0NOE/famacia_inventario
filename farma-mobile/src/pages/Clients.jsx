import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, User, Phone, Mail, History, Edit2, Trash2 } from 'lucide-react';
import Modal from '@/components/ui/modal';
import { clientsAPI } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentClient, setCurrentClient] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        client_id: '',
        name: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await clientsAPI.getAll();
            setClients(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            client_id: '',
            name: '',
            phone: '',
            email: ''
        });
    };

    const handleAdd = async () => {
        if (!formData.name) {
            alert('El nombre es requerido');
            return;
        }

        setIsSubmitting(true);
        try {
            await clientsAPI.create(formData);
            await loadClients();
            setIsAddModalOpen(false);
            resetForm();
        } catch (err) {
            alert('Error al crear cliente: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async () => {
        if (!formData.name) {
            alert('El nombre es requerido');
            return;
        }

        setIsSubmitting(true);
        try {
            await clientsAPI.update(currentClient.id, {
                ...formData,
                points: currentClient.points // preserve points
            });
            await loadClients();
            setIsEditModalOpen(false);
            setCurrentClient(null);
            resetForm();
        } catch (err) {
            alert('Error al actualizar cliente: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (client) => {
        if (!confirm(`¿Eliminar cliente "${client.name}"?`)) return;

        try {
            await clientsAPI.delete(client.id);
            await loadClients();
        } catch (err) {
            alert('Error al eliminar cliente: ' + err.message);
        }
    };

    const openEditModal = (client) => {
        setCurrentClient(client);
        setFormData({
            client_id: client.client_id || '',
            name: client.name,
            phone: client.phone || '',
            email: client.email || ''
        });
        setIsEditModalOpen(true);
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.client_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone?.includes(searchQuery) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="bg-mesh-gradient pt-12 pb-24 px-4 md:px-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Clientes</h2>
                        <p className="text-blue-100 text-base md:text-lg opacity-90">Gestión de fidelidad y datos de pacientes</p>
                    </div>
                    <Button
                        className="bg-white text-primary hover:bg-blue-50 font-bold px-6 h-12 shadow-lg rounded-xl active:scale-95 transition-all"
                        onClick={() => {
                            resetForm();
                            setIsAddModalOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-5 w-5" /> Nuevo Cliente
                    </Button>
                </div>
            </div>

            <div className="px-4 md:px-8 -mt-16 relative z-20 pb-12">
                <div className="mb-8 relative max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    <Input
                        className="pl-12 h-12 md:h-14 bg-white border-none shadow-xl rounded-2xl text-base md:text-lg"
                        placeholder="Buscar por nombre, cédula o teléfono..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? (
                    <LoadingSpinner size="lg" text="Cargando clientes..." className="py-20" />
                ) : error ? (
                    <ErrorMessage error={error} onRetry={loadClients} className="py-20" />
                ) : clients.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                        <User size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground mb-4">No hay clientes registrados</p>
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="mr-2" size={16} />
                            Agregar Primer Cliente
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {filteredClients.map((client) => (
                            <Card key={client.id} className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 relative group">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 bg-white shadow text-blue-600 hover:bg-blue-50"
                                        onClick={() => openEditModal(client)}
                                    >
                                        <Edit2 size={14} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 bg-white shadow text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(client)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                                        <User size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-lg md:text-xl font-black text-gray-800 truncate">{client.name}</CardTitle>
                                        <p className="text-primary font-bold text-xs uppercase tracking-tighter">
                                            {client.client_id || `ID-${client.id}`}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 md:space-y-4 pt-4">
                                    {client.phone && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Phone size={16} className="text-primary shrink-0" />
                                            <span className="font-semibold text-sm">{client.phone}</span>
                                        </div>
                                    )}
                                    {client.email && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Mail size={16} className="text-primary shrink-0" />
                                            <span className="font-semibold text-sm truncate">{client.email}</span>
                                        </div>
                                    )}
                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-black text-gray-400">Puntos</span>
                                            <span className="text-lg font-black text-primary">{client.points || 0} pts</span>
                                        </div>
                                    </div>
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
                title="Registrar Nuevo Cliente"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button onClick={handleAdd} disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Nombre Completo *</label>
                        <Input
                            placeholder="Ej. Juan Pérez"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Cédula / RUC</label>
                        <Input
                            placeholder="Ej. 001-010203-0001Y"
                            value={formData.client_id}
                            onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Teléfono</label>
                            <Input
                                placeholder="8888-8888"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email</label>
                            <Input
                                type="email"
                                placeholder="cliente@email.com"
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
                    setCurrentClient(null);
                    resetForm();
                }}
                title="Editar Cliente"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button onClick={handleEdit} disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Actualizar Cliente'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Nombre Completo *</label>
                        <Input
                            placeholder="Ej. Juan Pérez"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Cédula / RUC</label>
                        <Input
                            placeholder="Ej. 001-010203-0001Y"
                            value={formData.client_id}
                            onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Teléfono</label>
                            <Input
                                placeholder="8888-8888"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email</label>
                            <Input
                                type="email"
                                placeholder="cliente@email.com"
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

export default Clients;
