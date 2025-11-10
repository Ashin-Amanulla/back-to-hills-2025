import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import {
  getRegistrations,
  downloadRegistrations,
} from "../api/registration.api";
import EditRegistrationModal from "./EditRegistrationModal";

const RegistrationsTable = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [sortBy, setSortBy] = useState("registrationDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  const itemsPerPage = 10;

  // Fetch registrations
  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { verified: statusFilter }),
        ...(paymentFilter && { paymentStatus: paymentFilter }),
        ...(batchFilter && { batch: batchFilter }),
      });

      const response = await getRegistrations(params);
      const data = response;

      if (data.success) {
        setRegistrations(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalRegistrations(data.pagination.totalRegistrations);
      } else {
        toast.error("Failed to fetch registrations");
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Error fetching registrations");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [
    currentPage,
    sortBy,
    sortOrder,
    searchTerm,
    statusFilter,
    paymentFilter,
    batchFilter,
  ]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Create debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchLoading(true);
        setSearchTerm(value);
        setCurrentPage(1);
      }, 500),
    []
  );

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    // Update input value immediately for UI responsiveness
    setInputValue(value);
    // Debounce the actual search
    debouncedSearch(value);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Handle edit button click
  const handleEditClick = (registration) => {
    setSelectedRegistration(registration);
    setIsEditModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedRegistration(null);
  };

  // Handle registration update
  const handleRegistrationUpdate = (updatedRegistration) => {
    setRegistrations((prevRegistrations) =>
      prevRegistrations.map((reg) =>
        reg._id === updatedRegistration._id ? updatedRegistration : reg
      )
    );
  };

  const paginationRange = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [];
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (left > 2) {
      pages.push("ellipsis-left");
    }

    for (let page = left; page <= right; page += 1) {
      pages.push(page);
    }

    if (right < totalPages - 1) {
      pages.push("ellipsis-right");
    }

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Registrations</h2>
            <p className="text-gray-600">
              Total: {totalRegistrations} registrations
            </p>
          </div>
          <button
            onClick={async () => {
              try {
                toast.info("Downloading registrations...");
                const response = await downloadRegistrations();
                const blob = new Blob([response.data], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `registrations_${
                  new Date().toISOString().split("T")[0]
                }.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success("Downloaded successfully!");
              } catch (error) {
                console.error("Error downloading file:", error);
                toast.error("Failed to download file. Please try again.");
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download All
          </button>
        </div>

        {/* Search and filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={inputValue}
                onChange={handleSearch}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch
            </label>
            <select
              value={batchFilter}
              onChange={(e) => {
                setBatchFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Batches</option>
              <option value="Batch 1">Batch 1</option>
              <option value="Batch 2">Batch 2</option>
              <option value="Batch 3">Batch 3</option>
              <option value="Batch 4">Batch 4</option>
              <option value="Batch 5">Batch 5</option>
              <option value="Batch 6">Batch 6</option>
              <option value="Batch 7">Batch 7</option>
              <option value="Batch 8">Batch 8</option>
              <option value="Batch 9">Batch 9</option>
              <option value="Batch 10">Batch 10</option>
              <option value="Batch 11">Batch 11</option>
              <option value="Batch 12">Batch 12</option>
              <option value="Batch 13">Batch 13</option>
              <option value="Batch 14">Batch 14</option>
              <option value="Batch 15">Batch 15</option>
              <option value="Batch 16">Batch 16</option>
              <option value="Batch 17">Batch 17</option>
              <option value="Batch 18">Batch 18</option>
              <option value="Batch 19">Batch 19</option>
              <option value="Batch 20">Batch 20</option>
              <option value="Batch 21">Batch 21</option>
              <option value="Batch 22">Batch 22</option>
              <option value="Batch 23">Batch 23</option>
              <option value="Batch 24">Batch 24</option>
              <option value="Batch 25">Batch 25</option>
              <option value="Batch 26">Batch 26</option>
              <option value="Batch 27">Batch 27</option>
              <option value="Batch 28">Batch 28</option>
              <option value="Batch 29">Batch 29</option>
              <option value="Batch 30">Batch 30</option>
              <option value="Batch 31">Batch 31</option>
              <option value="Batch 32">Batch 32</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setInputValue("");
                setSearchTerm("");
                setStatusFilter("");
                setPaymentFilter("");
                setBatchFilter("");
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort("name")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Name
                      {sortBy === "name" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th
                    onClick={() => handleSort("batch")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Batch
                      {sortBy === "batch" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendees
                  </th>
                  <th
                    onClick={() => handleSort("contributionAmount")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Amount
                      {sortBy === "contributionAmount" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr
                    key={registration._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {registration.registrationId ||
                          `BTH4${registration._id
                            ?.toString()
                            .slice(-8)
                            .toUpperCase()}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {registration.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.mobile}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.batch}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {registration.totalAttendees ||
                            (registration.attendees?.adults || 0) +
                              (registration.attendees?.children || 0) +
                              (registration.attendees?.infants || 0)}{" "}
                          Total
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        A:{registration.attendees?.adults || 0} C:
                        {registration.attendees?.children || 0} I:
                        {registration.attendees?.infants || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{registration.contributionAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          registration.paymentStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : registration.paymentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {registration.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          registration.verified
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {registration.verified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEditClick(registration)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        View/Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalRegistrations)}
              </span>{" "}
              of <span className="font-medium">{totalRegistrations}</span>{" "}
              results
            </p>
          </div>
          <nav className="flex items-center gap-2" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {paginationRange.map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-md border text-sm font-medium ${
                    page === currentPage
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span
                  key={`${page}-${index}`}
                  className="inline-flex h-9 w-9 items-center justify-center text-sm text-gray-400"
                >
                  &hellip;
                </span>
              )
            )}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>

      {/* Edit Registration Modal */}
      <EditRegistrationModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        registration={selectedRegistration}
        onUpdate={handleRegistrationUpdate}
      />
    </div>
  );
};

export default RegistrationsTable;
