"use client";

import { useErrorHandler } from "@/app/utils/ErrorHandlerContext";
import { RoleContext } from "@/app/utils/RoleContext";
import { useAuth } from "@/lib/AuthContext";
import { roleApi } from "@/lib/recruitmentApi";
import { UserRole } from "@/types/recruitment";
import { useContext, useEffect, useState } from "react";

interface UseUserRoleReturn {
  roles: UserRole[];
  loading: boolean;
  isAdmin: boolean; // TODO: can be stored in a single variable
  isHR: boolean;
  isCandidate: boolean;
  hasRole: (role: UserRole) => boolean;
  refreshRoles: () => Promise<void>;
}

export function useUserRole(): UseUserRoleReturn {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();
  const { user, loading: authLoading } = useAuth();
  // If a RoleProvider exists in the tree, prefer it and skip local fetching.
  const roleCtx = useContext(RoleContext);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await roleApi.getMyRoles();
      setRoles(response.roles);
    } catch (error) {
      handleError(error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Only fetch roles after auth has finished initializing and we have a user.
    // If a RoleProvider exists, skip local fetching.
    if (authLoading) {
      return;
    }

    if (roleCtx) {
      // provider will manage roles; ensure local loading flag is cleared
      setLoading(false);
      return;
    }

    if (!user) {
      // user logged out or not authenticated — clear roles
      setRoles([]);
      setLoading(false);
      return;
    }

    loadRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, roleCtx]);

  if (roleCtx) {
    return {
      roles: roleCtx.roles,
      loading: roleCtx.loading,
      isAdmin: roleCtx.roles.includes("admin"),
      isHR: roleCtx.roles.includes("hr"),
      isCandidate: roleCtx.roles.includes("candidate"),
      hasRole: (role: UserRole) => roleCtx.roles.includes(role),
      refreshRoles: roleCtx.refresh,
    };
  }

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  return {
    roles,
    loading,
    isAdmin: hasRole("admin"),
    isHR: hasRole("hr"),
    isCandidate: hasRole("candidate"),
    hasRole,
    refreshRoles: loadRoles,
  };
}
