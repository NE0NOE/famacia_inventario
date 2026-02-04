import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Phone, Mail, MapPin, Globe, ExternalLink } from 'lucide-react';
import Modal from '@/components/ui/modal';

const Suppliers = () => {
    const suppliers = [
        { name: 'PharmaDist S.A.', contact: 'Juan Pérez', phone: '+54 11 4567-8900', email: 'ventas@pharmadist.com', address: 'Av. Corrientes 1234, CABA', website: 'www.pharmadist.com' },
        { name: 'Medicinal Solutions', contact: 'Ana Garcia', phone: '+54 11 3456-7812', email: 'agarcia@medsol.com', address: 'Ruta 8 Km 60, Pilar', website: 'www.medsol.com' },
        { name: 'BioGen Lab', contact: 'Carlos Ruiz', phone: '+54 11 5566-7788', email: 'c.ruiz@biogen.com', address: 'Florida 550, CABA', website: 'www.biogen.com' },
        { name: 'Global Health Supply', contact: 'Marta Díaz', phone: '+54 11 2233-4455', email: 'mdiaz@ghsupply.net', address: 'Parque Industrial, Burzaco', website: 'www.ghsupply.net' },
    ];

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="bg-mesh-gradient pt-12 pb-24 px-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">Proveedores</h2>
                        <p className="text-blue-100 text-lg opacity-90">Gestión de alianzas y suministros</p>
                    </div>
                    <Button
                        className="bg-white text-primary hover:bg-blue-50 font-bold px-6 h-12 shadow-lg rounded-xl active:scale-95 transition-all"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus className="mr-2 h-5 w-5" /> Nuevo Proveedor
                    </Button>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSuppliers.map((s, i) => (
                        <Card key={i} className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                            <div className="h-2 bg-primary group-hover:h-3 transition-all duration-300"></div>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-2xl font-black text-gray-800">{s.name}</CardTitle>
                                    <Button variant="ghost" size="icon" className="text-primary hover:bg-blue-50">
                                        <ExternalLink size={20} />
                                    </Button>
                                </div>
                                <p className="text-primary font-bold text-sm uppercase tracking-widest">{s.contact}</p>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                                        <Phone size={16} />
                                    </div>
                                    <span className="font-semibold">{s.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                                        <Mail size={16} />
                                    </div>
                                    <span className="font-semibold">{s.email}</span>
                                </div>
                                <div className="flex items-start gap-3 text-gray-600">
                                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary mt-1">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="text-sm font-medium">{s.address}</span>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase cursor-pointer hover:underline">
                                        <Globe size={14} />
                                        {s.website}
                                    </div>
                                    <Button variant="secondary" className="px-4 py-1 h-8 text-xs font-black uppercase tracking-tighter rounded-lg">Ver Historial</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Nuevo Proveedor"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                        <Button onClick={() => setIsAddModalOpen(false)}>Guardar Proveedor</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Empresa / Razón Social</label>
                        <Input placeholder="Ej. Distribuidora Farma" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Contacto Principal</label>
                        <Input placeholder="Ej. Ana García" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Teléfono</label>
                            <Input placeholder="+505 8888-8888" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email</label>
                            <Input placeholder="contacto@empresa.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Dirección</label>
                        <Input placeholder="Dirección completa..." />
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default Suppliers;
