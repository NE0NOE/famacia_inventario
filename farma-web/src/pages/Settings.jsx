import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon, Bell, Lock, Globe, Database, Printer } from 'lucide-react';

const Settings = () => {
    return (
        <Layout>
            <div className="bg-mesh-gradient pt-12 pb-24 px-8 text-white relative overflow-hidden">
                <h2 className="text-4xl font-black tracking-tight mb-2">Configuración</h2>
                <p className="text-blue-100 text-lg opacity-90">Ajustes del sistema y preferencias</p>
            </div>

            <div className="px-8 -mt-16 relative z-20 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 border-none shadow-lg h-fit">
                        <CardHeader>
                            <CardTitle className="text-xl">Opciones</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex flex-col">
                                {[
                                    { icon: SettingsIcon, label: 'General', active: true },
                                    { icon: Lock, label: 'Seguridad' },
                                    { icon: Bell, label: 'Notificaciones' },
                                    { icon: Printer, label: 'Impresoras' },
                                    { icon: Database, label: 'Respaldo' },
                                ].map((item, i) => (
                                    <button key={i} className={`flex items-center gap-4 px-6 py-4 text-left transition-colors ${item.active ? 'bg-blue-50 text-primary border-l-4 border-primary font-bold' : 'text-gray-600 hover:bg-slate-50'}`}>
                                        <item.icon size={20} />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 border-none shadow-lg">
                        <CardHeader className="border-b border-gray-50">
                            <CardTitle className="text-2xl font-black">Ajustes Generales</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Nombre de la Farmacia</label>
                                    <Input defaultValue="Farmacia Dulce Esperanza" className="h-12 border-2 font-semibold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-500 uppercase tracking-widest">RUC / Identificación</label>
                                    <Input defaultValue="J031000000123" className="h-12 border-2 font-semibold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Moneda Principal</label>
                                    <Input defaultValue="Córdoba (C$)" disabled className="h-12 border-2 font-semibold bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Idioma del Sistema</label>
                                    <Input defaultValue="Español" className="h-12 border-2 font-semibold" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                                <Button variant="outline" className="h-12 px-8 font-bold border-2">Cancelar</Button>
                                <Button className="h-12 px-8 font-bold shadow-lg">Guardar Cambios</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
