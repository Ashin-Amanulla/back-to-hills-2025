import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateRegistration } from "../api/registration.api";

const EditRegistrationModal = ({ isOpen, onClose, registration, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNumber: "",
    gender: "",
    stateUT: "",
    otherStateUT: "",
    district: "",
    houseColor: "",
    yearOfPassing: "",
    registrationTypes: [],
    attendees: {
      adults: 0,
      children: 0,
      infants: 0,
    },
    contributionAmount: 0,
    paymentStatus: "",
    paymentTransactionId: "",
    verified: false,
  });
  const [loading, setLoading] = useState(false);

  // Populate form data when registration changes
  useEffect(() => {
    if (registration) {
      setFormData({
        name: registration.name || "",
        email: registration.email || "",
        whatsappNumber: registration.whatsappNumber || "",
        gender: registration.gender || "",
        stateUT: registration.stateUT || "",
        otherStateUT: registration.otherStateUT || "",
        district: registration.district || "",
        houseColor: registration.houseColor || "",
        yearOfPassing: registration.yearOfPassing || "",
        registrationTypes: registration.registrationTypes || [],
        attendees: {
          adults: registration.attendees?.adults || 0,
          children: registration.attendees?.children || 0,
          infants: registration.attendees?.infants || 0,
        },
        contributionAmount: registration.contributionAmount || 0,
        paymentStatus: registration.paymentStatus || "",
        paymentTransactionId: registration.paymentTransactionId || "",
        verified: registration.verified || false,
      });
    }
  }, [registration]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("attendees.")) {
      const attendeeType = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        attendees: {
          ...prev.attendees,
          [attendeeType]: parseInt(value) || 0,
        },
      }));
    } else if (name === "registrationTypes") {
      const options = e.target.options;
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData((prev) => ({
        ...prev,
        [name]: selectedValues,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateRegistration(registration._id, formData);

      if (response.success) {
        toast.success("Registration updated successfully");
        onUpdate(response.data);
        onClose();
      } else {
        toast.error(response.message || "Failed to update registration");
      }
    } catch (error) {
      console.error("Error updating registration:", error);
      toast.error("Error updating registration");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Registration
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/UT *
                </label>
                <input
                  type="text"
                  name="stateUT"
                  value={formData.stateUT}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other State/UT
                </label>
                <input
                  type="text"
                  name="otherStateUT"
                  value={formData.otherStateUT}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House Color *
                </label>
                <select
                  name="houseColor"
                  value={formData.houseColor}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select House Color</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="orange">Orange</option>
                  <option value="purple">Purple</option>
                  <option value="pink">Pink</option>
                  <option value="not-sure">Not Sure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Passing
                </label>
                <input
                  type="number"
                  name="yearOfPassing"
                  value={formData.yearOfPassing}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Registration Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Types
              </label>
              <select
                name="registrationTypes"
                multiple
                value={formData.registrationTypes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                size="3"
              >
                <option value="attendee">Attendee</option>
                <option value="sponsor">Sponsor</option>
                <option value="donor">Donor</option>
                <option value="volunteer">Volunteer</option>
                <option value="passout-student">Passout Student</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl/Cmd to select multiple options
              </p>
            </div>

            {/* Attendees */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Attendees
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adults
                  </label>
                  <input
                    type="number"
                    name="attendees.adults"
                    value={formData.attendees.adults}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children
                  </label>
                  <input
                    type="number"
                    name="attendees.children"
                    value={formData.attendees.children}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Infants
                  </label>
                  <input
                    type="number"
                    name="attendees.infants"
                    value={formData.attendees.infants}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contribution Amount *
                </label>
                <input
                  type="number"
                  name="contributionAmount"
                  value={formData.contributionAmount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status *
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Payment Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Transaction ID *
                </label>
                <input
                  type="text"
                  name="paymentTransactionId"
                  value={formData.paymentTransactionId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Verification Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="verified"
                checked={formData.verified}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Verified
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? "Updating..." : "Update Registration"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRegistrationModal;
