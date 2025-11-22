import { useState, useEffect } from 'react';
import { apiFetch } from '@/integrations/api';

// Tipo para los permisos basado en la estructura de usuario_modulos
export interface UserPermissions {
    dashboard?: boolean;
    tasas_cambio?: boolean;
    bancos?: boolean;
    marcas?: boolean;
    categorias?: boolean;
    almacenes?: boolean;
    productos?: boolean;
    formulas?: boolean;
    pedidos?: boolean;
    usuarios?: boolean;
}

const PERMISSIONS_KEY = 'user_permissions';

/**
 * Hook para gestionar permisos del usuario desde la tabla usuario_modulos
 */
export function usePermissions() {
    const [permissions, setPermissions] = useState<UserPermissions>(() => {
        // Cargar permisos desde localStorage al inicializar
        try {
            const stored = localStorage.getItem(PERMISSIONS_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            return {};
        }
    });

    const [loading, setLoading] = useState(false);

    /**
     * Cargar permisos del usuario desde el backend
     * @param userId - ID del usuario
     */
    const loadUserPermissions = async (userId: number | string) => {
        if (!userId) {
            setPermissions({});
            return;
        }

        setLoading(true);
        try {
            const data = await apiFetch(`/users/${userId}/modulos`);

            // El backend puede devolver { modulos: {...} } o directamente {...}
            const perms: UserPermissions = data?.modulos || data || {};

            // Guardar en estado y localStorage
            setPermissions(perms);
            localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(perms));
        } catch (e: any) {
            // Si falla (404 = sin permisos configurados, etc.), establecer permisos vacíos
            setPermissions({});
            localStorage.setItem(PERMISSIONS_KEY, JSON.stringify({}));
        } finally {
            setLoading(false);
        }
    };

    /**
     * Verificar si el usuario tiene permiso para un módulo
     * @param module - Nombre del módulo (ej: 'dashboard', 'productos', 'tasas_cambio')
     * @returns true si tiene permiso, false si no
     */
    const hasPermission = (module: keyof UserPermissions): boolean => {
        if (!module) return false;
        return permissions[module] === true;
    };

    /**
     * Limpiar permisos (útil al hacer logout)
     */
    const clearPermissions = () => {
        setPermissions({});
        localStorage.removeItem(PERMISSIONS_KEY);
    };

    return {
        permissions,
        loading,
        hasPermission,
        loadUserPermissions,
        clearPermissions,
    };
}
