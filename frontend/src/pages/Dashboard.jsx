import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/Auth";
import DashboardLayout from "../components/DashboardLayout";
import RegistrationsTable from "../components/RegistrationsTable";
import StatsDashboard from "../components/StatsDashboard";
import { downloadRegistrations } from "../api/registration.api";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Get current page from location
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "dashboard";
    if (path === "/dashboard/registrations") return "registrations";
    if (path === "/dashboard/stats") return "stats";
    return "dashboard";
  };

  const currentPage = getCurrentPage();

  const renderContent = () => {
    switch (currentPage) {
      case "registrations":
        return <RegistrationsTable />;
      case "stats":
        return <StatsDashboard />;
      default:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome to Admin Dashboard
              </h2>
              <p className="text-gray-600">
                Manage registrations and view analytics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              <div
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-200"
                onClick={() => navigate("/dashboard/registrations")}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      View Registrations
                    </h3>
                    <p className="text-sm text-gray-500">
                      Manage all registrations
                    </p>
                    <button
                      onClick={() => navigate("/dashboard/registrations")}
                      className="mt-3 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View Details
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Statistics
                    </h3>
                    <p className="text-sm text-gray-500">
                      View analytics and reports
                    </p>
                    <button
                      onClick={() => navigate("/dashboard/stats")}
                      className="mt-3 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View Analytics
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div> */}

              <div className="bg-white p-6 rounded-lg shadow-sm  hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-purple-600"
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
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Download Data
                    </h3>
                    <p className="text-sm text-gray-500">
                      Export registration data
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          const response = await downloadRegistrations();
                          const blob = new Blob([response.data], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                          });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "registrations.xlsx";
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (error) {
                          console.error("Error downloading file:", error);
                          alert("Failed to download file. Please try again.");
                        }
                      }}
                      className="mt-3 inline-flex items-center cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Download Excel
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
}
