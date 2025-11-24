"use client";

import { UserRole, UserWithRoles } from "@/types/recruitment";
import { useState } from "react";

interface UserTableProps {
  users: UserWithRoles[];
  onBatchUpdate?: (
    updates: Array<{ userId: number; roles: UserRole[] }>
  ) => Promise<void>;
}

const AVAILABLE_ROLES: UserRole[] = [
  "admin",
  "hr",
  "interviewer",
  "hiring_manager",
  "candidate",
];

export default function UserTable({ users, onBatchUpdate }: UserTableProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [batchRoles, setBatchRoles] = useState<Set<UserRole>>(new Set());
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);

  // Track individual role changes for each user
  const [modifiedUserRoles, setModifiedUserRoles] = useState<
    Map<number, Set<UserRole>>
  >(new Map());

  const handleSelectUser = (userId: number) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map((u) => u.id)));
    }
  };

  const handleToggleBatchRole = (role: UserRole) => {
    const newRoles = new Set(batchRoles);
    if (newRoles.has(role)) {
      newRoles.delete(role);
    } else {
      newRoles.add(role);
    }
    setBatchRoles(newRoles);
  };

  const handleBatchUpdate = async () => {
    if (batchRoles.size === 0 || selectedUsers.size === 0 || !onBatchUpdate)
      return;

    setError(null);
    setIsBatchUpdating(true);

    try {
      const updates = Array.from(selectedUsers).map((userId) => ({
        userId,
        roles: Array.from(batchRoles),
      }));
      await onBatchUpdate(updates);
      // Clear selection after successful update
      setSelectedUsers(new Set());
      setBatchRoles(new Set());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to batch update roles"
      );
    } finally {
      setIsBatchUpdating(false);
    }
  };

  // Get current roles for a user (modified or original)
  const getUserRoles = (userId: number): Set<UserRole> => {
    if (modifiedUserRoles.has(userId)) {
      return modifiedUserRoles.get(userId)!;
    }
    const user = users.find((u) => u.id === userId);
    return new Set(user?.roles || []);
  };

  // Toggle individual role for a specific user
  const handleToggleUserRole = (userId: number, role: UserRole) => {
    const currentRoles = getUserRoles(userId);
    const newRoles = new Set(currentRoles);

    if (newRoles.has(role)) {
      newRoles.delete(role);
    } else {
      newRoles.add(role);
    }

    const newModified = new Map(modifiedUserRoles);
    newModified.set(userId, newRoles);
    setModifiedUserRoles(newModified);
  };

  // Update all modified user roles
  const handleIndividualUpdate = async () => {
    if (modifiedUserRoles.size === 0 || !onBatchUpdate) return;

    setError(null);
    setIsBatchUpdating(true);

    try {
      const updates = Array.from(modifiedUserRoles.entries()).map(
        ([userId, roles]) => ({
          userId,
          roles: Array.from(roles),
        })
      );
      await onBatchUpdate(updates);
      // Clear modifications after successful update
      setModifiedUserRoles(new Map());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update roles");
    } finally {
      setIsBatchUpdating(false);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No users found. Try adjusting your search.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 border-b border-red-200">
          {error}
        </div>
      )}

      {/* Batch Update Controls */}
      {selectedUsers.size > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {selectedUsers.size} user{selectedUsers.size > 1 ? "s" : ""}{" "}
                selected
              </span>
              <button
                onClick={() => setSelectedUsers(new Set())}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Selection
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">
                Select roles to assign:
              </span>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_ROLES.map((role) => (
                  <label
                    key={role}
                    className="inline-flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={batchRoles.has(role)}
                      onChange={() => handleToggleBatchRole(role)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleBatchUpdate}
                disabled={batchRoles.size === 0 || isBatchUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isBatchUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  `Bulk Update ${batchRoles.size} Role${
                    batchRoles.size !== 1 ? "s" : ""
                  }`
                )}
              </button>
              {batchRoles.size > 0 && (
                <span className="text-xs text-gray-600">
                  Selected: {Array.from(batchRoles).join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedUsers.size === users.length && users.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assign Roles
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.display_name || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No roles</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_ROLES.map((role) => (
                      <label
                        key={role}
                        className="inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={getUserRoles(user.id).has(role)}
                          onChange={() => handleToggleUserRole(user.id, role)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {role}
                        </span>
                      </label>
                    ))}
                  </div>
                  {modifiedUserRoles.has(user.id) && (
                    <div className="mt-1 text-xs text-amber-600 font-medium">
                      Modified - click &quot;Update Roles&quot; below to save
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Individual Update Button */}
      {modifiedUserRoles.size > 0 && (
        <div className="p-4 bg-amber-50 border-t border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">
                {modifiedUserRoles.size} user
                {modifiedUserRoles.size > 1 ? "s" : ""} modified
              </span>
              <span className="text-xs text-gray-600">
                Click &quot;Update Roles&quot; to save all changes
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setModifiedUserRoles(new Map())}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel Changes
              </button>
              <button
                onClick={handleIndividualUpdate}
                disabled={isBatchUpdating}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isBatchUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>Update Roles ({modifiedUserRoles.size})</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
