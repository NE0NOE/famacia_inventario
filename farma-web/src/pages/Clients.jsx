import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, User, Phone, Mail, History, Trash2, Edit2 } from 'lucide-react';
import Modal from '@/components/ui/modal';
import { clientsAPI } from '@/services/api';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ name: '', client_id: '', phone: '', email: '' });

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setLoading(true);
            const data = await clientsAPI.getAll();
            setClients(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClient = async () => {
        try {
            await clientsAPI.create(formData);
            setIsAddModalOpen(false);
            setFormData({ name: '', client_id: '', phone: '', email: '' });
            loadClients();
        } catch (error) {
            console.error(error);
            alert('Error al crear cliente');
        }
    };

    const handleDeleteClient = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este cliente?')) return;
        try {
            await clientsAPI.delete(id);
            loadClients();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.client_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone?.includes(searchQuery)
    );

    return (
        <Layout>
            <div className="bg-mesh-gradient pt-12 pb-24 px-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">Clientes</h2>
                        <p className="text-blue-100 text-lg opacity-90">Gestión de fidelidad y datos de pacientes</p>
                    </div>
                    <Button
                        className="bg-white text-primary hover:bg-blue-50 font-bold px-6 h-12 shadow-lg rounded-xl active:scale-95 transition-all"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus className="mr-2 h-5 w-5" /> Nuevo Cliente
                    </Button>
                </div>
            </div>

            <div className="px-8 -mt-16 relative z-20 pb-12">
                <div className="mb-8 relative max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    <Input
                        className="pl-12 h-14 bg-white border-none shadow-xl rounded-2xl text-lg"
                        placeholder="Buscar por nombre, cédula o teléfono..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="text-center p-12 text-gray-500">Cargando clientes...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClients.map((client) => (
                            <Card key={client.id} className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 relative group">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDeleteClient(client.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                                        <User size={30} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black text-gray-800">{client.name}</CardTitle>
                                        <p className="text-primary font-bold text-xs uppercase tracking-tighter">
                                            {client.client_id || 'S/N'}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                    {client.phone && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Phone size={16} className="text-primary" />
                                            <span className="font-semibold">{client.phone}</span>
                                        </div>
                                    )}
                                    {client.email && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Mail size={16} className="text-primary" />
                                            <span className="font-semibold">{client.email}</span>
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

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Registrar Nuevo Cliente"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreateClient}>Guardar Cliente</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Nombre Completo</label>
                        <Input
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Cédula / RUC</label>
                        <Input
                            value={formData.client_id}
                            onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                            placeholder="Ej. 001-..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Teléfono</label>
                            <Input
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="8888-8888"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email</label>
                            <Input
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="cliente@email.com"
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default Clients;
