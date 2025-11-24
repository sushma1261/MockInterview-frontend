"use client";

import { useAuth } from "@/lib/AuthContext";
import { roleApi } from "@/lib/recruitmentApi";
import type { MyRolesResponse, UserRole } from "@/types/recruitment";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useErrorHandler } from "./ErrorHandlerContext";

interface RoleContextType {
  roles: UserRole[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export const RoleContext = createContext<RoleContextType | undefined>(
  undefined
);

export function useRoleContext() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRoleContext must be used within RoleProvider");
  }
  return ctx;
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { handleError } = useErrorHandler();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    try {
      setLoading(true);
      console.log("Fetching user roles...");
      const res: MyRolesResponse = await roleApi.getMyRoles();
      setRoles(res.roles || []);
    } catch (err) {
      handleError(err);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }
    // fetch roles once when user present
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  return (
    <RoleContext.Provider value={{ roles, loading, refresh: load }}>
      {children}
    </RoleContext.Provider>
  );
}
