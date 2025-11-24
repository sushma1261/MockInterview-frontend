"use client";

import UserTable from "@/app/components/admin/UserTable";
import { useUserRole } from "@/hooks/useUserRole";
import { userManagementApi } from "@/lib/recruitmentApi";
import { UserRole, UserWithRoles } from "@/types/recruitment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const router = useRouter();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  // Redirect if not admin
  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, roleLoading, router]);

  // Fetch users
  const fetchUsers = async (query: string, page: number) => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * itemsPerPage;
      const response = await userManagementApi.getAllUsers({
        search: query || undefined,
        limit: itemsPerPage,
        offset,
      });

      if (response.success) {
        setUsers(response.users);
        setTotal(response.total);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!roleLoading && isAdmin) {
      fetchUsers("", 1);
    }
  }, [roleLoading, isAdmin]);

  // Search handler
  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(searchQuery, 1);
  };

  // Page change handler
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchUsers(searchQuery, newPage);
  };

  // Batch role update handler
  const handleBatchUpdate = async (
    updates: Array<{ userId: number; roles: UserRole[] }>
  ) => {
    try {
      // Use the bulk update API endpoint
      const response = await userManagementApi.bulkUpdateRoles(updates);

      // Check for partial failures
      if (response.results.failed > 0) {
        const failedUsers = response.results.details
          .filter((d) => !d.success)
          .map((d) => `User ${d.userId}: ${d.error}`)
          .join(", ");
        setError(
          `Partial success: ${response.results.successful} updated, ${response.results.failed} failed. ${failedUsers}`
        );
      } else if (!response.success) {
        setError(response.message || "Failed to update roles");
      }

      // Refresh the current page after updates
      await fetchUsers(searchQuery, currentPage);
    } catch (err) {
      throw err; // Let UserTable handle the error
    }
  };

  // Show loading state while checking roles
  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render if not admin (will redirect)
  if (!isAdmin) {
    return null;
  }

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      {/* Search Bar */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* User Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading users...</div>
        </div>
      ) : (
        <>
          <UserTable users={users} onBatchUpdate={handleBatchUpdate} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, total)} of {total} users
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
