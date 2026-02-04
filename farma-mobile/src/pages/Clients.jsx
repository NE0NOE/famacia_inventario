import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, User, Phone, Mail, History } from 'lucide-react';
import Modal from '@/components/ui/modal';

const Clients = () => {
    const [clients] = useState([
        { id: 'C-001', name: 'Alberto Martínez', phone: '8888-1234', email: 'alberto@email.com', points: 150, lastVisit: '26/01/2026' },
        { id: 'C-002', name: 'Marta Sánchez', phone: '7777-5678', email: 'marta.s@email.com', points: 45, lastVisit: '26/01/2026' },
        { id: 'C-003', name: 'Roberto Gómez', phone: '8444-9012', email: 'roberto.g@email.com', points: 12, lastVisit: '24/01/2026' },
        { id: 'C-004', name: 'Elena White', phone: '8222-3344', email: 'elena@email.com', points: 320, lastVisit: '24/01/2026' },
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery)
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClients.map((client) => (
                        <Card key={client.id} className="border-none shadow-lg hover:shadow-2xl transition-all duration-300">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                                    <User size={30} />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black text-gray-800">{client.name}</CardTitle>
                                    <p className="text-primary font-bold text-xs uppercase tracking-tighter">{client.id}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone size={16} className="text-primary" />
                                    <span className="font-semibold">{client.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail size={16} className="text-primary" />
                                    <span className="font-semibold">{client.email}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-black text-gray-400">Puntos accumulated</span>
                                        <span className="text-lg font-black text-primary">{client.points} pts</span>
                                    </div>
                                    <Button variant="outline" className="h-9 gap-2 font-bold border-2">
                                        <History size={16} /> Historial
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Registrar Nuevo Cliente"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                        <Button onClick={() => setIsAddModalOpen(false)}>Guardar Cliente</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Nombre Completo</label>
                        <Input placeholder="Ej. Juan Pérez" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Teléfono</label>
                            <Input placeholder="8888-8888" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email (Opcional)</label>
                            <Input placeholder="cliente@email.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Dirección</label>
                        <Input placeholder="Dirección domiciliar..." />
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default Clients;
