import React, { useState } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { cn } from '@/lib/utils';

const Layout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <BottomNav />
            <main className={cn(
                "min-h-screen bg-transparent transition-all duration-300 pb-20 md:pb-0",
                isCollapsed ? "md:pl-20" : "md:pl-64"
            )}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
