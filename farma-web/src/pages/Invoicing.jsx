import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download, Printer, Eye, Calendar, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Invoicing = () => {
    const invoices = [
        { id: 'FAC-001254', client: 'Alberto Martínez', date: '26/01/2026', amount: 156.00, status: 'Pagada', type: 'Consumidor Final' },
        { id: 'FAC-001255', client: 'Marta Sánchez', date: '26/01/2026', amount: 45.20, status: 'Pagada', type: 'Consumidor Final' },
        { id: 'FAC-001256', client: 'Hospital Regional', date: '25/01/2026', amount: 1250.00, status: 'Pendiente', type: 'Responsable Inscripto' },
        { id: 'FAC-001257', client: 'Roberto Gómez', date: '24/01/2026', amount: 89.90, status: 'Anulada', type: 'Consumidor Final' },
        { id: 'FAC-001258', client: 'Elena White', date: '24/01/2026', amount: 210.00, status: 'Pagada', type: 'Consumidor Final' },
    ];

    const [searchQuery, setSearchQuery] = useState('');

    const filteredInvoices = invoices.filter(inv =>
        inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="bg-mesh-gradient pt-12 pb-24 px-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">Facturación</h2>
                        <p className="text-blue-100 text-lg opacity-90">Gestión de comprobantes y ventas</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold h-12 shadow-lg backdrop-blur-md px-6 active:scale-95 transition-all">
                            Exportar Reporte
                        </Button>
                    </div>
                </div>
            </div>

            <div className="px-8 -mt-16 relative z-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* ... cards code unchanged for brevity, but could be included if necessary for context ... */}
                    <Card className="border-none shadow-lg bg-white overflow-hidden">
                        <div className="bg-green-500 h-1"></div>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-inner">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Facturas Mes</p>
                                    <p className="text-3xl font-black text-gray-800">1,240</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg bg-white overflow-hidden">
                        <div className="bg-blue-500 h-1"></div>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Pendientes</p>
                                    <p className="text-3xl font-black text-gray-800">12</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg bg-white overflow-hidden">
                        <div className="bg-orange-500 h-1"></div>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-inner">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Importe Hoy</p>
                                    <p className="text-3xl font-black text-gray-800">C$ 4.2K</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-xl">
                    <CardHeader className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                className="pl-10 h-11 bg-slate-50 border-none rounded-xl"
                                placeholder="Buscar por cliente o factura..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="font-bold border-2 rounded-xl h-11">Últimos 30 días</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-blue-50/20">
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Nº Factura</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Tipo</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Estado</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredInvoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-primary">{inv.id}</td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-700">{inv.client}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">{inv.date}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-black uppercase text-gray-400 border border-gray-200 px-2 py-0.5 rounded">
                                                    {inv.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-gray-800">
                                                C$ {inv.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                                                    inv.status === 'Pagada' && "bg-green-100 text-green-700",
                                                    inv.status === 'Pendiente' && "bg-blue-100 text-blue-700",
                                                    inv.status === 'Anulada' && "bg-red-100 text-red-700",
                                                )}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-primary hover:bg-blue-50">
                                                        <Eye size={18} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-primary hover:bg-blue-50">
                                                        <Printer size={18} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-primary hover:bg-blue-50">
                                                        <Download size={18} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Invoicing;
