import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/Auth";
import DashboardLayout from "../components/DashboardLayout";
import RegistrationsTable from "../components/RegistrationsTable";
import StatsDashboard from "../components/StatsDashboard";
import { getRegistrationStats } from "../api/registration.api";
import {
  HiClipboardDocumentList,
  HiCheckCircle,
  HiCurrencyDollar,
  HiUserGroup,
  HiUsers,
  HiShoppingCart,
  HiHome,
  HiClock,
  HiAcademicCap,
} from "react-icons/hi2";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await getRegistrationStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

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

            {/* Statistics Overview */}
            {!loadingStats && stats && (
              <>
                {/* Primary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">
                          Total Registrations
                        </p>
                        <p className="text-3xl font-bold mt-2">
                          {stats.totalRegistrations || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-opacity-20 rounded-lg">
                        <HiClipboardDocumentList className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">
                          Verified Registrations
                        </p>
                        <p className="text-3xl font-bold mt-2">
                          {stats.verifiedCount || 0}
                        </p>
                        <p className="text-xs opacity-75 mt-1">
                          Unverified: {stats.unverifiedCount || 0}
                        </p>
                      </div>
                      <div className="p-3  bg-opacity-20 rounded-lg">
                        <HiCheckCircle className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">
                          Total Revenue
                        </p>
                        <p className="text-3xl font-bold mt-2">
                          ₹{stats.totalAmount || 0}
                        </p>
                        <p className="text-xs opacity-75 mt-1">
                          Verified: ₹{stats.verifiedPaymentTotal || 0}
                        </p>
                      </div>
                      <div className="p-3  bg-opacity-20 rounded-lg">
                        <HiCurrencyDollar className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">
                          Total Attendees
                        </p>
                        <p className="text-3xl font-bold mt-2">
                          {stats.totalAttendees || 0}
                        </p>
                        <p className="text-xs opacity-75 mt-1">
                          A:{stats.attendeeBreakdown?.adults || 0} C:
                          {stats.attendeeBreakdown?.children || 0} I:
                          {stats.attendeeBreakdown?.infants || 0}
                        </p>
                      </div>
                      <div className="p-3  bg-opacity-20 rounded-lg">
                        <HiUserGroup className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Stats - More Detailed Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Attendee Breakdown Widget */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <HiUsers className="w-5 h-5 mr-2 text-indigo-600" />
                      Attendee Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Adults (18+)
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {stats.attendeeBreakdown?.adults || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{
                            width: `${
                              ((stats.attendeeBreakdown?.adults || 0) /
                                (stats.totalAttendees || 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Children (6-17)
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {stats.attendeeBreakdown?.children || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              ((stats.attendeeBreakdown?.children || 0) /
                                (stats.totalAttendees || 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Infants (0-5)
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {stats.attendeeBreakdown?.infants || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{
                            width: `${
                              ((stats.attendeeBreakdown?.infants || 0) /
                                (stats.totalAttendees || 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status Widget */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <HiCheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Payment Status
                    </h3>
                    <div className="space-y-3">
                      {stats.paymentStatusDistribution?.map((status) => (
                        <div key={status._id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600 capitalize">
                              {status._id}
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              {status.count}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                status._id === "completed"
                                  ? "bg-green-500"
                                  : status._id === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${
                                  (status.count /
                                    (stats.totalRegistrations || 1)) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Food Preferences Widget */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <HiShoppingCart className="w-5 h-5 mr-2 text-orange-600" />
                      Food Preferences
                    </h3>
                    <div className="space-y-4">
                      {stats.foodChoices?.map((food) => (
                        <div
                          key={food._id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-3 ${
                                food._id === "Veg"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-sm font-medium text-gray-700">
                              {food._id}
                            </span>
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            {food.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accommodation Widget */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <HiHome className="w-5 h-5 mr-2 text-purple-600" />
                      Overnight Stay
                    </h3>
                    <div className="space-y-4">
                      {stats.accommodationPreferences?.map((acc) => (
                        <div
                          key={acc._id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {acc._id === "Yes"
                              ? "Staying Overnight"
                              : "Day Visit"}
                          </span>
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900 mr-2">
                              {acc.count}
                            </span>
                            <span className="text-xs text-gray-500">
                              (
                              {(
                                (acc.count / (stats.totalRegistrations || 1)) *
                                100
                              ).toFixed(0)}
                              %)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrival Time Widget */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <HiClock className="w-5 h-5 mr-2 text-blue-600" />
                      Arrival Times
                    </h3>
                    <div className="space-y-3">
                      {stats.arrivalTimes?.map((time) => (
                        <div
                          key={time._id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {time._id === "8-11"
                              ? "8-11 AM"
                              : time._id === "11-14"
                              ? "11 AM - 2 PM"
                              : time._id === "14-17"
                              ? "2-5 PM"
                              : "5-8 PM"}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            {time.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Batches Widget */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <HiAcademicCap className="w-5 h-5 mr-2 text-teal-600" />
                      Top Batches
                    </h3>
                    <div className="space-y-2">
                      {stats.batchDistribution
                        ?.sort((a, b) => b.count - a.count)
                        .slice(0, 5)
                        .map((batch, index) => (
                          <div
                            key={batch._id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <span className="text-xs font-medium text-gray-500 w-6">
                                #{index + 1}
                              </span>
                              <span className="text-sm font-medium text-gray-700 ml-2">
                                {batch._id}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">
                              {batch.count}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
}
