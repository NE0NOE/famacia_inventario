import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Package, AlertCircle, TrendingUp, Clock as ClockIcon } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
            </CardTitle>
            <Icon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">
                {trend && <span className="text-green-600 font-medium mr-1">{trend}</span>}
                {subtext}
            </p>
        </CardContent>
    </Card>
);

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md border border-white/20 font-bold">
            <ClockIcon size={18} className="text-blue-100" />
            <span className="text-sm">
                {time.toLocaleDateString('es-NI', { weekday: 'long', day: 'numeric', month: 'long' })} • {time.toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
        </div>
    );
};

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    return (
        <Layout>
            {/* Header Section with Wave */}
            <div className="relative bg-mesh-gradient pb-32 pt-12 px-8 shadow-lg overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center text-white gap-6">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">Dashboard</h2>
                        <p className="text-blue-100 text-lg opacity-90">Resumen general de Farmacia Dulce Esperanza</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <Clock />
                        <Button
                            variant="secondary"
                            className="bg-white text-primary hover:bg-blue-50 border-0 shadow-lg font-black h-11 px-6 active:scale-95 transition-all"
                            onClick={() => navigate('/pos')}
                        >
                            <span className="mr-2">+</span> Nueva Venta
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content Areas with Overlapping Cards */}
            <div className="px-8 -mt-24 relative z-20 pb-12">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard
                        title="Ventas del Día"
                        value="C$ 1,245.50"
                        subtext="vs ayer"
                        trend="+12%"
                        icon={DollarSign}
                    />
                    <StatCard
                        title="Productos Bajos"
                        value="12"
                        subtext="Requieren reabastecimiento"
                        icon={AlertCircle}
                    />
                    <StatCard
                        title="Inventario Total"
                        value="2,345"
                        subtext="Productos registrados"
                        icon={Package}
                    />
                    <StatCard
                        title="Ganancia Neta"
                        value="C$ 452.30"
                        subtext="En las últimas 24h"
                        trend="+5%"
                        icon={TrendingUp}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl text-primary">Ventas Recientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Mock list */}
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold">
                                                #{i}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-700">Ticket #00{i}58</p>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Hace 5 min • Contado</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary text-lg">C$ {(Math.random() * 100).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3 border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl text-primary">Top Productos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Mock items */}
                                <div className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">1</div>
                                        <span className="text-base font-semibold text-gray-700 group-hover:text-primary transition-colors">Paracetamol 500mg</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-gray-900">340</span>
                                        <span className="text-xs text-muted-foreground">Vendidos</span>
                                    </div>
                                </div>
                                {/* More items... copies of structure */}
                                <div className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white text-xs font-bold">2</div>
                                        <span className="text-base font-semibold text-gray-700 group-hover:text-primary transition-colors">Amoxicilina 500mg</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-gray-900">210</span>
                                        <span className="text-xs text-muted-foreground">Vendidos</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center text-white text-xs font-bold">3</div>
                                        <span className="text-base font-semibold text-gray-700 group-hover:text-primary transition-colors">Ibuprofeno 400mg</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-gray-900">180</span>
                                        <span className="text-xs text-muted-foreground">Vendidos</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
