import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
// import { motion } from "framer-motion";
import { createRegistration } from "../api/registration.api";

const BackToHillsRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guests, setGuests] = useState([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      // Personal Details
      name: "",
      email: "",
      mobile: "",
      gender: "",
      batch: "",

      // Event Preferences
      foodChoice: "",
      expectedArrivalTime: "",
      overnightAccommodation: "",

      // Attendees
      attendees: {
        adults: 1,
        children: 0,
        infants: 0,
      },

      // Payment
      contributionAmount: 0,
      paymentTransactionId: "",
    },
  });

  const watchedValues = watch();

  // Calculate payment amount based on batch and attendees
  useEffect(() => {
    if (watchedValues.batch && watchedValues.attendees) {
      const batchNumber = parseInt(watchedValues.batch.split(" ")[1]);
      const isFreeBatch = batchNumber >= 28 && batchNumber <= 32;

      let total = 0;

      // Primary registrant pricing
      if (isFreeBatch) {
        // Free for primary registrant
        total += 0;
      } else {
        // Rs 300 for primary registrant (1 adult)
        total += 300;
      }

      // Additional adults (beyond the first one)
      const additionalAdults = Math.max(
        (watchedValues.attendees?.adults || 0) - 1,
        0
      );
      total += additionalAdults * 200;

      // Children (6-17)
      total += (watchedValues.attendees?.children || 0) * 150;

      // Infants are free

      setValue("contributionAmount", total);
    }
  }, [
    watchedValues.batch,
    watchedValues.attendees,
    watchedValues.attendees?.adults,
    watchedValues.attendees?.children,
    watchedValues.attendees?.infants,
    setValue,
  ]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Prepare data for API
      const registrationData = {
        ...data,
        attendees: {
          adults: parseInt(data.attendees?.adults) || 0,
          children: parseInt(data.attendees?.children) || 0,
          infants: parseInt(data.attendees?.infants) || 0,
        },
        guests: guests,
        contributionAmount: parseInt(data.contributionAmount) || 0,
      };

      const response = await createRegistration(registrationData);

      if (response.success === true) {
        toast.success(
          `🎉 Back to the Hills 5.0 Registration Successful! Registration ID: ${response.data.registrationId}`
        );
        reset();
        setGuests([]);
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add guest
  const addGuest = () => {
    setGuests([
      ...guests,
      { name: "", gender: "", foodChoice: "", ageCategory: "" },
    ]);
  };

  // Remove guest
  const removeGuest = (index) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  // Update guest
  const updateGuest = (index, field, value) => {
    const updatedGuests = [...guests];
    updatedGuests[index][field] = value;
    setGuests(updatedGuests);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Event Poster */}
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/images/poster.jpeg"
                alt="Back to the Hills 5.0 - Alumni Meet 2025"
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Back to the  Hills 5.0
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 font-light">
              School Alumni Meet Registration
            </p>
            <p className="text-lg text-gray-600 font-light">
              Date: TBD | Location: TBD
            </p>
          </div>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Welcome back to the hills! Join us for an unforgettable alumni meet
            where we'll reconnect, share memories, and create new ones. Register
            now to secure your spot at this special gathering of our school
            community.
          </p>
        </motion.div>

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 sm:p-6 lg:p-8"
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>
              <div className="w-16 h-0.5 bg-blue-500"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base ${
                        errors.name ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter your email"
                    />
                  )}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="mobile"
                  control={control}
                  rules={{
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Please enter a valid 10-digit mobile number",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base ${
                        errors.mobile ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter your 10-digit mobile number"
                    />
                  )}
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base ${
                        errors.gender ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                />
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="batch"
                  control={control}
                  rules={{ required: "Batch is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base ${
                        errors.batch ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select your batch</option>
                      {Array.from({ length: 32 }, (_, i) => (
                        <option key={i + 1} value={`Batch ${i + 1}`}>
                          Batch {i + 1}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.batch && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.batch.message}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Event Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 sm:p-6 lg:p-8"
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Event Preferences
                </h2>
              </div>
              <div className="w-16 h-0.5 bg-green-500"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Choice <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="foodChoice"
                  control={control}
                  rules={{ required: "Food choice is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base ${
                        errors.foodChoice ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select food preference</option>
                      <option value="Veg">Vegetarian</option>
                      <option value="Non-Veg">Non-Vegetarian</option>
                    </select>
                  )}
                />
                {errors.foodChoice && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.foodChoice.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Time of Arrival{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="expectedArrivalTime"
                  control={control}
                  rules={{ required: "Expected arrival time is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base ${
                        errors.expectedArrivalTime
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select arrival time</option>
                      <option value="8-11">8:00 AM - 11:00 AM</option>
                      <option value="11-14">11:00 AM - 2:00 PM</option>
                      <option value="14-17">2:00 PM - 5:00 PM</option>
                      <option value="17-20">5:00 PM - 8:00 PM</option>
                    </select>
                  )}
                />
                {errors.expectedArrivalTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.expectedArrivalTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overnight Accommodation{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="overnightAccommodation"
                  control={control}
                  rules={{
                    required: "Overnight accommodation preference is required",
                  }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base ${
                        errors.overnightAccommodation
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select accommodation preference</option>
                      <option value="Yes">Yes, I need accommodation</option>
                      <option value="No">No, I don't need accommodation</option>
                    </select>
                  )}
                />
                {errors.overnightAccommodation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.overnightAccommodation.message}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Number of Attendees Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 sm:p-6 lg:p-8"
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-purple-600"
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
                <h2 className="text-2xl font-semibold text-gray-900">
                  Number of Attendees
                </h2>
              </div>
              <div className="w-16 h-0.5 bg-purple-500"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-700 mb-3">
                  Adults (18+ years)
                  <span className="text-sm text-gray-500 block">
                    {(() => {
                      const batchNumber = parseInt(
                        watchedValues.batch?.split(" ")[1]
                      );
                      const isFreeBatch =
                        batchNumber >= 28 && batchNumber <= 32;
                      if (isFreeBatch)
                        return "₹0 for 1st adult (Batches 28-32)";
                      return "₹300 for 1st adult";
                    })()}
                  </span>
                  <span className="text-sm text-gray-500 block">
                    ₹200 for each additional adult
                  </span>
                </h5>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const current = watchedValues.attendees?.adults || 0;
                      if (current > 0) {
                        setValue("attendees.adults", current - 1);
                      }
                    }}
                    className="w-10 h-10 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="w-16 text-center font-semibold text-lg text-gray-900">
                    {watchedValues.attendees?.adults || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = watchedValues.attendees?.adults || 0;
                      setValue("attendees.adults", current + 1);
                    }}
                    className="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-700 mb-3">
                  Children (6-17 years)
                  <span className="text-sm text-gray-500 block">₹150 each</span>
                </h5>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const current = watchedValues.attendees?.children || 0;
                      if (current > 0) {
                        setValue("attendees.children", current - 1);
                      }
                    }}
                    className="w-10 h-10 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="w-16 text-center font-semibold text-lg text-gray-900">
                    {watchedValues.attendees?.children || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = watchedValues.attendees?.children || 0;
                      setValue("attendees.children", current + 1);
                    }}
                    className="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-700 mb-3">
                  Infants (0-5 years)
                  <span className="text-sm text-green-600 block">FREE</span>
                </h5>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const current = watchedValues.attendees?.infants || 0;
                      if (current > 0) {
                        setValue("attendees.infants", current - 1);
                      }
                    }}
                    className="w-10 h-10 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="w-16 text-center font-semibold text-lg text-gray-900">
                    {watchedValues.attendees?.infants || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = watchedValues.attendees?.infants || 0;
                      setValue("attendees.infants", current + 1);
                    }}
                    className="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Guest Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 sm:p-6 lg:p-8"
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Guest Information
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addGuest}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Add Guest</span>
                </button>
              </div>
              <div className="w-16 h-0.5 bg-orange-500"></div>
            </div>

            {guests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No guests added yet. Click "Add Guest" to include additional
                attendees.
              </p>
            ) : (
              <div className="space-y-4">
                {guests.map((guest, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">
                        Guest {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeGuest(index)}
                        className="text-red-600 hover:text-red-700 transition-colors"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={guest.name}
                          onChange={(e) =>
                            updateGuest(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Guest name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select
                          value={guest.gender}
                          onChange={(e) =>
                            updateGuest(index, "gender", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Food Choice
                        </label>
                        <select
                          value={guest.foodChoice}
                          onChange={(e) =>
                            updateGuest(index, "foodChoice", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="">Select preference</option>
                          <option value="Veg">Vegetarian</option>
                          <option value="Non-Veg">Non-Vegetarian</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age Category
                        </label>
                        <select
                          value={guest.ageCategory}
                          onChange={(e) =>
                            updateGuest(index, "ageCategory", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="">Select category</option>
                          <option value="Adult">Adult (18+)</option>
                          <option value="Child">Child (6-17)</option>
                          <option value="Infant">Infant (0-5)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 sm:p-6 lg:p-8"
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-green-600"
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
                <h2 className="text-2xl font-semibold text-gray-900">
                  Payment Details
                </h2>
              </div>
              <div className="w-16 h-0.5 bg-green-500"></div>
            </div>

            <div className="space-y-6">
              {/* Payment Information */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Summary
                </h4>

                <div className="space-y-3 text-sm text-gray-700">
                  {(() => {
                    const batchNumber = parseInt(
                      watchedValues.batch?.split(" ")[1]
                    );
                    const isFreeBatch = batchNumber >= 28 && batchNumber <= 32;
                    const adultCount = watchedValues.attendees?.adults || 0;
                    const childCount = watchedValues.attendees?.children || 0;
                    const infantCount = watchedValues.attendees?.infants || 0;

                    return (
                      <>
                        {/* Adults breakdown */}
                        {isFreeBatch ? (
                          <>
                            <div className="flex justify-between">
                              <span>
                                Adults (18+ years) - 1st adult (Batches 28-32):
                              </span>
                              <span className="font-medium">1 × ₹0 = ₹0</span>
                            </div>
                            {adultCount > 1 && (
                              <div className="flex justify-between">
                                <span>Adults (18+ years) - Additional:</span>
                                <span className="font-medium">
                                  {adultCount - 1} × ₹200 = ₹
                                  {(adultCount - 1) * 200}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span>Adults (18+ years) - 1st adult:</span>
                              <span className="font-medium">
                                1 × ₹300 = ₹300
                              </span>
                            </div>
                            {adultCount > 1 && (
                              <div className="flex justify-between">
                                <span>Adults (18+ years) - Additional:</span>
                                <span className="font-medium">
                                  {adultCount - 1} × ₹200 = ₹
                                  {(adultCount - 1) * 200}
                                </span>
                              </div>
                            )}
                          </>
                        )}

                        <div className="flex justify-between">
                          <span>Children (6-17 years):</span>
                          <span className="font-medium">
                            {childCount} × ₹150 = ₹{childCount * 150}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Infants (0-5 years):</span>
                          <span className="font-medium">
                            {infantCount} × FREE = FREE
                          </span>
                        </div>

                        {isFreeBatch && (
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <p className="text-sm text-green-700 flex items-center">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Free registration for Batches 28-32! Only
                              additional adults pay ₹200 each.
                            </p>
                          </div>
                        )}

                        <div className="border-t border-gray-300 pt-3 mt-3">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total Amount:</span>
                            <span className="text-green-600 text-xl">
                              ₹{watchedValues.contributionAmount || 0}
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-4 text-center">
                  Bank Details for Payment
                </h5>

                {/* UPI QR Code Image */}
                <div className="mb-6 text-center">
                  <div className="bg-white p-4 rounded-lg border border-blue-100 inline-block">
                    <img
                      src="/images/upi.jpeg"
                      alt="UPI QR Code for Payment"
                      className="w-48 h-48 mx-auto rounded-lg shadow-sm"
                    />
                  </div>
                  <p className="text-sm text-blue-700 mt-2 font-medium">
                    Scan QR Code to Pay with BHIM UPI
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div className="space-y-2">
                      <p>
                        <strong>Bank:</strong> Punjab National Bank
                      </p>
                      <p>
                        <strong>Account Holder:</strong> JAWAHAR NAVODAYA
                        VIDYALAYA CALICUT ALUMNI NETWORK
                      </p>
                      <p>
                        <strong>UPI ID:</strong> 9496470738m@pnb
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <strong>Account Number:</strong> 4274000102054962
                      </p>
                      <p>
                        <strong>IFSC Code:</strong> PUNB0427400
                      </p>
                      <p>
                        <strong>Payment Method:</strong> BHIM UPI / Bank
                        Transfer
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Please  mention your name/batch number in the payment description.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Transaction ID/Reference Number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="paymentTransactionId"
                  control={control}
                  rules={{ required: "Payment transaction ID is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base ${
                        errors.paymentTransactionId
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your payment transaction ID or reference number"
                    />
                  )}
                />
                {errors.paymentTransactionId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.paymentTransactionId.message}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-600">
                  Please provide the transaction ID from your payment
                  confirmation
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="pt-4"
          >
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`w-full py-4 px-4 sm:px-6 text-base sm:text-lg font-semibold rounded-lg transition-all duration-200 touch-manipulation ${
                isSubmitting || !isValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl active:bg-blue-800"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting Registration...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Complete Back to Hills 4.0 Registration</span>
                </div>
              )}
            </button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16 pt-8 border-t border-gray-200"
        >
          <div className="mb-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-4"></div>
          </div>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed">
            "Back to the Hills 5.0 is more than just an alumni meet - it's a
            celebration of our shared memories, lasting friendships, and the
            spirit of our school community. We can't wait to see you there!"
          </p>
          <p className="text-blue-600 font-medium mt-4">
            Welcome Back to the Hills! 🏔️
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BackToHillsRegistrationForm;
