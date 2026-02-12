import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Truck, Receipt, Users, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Inicio', path: '/dashboard' },
        { icon: ShoppingCart, label: 'POS', path: '/pos' },
        { icon: Package, label: 'Stock', path: '/inventory' },
        { icon: Truck, label: 'Proveedores', path: '/suppliers' },
        { icon: SettingsIcon, label: 'Ajustes', path: '/settings' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}>
            <nav className="flex items-center justify-around px-2 py-2">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]",
                            isActive
                                ? "text-primary bg-primary/10"
                                : "text-gray-500 hover:text-primary hover:bg-gray-50"
                        )}
                    >
                        <item.icon size={20} className="shrink-0" />
                        <span className="text-[10px] font-semibold leading-none">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default BottomNav;
