import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon, Bell, Lock, Globe, AlertCircle, Package } from 'lucide-react';

const Settings = () => {
    // Settings State
    const [settings, setSettings] = useState({
        notifyStock: true,
        notifyOrders: true
    });

    // Tab State
    const [activeTab, setActiveTab] = useState('General');

    // Users State
    const [users, setUsers] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'seller' });
    const [loadingUsers, setLoadingUsers] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem('farma_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'Seguridad') {
            fetchUsers();
        }
    }, [activeTab]);

    const updateSetting = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('farma_settings', JSON.stringify(newSettings));
    };

    // User Management Functions
    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await fetch('http://localhost:3000/api/users');
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                setShowUserModal(false);
                setNewUser({ username: '', password: '', role: 'seller' });
                fetchUsers();
            } else {
                alert('Error al crear usuario');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
        try {
            await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'General':
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
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
                        <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-12 font-bold border-2">Cancelar</Button>
                            <Button className="h-12 font-bold shadow-lg">Guardar</Button>
                        </div>
                    </div>
                );
            case 'Seguridad':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-800">Usuarios</h3>
                            <Button size="sm" onClick={() => setShowUserModal(true)} className="font-bold shadow-md">
                                + Nuevo
                            </Button>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            <div className="max-h-[400px] overflow-y-auto">
                                {users.map((user) => (
                                    <div key={user.id} className="p-4 border-b border-gray-50 flex justify-between items-center last:border-0">
                                        <div>
                                            <p className="font-bold text-gray-800">{user.username}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                        {user.username !== 'admin' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                ×
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {users.length === 0 && !loadingUsers && (
                                    <div className="p-8 text-center text-gray-400 font-medium">No hay usuarios</div>
                                )}
                            </div>
                        </div>

                        {/* Modal Nuevo Usuario (Mobile Optimized) */}
                        {showUserModal && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 animate-in fade-in zoom-in duration-200">
                                    <h3 className="text-xl font-black mb-4">Nuevo Usuario</h3>
                                    <form onSubmit={handleCreateUser} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600">Usuario</label>
                                            <Input
                                                required
                                                value={newUser.username}
                                                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                                placeholder="ej. vendedor1"
                                                className="h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600">Contraseña</label>
                                            <Input
                                                required
                                                type="password"
                                                value={newUser.password}
                                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                                placeholder="••••••••"
                                                className="h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600">Rol</label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-gray-200 bg-white px-3 text-sm"
                                                value={newUser.role}
                                                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                            >
                                                <option value="seller">Vendedor</option>
                                                <option value="admin">Administrador</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 pt-4">
                                            <Button type="button" variant="outline" className="h-12 font-bold" onClick={() => setShowUserModal(false)}>
                                                Cancelar
                                            </Button>
                                            <Button type="submit" className="h-12 font-bold">
                                                Crear
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'Notificaciones':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-gray-800">Notificaciones</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800 text-sm">Alerta Stock</p>
                                        <p className="text-[10px] text-gray-500">Avisar &lt; 10 u.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.notifyStock}
                                        onChange={(e) => updateSetting('notifyStock', e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                        <Package size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800 text-sm">Pedidos</p>
                                        <p className="text-[10px] text-gray-500">Pendientes</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.notifyOrders}
                                        onChange={(e) => updateSetting('notifyOrders', e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div className="p-8 text-center text-gray-400">Próximamente...</div>;
        }
    };

    return (
        <Layout>
            <div className="bg-mesh-gradient pt-12 pb-24 px-6 text-white relative overflow-hidden">
                <h2 className="text-3xl font-black tracking-tight mb-2">Ajustes</h2>
                <p className="text-blue-100 text-sm opacity-90">Configuración del sistema</p>
            </div>

            <div className="px-4 -mt-16 relative z-20 pb-20 space-y-4">
                <Card className="border-none shadow-lg overflow-hidden">
                    <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100">
                        {[
                            { icon: SettingsIcon, label: 'General' },
                            { icon: Lock, label: 'Seguridad' },
                            { icon: Bell, label: 'Notificaciones' },
                        ].map((item, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(item.label)}
                                className={`flex items-center gap-2 px-4 py-4 whitespace-nowrap transition-colors border-b-2 ${activeTab === item.label ? 'border-primary text-primary font-bold bg-blue-50/50' : 'border-transparent text-gray-500 font-medium'}`}
                            >
                                <item.icon size={18} />
                                <span className="text-sm">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </Card>

                <Card className="border-none shadow-lg min-h-[400px]">
                    <CardHeader className="border-b border-gray-50 py-4">
                        <CardTitle className="text-lg font-black">
                            {activeTab === 'General' && 'General'}
                            {activeTab === 'Seguridad' && 'Seguridad'}
                            {activeTab === 'Notificaciones' && 'Notificaciones'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {renderContent()}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Settings;
