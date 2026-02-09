import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download, Printer, Eye, Calendar, Clock, Loader2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { salesAPI } from '@/services/api';
import Modal from '@/components/ui/modal';

const Invoicing = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [selectedSale, setSelectedSale] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        try {
            setLoading(true);
            const data = await salesAPI.getAll();
            setSales(data);
        } catch (err) {
            setError(err);
            console.error('Error loading sales:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (sales.length === 0) return alert('No hay datos para exportar');

        const headers = ['ID', 'Fecha', 'Cliente', 'Tipo', 'Metodo Pago', 'Total', 'Estado'];
        const csvContent = [
            headers.join(','),
            ...sales.map(sale => [
                sale.id,
                new Date(sale.timestamp).toLocaleDateString('es-NI'),
                sale.client_id || 'Consumidor Final',
                'N/A', // Tipo
                sale.payment_method,
                sale.total,
                sale.status || 'Completada'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = async (sale) => {
        try {
            let saleDetails = sale;
            if (!sale.items) {
                try {
                    saleDetails = await salesAPI.getById(sale.id);
                } catch (e) {
                    console.error("Could not fetch details for print", e);
                }
            }

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Factura #${saleDetails.id}</title>
                        <style>
                            body { font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
                            .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                            .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
                            .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; }
                            .footer { margin-top: 20px; text-align: center; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h3>FARMACIA DULCE ESPERANZA</h3>
                            <p>RUC: J0310000000000</p>
                            <p>Tel: +505 2222-2222</p>
                            <p>Factura: #${saleDetails.id}</p>
                            <p>Fecha: ${new Date(saleDetails.timestamp).toLocaleString('es-NI')}</p>
                        </div>
                        <div>
                            ${saleDetails.items ? saleDetails.items.map(item => `
                                <div class="row">
                                    <span>${item.quantity} x ${item.product_name || 'Producto'}</span>
                                    <span>C$ ${(item.quantity * item.price_at_sale).toFixed(2)}</span>
                                </div>
                            `).join('') : '<p>Detalles no disponibles</p>'}
                        </div>
                        <div class="row total">
                            <span>TOTAL</span>
                            <span>C$ ${parseFloat(saleDetails.total).toFixed(2)}</span>
                        </div>
                        <div class="footer">
                            <p>¡Gracias por su compra!</p>
                        </div>
                        <script>
                            window.onload = function() { window.print(); window.close(); }
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        } catch (err) {
            alert('Error al imprimir: ' + err.message);
        }
    };

    const handleViewDetails = async (sale) => {
        setIsDetailsModalOpen(true);
        setLoadingDetails(true);
        try {
            const details = await salesAPI.getById(sale.id);
            setSelectedSale(details);
        } catch (err) {
            alert('Error al cargar detalles: ' + err.message);
            setIsDetailsModalOpen(false);
        } finally {
            setLoadingDetails(false);
        }
    };

    const filteredSales = sales.filter(sale =>
        sale.id.toString().includes(searchQuery) ||
        (sale.client_id && sale.client_id.toString().includes(searchQuery))
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO' }).format(amount);
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('es-NI', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate stats
    const totalSalesMonth = sales.length; // Simplified for now
    const totalAmounttoday = sales
        .filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString())
        .reduce((sum, s) => sum + parseFloat(s.total), 0);

    return (
        <Layout>
            <div className="bg-mesh-gradient pt-12 pb-24 px-4 md:px-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Facturación</h2>
                        <p className="text-blue-100 text-base md:text-lg opacity-90">Historial de Ventas y Comprobantes</p>
                    </div>
                    <Button
                        variant="outline"
                        className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold h-12 shadow-lg backdrop-blur-md px-6 active:scale-95 transition-all w-full md:w-auto"
                        onClick={handleExport}
                    >
                        Exportar Reporte
                    </Button>
                </div>
            </div>

            <div className="px-4 md:px-8 -mt-16 relative z-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    <Card className="border-none shadow-lg bg-white overflow-hidden">
                        <div className="bg-green-500 h-1"></div>
                        <CardContent className="p-4 md:p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-inner">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Ventas Totales</p>
                                    <p className="text-2xl md:text-3xl font-black text-gray-800">{totalSalesMonth}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-lg bg-white overflow-hidden">
                        <div className="bg-orange-500 h-1"></div>
                        <CardContent className="p-4 md:p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-inner">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Venta de Hoy</p>
                                    <p className="text-2xl md:text-3xl font-black text-gray-800">{formatCurrency(totalAmounttoday)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-xl">
                    <CardHeader className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                className="pl-10 h-11 bg-slate-50 border-none rounded-xl"
                                placeholder="Buscar por ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="font-bold border-2 rounded-xl h-11 w-full md:w-auto" onClick={loadSales}>
                            <Loader2 size={16} className={cn("mr-2", loading && "animate-spin")} /> Recargar
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 text-red-500">
                                <p>Error al cargar el historial</p>
                                <Button onClick={loadSales} className="mt-4">Reintentar</Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-blue-50/20">
                                            <th className="px-4 md:px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">ID</th>
                                            <th className="px-4 md:px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                                            <th className="hidden md:table-cell px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Método</th>
                                            <th className="px-4 md:px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                                            <th className="px-4 md:px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Ver</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredSales.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No hay ventas registradas</td>
                                            </tr>
                                        ) : (
                                            filteredSales.map((sale) => (
                                                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 md:px-6 py-4 font-bold text-primary">#{sale.id}</td>
                                                    <td className="px-4 md:px-6 py-4 text-sm text-gray-500 font-medium">
                                                        {new Date(sale.timestamp).toLocaleDateString('es-NI')}
                                                    </td>
                                                    <td className="hidden md:table-cell px-6 py-4">
                                                        <span className="text-[10px] font-black uppercase text-gray-500 border border-gray-200 px-2 py-0.5 rounded bg-gray-50">
                                                            {sale.payment_method}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 md:px-6 py-4 text-right font-black text-gray-800">
                                                        {formatCurrency(sale.total)}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-4 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-gray-400 hover:text-primary hover:bg-blue-50"
                                                            onClick={() => handleViewDetails(sale)}
                                                        >
                                                            <Eye size={18} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Sale Details Modal */}
            <Modal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                title={`Venta #${selectedSale?.id || ''}`}
                className="max-w-xl"
                footer={
                    <Button onClick={() => setIsDetailsModalOpen(false)} className="w-full">Cerrar</Button>
                }
            >
                {loadingDetails ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : selectedSale ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-gray-100">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Fecha</p>
                                <p className="font-semibold text-gray-800 text-sm">{formatDate(selectedSale.timestamp)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Pago</p>
                                <p className="font-semibold text-gray-800 text-sm">{selectedSale.payment_method}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                                <Package size={16} className="text-primary" /> Productos
                            </h4>
                            <div className="border rounded-xl overflow-hidden">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-medium">
                                        <tr>
                                            <th className="px-3 py-2">Producto</th>
                                            <th className="px-3 py-2 text-center">Cant.</th>
                                            <th className="px-3 py-2 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedSale.items?.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="px-3 py-2 font-medium text-gray-800">{item.product_name || `ID ${item.product_id}`}</td>
                                                <td className="px-3 py-2 text-center">{item.quantity}</td>
                                                <td className="px-3 py-2 text-right font-bold">{formatCurrency(item.quantity * item.price_at_sale)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-blue-50/50 font-bold text-gray-800">
                                        <tr>
                                            <td colSpan="2" className="px-3 py-2 text-right">Total</td>
                                            <td className="px-3 py-2 text-right text-primary text-base">{formatCurrency(selectedSale.total)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </Layout>
    );
};

export default Invoicing;
