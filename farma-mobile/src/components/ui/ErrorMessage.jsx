import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

const ErrorMessage = ({ error, onRetry, className }) => {
    const errorMessage = error?.message || error || 'Ha ocurrido un error';

    return (
        <div className={cn('flex flex-col items-center justify-center gap-4 p-6 text-center', className)}>
            <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Error al cargar datos</h3>
                <p className="text-sm text-muted-foreground max-w-md">{errorMessage}</p>
            </div>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" className="gap-2">
                    <RefreshCw size={16} />
                    Reintentar
                </Button>
            )}
        </div>
    );
};

export default ErrorMessage;
