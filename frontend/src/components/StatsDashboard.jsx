import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/registrations/stats/summary"); //api call to get stats
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        toast.error("Failed to fetch statistics");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Error fetching statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Statistics Dashboard
        </h2>
        <p className="text-gray-600">
          Overview of registration data and analytics
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Registrations
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalRegistrations || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.verifiedRegistrations || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{stats.totalRevenue || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Attendees
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalAttendees || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Payment Status
          </h3>
          <div className="space-y-3">
            {stats.paymentStatus &&
              Object.entries(stats.paymentStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {status}
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${
                          status === "completed"
                            ? "bg-green-500"
                            : status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${(count / stats.totalRegistrations) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Registration Types
          </h3>
          <div className="space-y-3">
            {stats.registrationTypes &&
              stats.registrationTypes.map((type) => (
                <div
                  key={type._id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {type._id.replace("-", " ")}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {type.count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* House Colors and Top Districts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            House Colors
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {stats.houseColors &&
              stats.houseColors.map((color) => (
                <div
                  key={color._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{
                        backgroundColor:
                          color._id === "not-sure" ? "#6B7280" : color._id,
                      }}
                    ></div>
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {color._id.replace("-", " ")}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {color.count}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Top Districts
          </h3>
          <div className="space-y-3">
            {stats.topDistricts &&
              stats.topDistricts.map((district, index) => (
                <div
                  key={district._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {district._id}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {district.count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
