import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateRegistration } from "../api/registration.api";

const EditRegistrationModal = ({ isOpen, onClose, registration, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    batch: "",
    foodChoice: "",
    expectedArrivalTime: "",
    overnightAccommodation: "",
    attendees: {
      adults: 0,
      children: 0,
      infants: 0,
    },
    guests: [],
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
        mobile: registration.mobile || "",
        gender: registration.gender || "",
        batch: registration.batch || "",
        foodChoice: registration.foodChoice || "",
        expectedArrivalTime: registration.expectedArrivalTime || "",
        overnightAccommodation: registration.overnightAccommodation || "",
        attendees: {
          adults: registration.attendees?.adults || 0,
          children: registration.attendees?.children || 0,
          infants: registration.attendees?.infants || 0,
        },
        guests: registration.guests || [],
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
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleGuestChange = (index, field, value) => {
    const updatedGuests = [...formData.guests];
    updatedGuests[index] = {
      ...updatedGuests[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      guests: updatedGuests,
    }));
  };

  const addGuest = () => {
    setFormData((prev) => ({
      ...prev,
      guests: [
        ...prev.guests,
        { name: "", gender: "", foodChoice: "", ageCategory: "" },
      ],
    }));
  };

  const removeGuest = (index) => {
    setFormData((prev) => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index),
    }));
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
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Personal Information
              </h3>
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
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
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
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch *
                  </label>
                  <select
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Batch</option>
                    {Array.from({ length: 32 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={`Batch ${num}`}>
                        Batch {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Event Preferences */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Event Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Choice *
                  </label>
                  <select
                    name="foodChoice"
                    value={formData.foodChoice}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Food Choice</option>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Arrival Time *
                  </label>
                  <select
                    name="expectedArrivalTime"
                    value={formData.expectedArrivalTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Time</option>
                    <option value="8-11">8-11 AM</option>
                    <option value="11-14">11 AM - 2 PM</option>
                    <option value="14-17">2-5 PM</option>
                    <option value="17-20">5-8 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overnight Accommodation *
                  </label>
                  <select
                    name="overnightAccommodation"
                    value={formData.overnightAccommodation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Attendees */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Attendees Count
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adults (18+ years)
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
                    Children (6-17 years)
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
                    Infants (0-5 years)
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

            {/* Guests Information */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Guest Details
                </h3>
                <button
                  type="button"
                  onClick={addGuest}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Guest
                </button>
              </div>
              {formData.guests.length > 0 ? (
                <div className="space-y-4">
                  {formData.guests.map((guest, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-md relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeGuest(index)}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={guest.name || ""}
                            onChange={(e) =>
                              handleGuestChange(index, "name", e.target.value)
                            }
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender *
                          </label>
                          <select
                            value={guest.gender || ""}
                            onChange={(e) =>
                              handleGuestChange(index, "gender", e.target.value)
                            }
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Food Choice *
                          </label>
                          <select
                            value={guest.foodChoice || ""}
                            onChange={(e) =>
                              handleGuestChange(
                                index,
                                "foodChoice",
                                e.target.value
                              )
                            }
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select</option>
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Age Category *
                          </label>
                          <select
                            value={guest.ageCategory || ""}
                            onChange={(e) =>
                              handleGuestChange(
                                index,
                                "ageCategory",
                                e.target.value
                              )
                            }
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select</option>
                            <option value="Adult">Adult (18+)</option>
                            <option value="Child">Child (6-17)</option>
                            <option value="Infant">Infant (0-5)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No guests added. Click "Add Guest" to add guest details.
                </p>
              )}
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contribution Amount (₹) *
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
            </div>

            {/* Verification Status */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm font-medium text-gray-900">
                  Verified Payment
                </label>
              </div>
              {formData.verified && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Verified
                </span>
              )}
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
