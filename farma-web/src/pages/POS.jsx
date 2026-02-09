import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Package, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/modal';
import { productsAPI, salesAPI } from '@/services/api';

const POS = () => {
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [isProcessing, setIsProcessing] = useState(false);
    const [saleResult, setSaleResult] = useState(null);
    const [lastTotal, setLastTotal] = useState(0);

    // API data states
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products from API
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productsAPI.getAll();
            setProducts(data);
        } catch (err) {
            setError(err);
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const completeSale = async () => {
        if (cart.length === 0) return;

        setIsProcessing(true);
        try {
            const currentTotal = subtotal;
            const saleData = {
                subtotal: currentTotal,
                total: currentTotal,
                payment_method: paymentMethod,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_sale: parseFloat(item.price)
                }))
            };

            const result = await salesAPI.create(saleData);
            setSaleResult(result);
            setLastTotal(currentTotal);
            setIsSuccessModalOpen(true);
            setCart([]);
            await loadProducts(); // Reload to update stock
        } catch (err) {
            alert('Error al procesar la venta: ' + (err.message || 'Error desconocido'));
            console.error('Error creating sale:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="flex h-[calc(100vh)] bg-transparent">
                {/* Left: Product Selection */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-primary">Venta de Productos</h2>
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                className="pl-10"
                                placeholder="Buscar producto o código..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500">
                            <p>Error al cargar productos</p>
                            <Button onClick={loadProducts} className="mt-4">Reintentar</Button>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <Package size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No hay productos disponibles</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow group overflow-hidden border-none" onClick={() => addToCart(product)}>
                                    <div className="h-24 bg-blue-50 flex items-center justify-center text-blue-200 group-hover:bg-blue-100 transition-colors">
                                        <Package size={40} />
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{product.name}</h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-primary font-bold text-xl">C$ {parseFloat(product.price).toFixed(2)}</span>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.stock < 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                Stock: {product.stock}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Cart Summary */}
                <div className="w-96 bg-white border-l shadow-2xl flex flex-col">
                    <div className="p-6 bg-mesh-gradient text-white">
                        <div className="flex items-center gap-3">
                            <ShoppingCart />
                            <h2 className="text-xl font-bold">Carrito de Venta</h2>
                        </div>
                        <p className="text-blue-100 text-sm mt-1">{cart.length} productos seleccionados</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                <ShoppingCart size={48} className="mb-2" />
                                <p>El carrito está vacío</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800">{item.name}</p>
                                        <p className="text-primary font-bold">C$ {(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg" onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }}>
                                                <Minus size={14} />
                                            </Button>
                                            <span className="font-bold w-6 text-center">{item.quantity}</span>
                                            <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg" onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}>
                                                <Plus size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.id)}>
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 bg-white border-t space-y-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between text-lg">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">C$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-black text-primary">
                            <span>TOTAL</span>
                            <span>C$ {subtotal.toFixed(2)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <Button
                                variant={paymentMethod === 'Tarjeta' ? 'default' : 'outline'}
                                className="flex flex-col h-16 gap-1 group border-2"
                                onClick={() => setPaymentMethod('Tarjeta')}
                            >
                                <CreditCard size={20} className={paymentMethod === 'Tarjeta' ? 'text-white' : 'text-gray-600'} />
                                <span className="text-xs uppercase font-bold">Tarjeta</span>
                            </Button>
                            <Button
                                variant={paymentMethod === 'Efectivo' ? 'default' : 'outline'}
                                className="flex flex-col h-16 gap-1 group border-2"
                                onClick={() => setPaymentMethod('Efectivo')}
                            >
                                <Banknote size={20} className={paymentMethod === 'Efectivo' ? 'text-white' : 'text-gray-600'} />
                                <span className="text-xs uppercase font-bold">Efectivo</span>
                            </Button>
                        </div>

                        <Button
                            className="w-full h-14 text-lg font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                            disabled={cart.length === 0 || isProcessing}
                            onClick={completeSale}
                        >
                            {isProcessing ? 'Procesando...' : 'FINALIZAR VENTA'}
                        </Button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    setSaleResult(null);
                }}
                title="¡Venta Completada!"
                className="max-w-sm text-center"
                footer={
                    <Button className="w-full font-bold" onClick={() => {
                        setIsSuccessModalOpen(false);
                        setSaleResult(null);
                    }}>
                        Aceptar e Imprimir Ticket
                    </Button>
                }
            >
                <div className="py-6 flex flex-col items-center gap-4">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                        <ShoppingCart size={40} className="stroke-[2]" />
                    </div>
                    <p className="text-gray-500 font-medium">Venta #{saleResult?.id || '---'}</p>
                    <h3 className="text-2xl font-black text-gray-800">C$ {lastTotal.toFixed(2)}</h3>
                    <p className="text-gray-500">La transacción se ha procesado correctamente.</p>
                    <p className="text-sm text-muted-foreground">Método: {paymentMethod}</p>
                </div>
            </Modal>
        </Layout>
    );
};

export default POS;
