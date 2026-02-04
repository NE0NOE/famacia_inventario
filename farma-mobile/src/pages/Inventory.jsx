import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/modal';

const Inventory = () => {
    const [products, setProducts] = useState([
        { id: '001', name: 'Paracetamol 500mg', category: 'Analgésicos', price: 5.50, stock: 120, status: 'Disponible' },
        { id: '002', name: 'Amoxicilina 500mg', category: 'Antibióticos', price: 12.00, stock: 15, status: 'Bajo Stock' },
        { id: '003', name: 'Ibuprofeno 400mg', category: 'Antiinflamatorios', price: 8.25, stock: 85, status: 'Disponible' },
        { id: '004', name: 'Omeprazol 20mg', category: 'Gastrointestinal', price: 10.50, stock: 0, status: 'Agotado' },
        { id: '005', name: 'Loratadina 10mg', category: 'Antialérgicos', price: 7.00, stock: 200, status: 'Disponible' },
        { id: '006', name: 'Enalapril 10mg', category: 'Cardiovascular', price: 9.50, stock: 45, status: 'Disponible' },
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="bg-mesh-gradient pt-12 pb-24 px-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">Inventario</h2>
                        <p className="text-blue-100 text-lg opacity-90">Gestión de productos y existencias</p>
                    </div>
                    <Button
                        className="bg-white text-primary hover:bg-blue-50 font-bold px-6 h-12 shadow-lg rounded-xl active:scale-95 transition-all"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus className="mr-2 h-5 w-5" /> Agregar Producto
                    </Button>
                </div>
            </div>

            <div className="px-8 -mt-16 relative z-20 pb-12">
                <Card className="border-none shadow-xl transition-all duration-300">
                    <CardHeader className="p-6 border-b border-gray-100">
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
                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="h-11 border-2 font-bold gap-2">
                                    <Filter size={18} /> Filtros
                                </Button>
                                <Button variant="outline" className="h-11 border-2 font-bold gap-2">
                                    <ArrowUpDown size={18} /> Ordenar
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Producto</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Categoría</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">Precio</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider text-center">Stock</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider text-center">Estado</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{product.id}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-800">{product.name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-gray-700">
                                                C$ {product.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn(
                                                    "font-bold",
                                                    product.stock <= 20 ? "text-orange-600" : "text-gray-800"
                                                )}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                    product.status === 'Disponible' && "bg-green-50 text-green-600 border-green-200",
                                                    product.status === 'Bajo Stock' && "bg-orange-50 text-orange-600 border-orange-200",
                                                    product.status === 'Agotado' && "bg-red-50 text-red-600 border-red-200",
                                                )}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-100">
                                                        <Edit2 size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-100">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-slate-50/30">
                            <span className="text-sm text-muted-foreground font-medium">Mostrando {filteredProducts.length} de {products.length} productos</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="font-bold border-2">Anterior</Button>
                                <Button variant="outline" size="sm" className="font-bold border-2">Siguiente</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Agregar Nuevo Producto"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                        <Button onClick={() => setIsAddModalOpen(false)}>Guardar Producto</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Nombre del Producto</label>
                            <Input placeholder="Ej. Paracetamol" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Código / SKU</label>
                            <Input placeholder="Ej. PROD-001" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Categoría</label>
                        <Input placeholder="Seleccionar categoría" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Precio (C$)</label>
                            <Input type="number" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Stock Inicial</label>
                            <Input type="number" placeholder="0" />
                        </div>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default Inventory;
