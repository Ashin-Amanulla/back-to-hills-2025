import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const OnamRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

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
      contactNumber: "",
      whatsappNumber: "",
      age: "",
      gender: "",
      country: "IN",
      stateUT: "Kerala",
      district: "",
      city: "",
      pincode: "",

      // Event Preferences
      isAttending: true,
      attendees: {
        adults: 0,
        children: 0,
      },
      eventParticipation: [],
      participationDetails: "",
      dietaryRestrictions: "",
      accommodation: false,
      accommodationType: "",

      // Onam Specific
      traditionalDress: false,
      culturalProgram: false,
      programType: "",
      flowerArrangement: false,
      pookalamSize: "",

      // Financial
      contributionAmount: 0,
      proposedAmount: 0,
      paymentStatus: "pending",
    },
  });

  const watchedValues = watch();

  // Calculate payment amount based on attendees
  useEffect(() => {
    if (watchedValues.isAttending && watchedValues.attendees) {
      const attendees = watchedValues.attendees;
      const adultCount = attendees?.adults || 0;
      const childCount = attendees?.children || 0;

      const totalExpense = adultCount * 800 + childCount * 400;
      setValue("proposedAmount", totalExpense);
      setValue("contributionAmount", totalExpense);
    }
  }, [watchedValues.isAttending, watchedValues.attendees, setValue]);

  // Handle OTP verification
  const handleSendOtp = async () => {
    if (!watchedValues.email || !watchedValues.contactNumber) {
      toast.error("Please enter email and contact number first");
      return;
    }
    setShowOtpInput(true);
    toast.success("OTP sent to your email and phone!");
  };

  const handleVerifyOtp = () => {
    if (otp === "1234") {
      // Dummy OTP for demo
      setEmailVerified(true);
      toast.success("Email verified successfully!");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  // Handle form submission
  const onSubmit = async () => {
    if (!emailVerified) {
      toast.error("Please complete email verification before submitting");
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        "🎉 Onam Registration Successful! Welcome to the celebration!"
      );
      reset();
      setEmailVerified(false);
      setShowOtpInput(false);
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kerala districts for Onam
  const keralaDistricts = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Professional Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Image Placeholder */}
          <div className="mb-8">
            <div className="w-full h-64 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl border-2 border-dashed border-emerald-300 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-emerald-600 font-medium">
                  Onam Celebration Image
                </p>
                <p className="text-emerald-500 text-sm">
                  Image will be added here
                </p>
              </div>
            </div>
          </div>

          {/* Professional Title */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Onam Celebration 2024
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 font-light">
              Kerala's Harvest Festival Registration
            </p>
          </div>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Join us for a grand celebration of Kerala's harvest festival
            featuring traditional feasts, cultural programs, and the spirit of
            unity and prosperity. Register now to be part of this memorable
            occasion.
          </p>
        </motion.div>

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg p-8"
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-emerald-600"
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
              <div className="w-16 h-0.5 bg-emerald-500"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="contactNumber"
                  control={control}
                  rules={{ required: "Contact number is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                        errors.contactNumber
                          ? "border-red-300"
                          : "border-green-200"
                      }`}
                      placeholder="Enter your contact number"
                    />
                  )}
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <Controller
                  name="whatsappNumber"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      placeholder="Enter WhatsApp number (optional)"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                        errors.gender ? "border-red-300" : "border-green-200"
                      }`}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State/UT <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="stateUT"
                  control={control}
                  rules={{ required: "State/UT is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                        errors.stateUT ? "border-red-300" : "border-green-200"
                      }`}
                    >
                      <option value="">Select state/UT</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                />
                {errors.stateUT && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.stateUT.message}
                  </p>
                )}
              </div>

              {watchedValues.stateUT === "Kerala" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="district"
                    control={control}
                    rules={{ required: "District is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                          errors.district
                            ? "border-red-300"
                            : "border-green-200"
                        }`}
                      >
                        <option value="">Select district</option>
                        {keralaDistricts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.district.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Email Verification */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Email Verification
                  </h3>
                  <p className="text-sm text-gray-600">
                    Please verify your email to continue with registration
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={
                    !watchedValues.email || !watchedValues.contactNumber
                  }
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Send OTP
                </button>
              </div>

              {showOtpInput && (
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      maxLength={4}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Verify
                    </button>
                  </div>
                  {emailVerified && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-sm text-emerald-700 flex items-center">
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
                        Email verified successfully!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Event Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg p-8"
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-amber-600"
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
                  Event Preferences
                </h2>
              </div>
              <div className="w-16 h-0.5 bg-amber-500"></div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Controller
                  name="isAttending"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      id="isAttending"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-5 h-5 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                    />
                  )}
                />
                <label
                  htmlFor="isAttending"
                  className="text-lg font-medium text-gray-700"
                >
                  I will be attending the Onam celebration
                </label>
              </div>

              {watchedValues.isAttending && (
                <>
                  {/* Attendee Counter */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Number of Attendees
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">
                          Adults (₹800 each)
                        </h5>
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const current =
                                    watchedValues.attendees?.adults || 0;
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
                                  const current =
                                    watchedValues.attendees?.adults || 0;
                                  setValue("attendees.adults", current + 1);
                                }}
                                className="w-10 h-10 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
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
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">
                          Children (₹400 each)
                        </h5>
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const current =
                                    watchedValues.attendees?.children || 0;
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
                                  const current =
                                    watchedValues.attendees?.children || 0;
                                  setValue("attendees.children", current + 1);
                                }}
                                className="w-10 h-10 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
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
                      </div>
                    </div>
                  </div>

                  {/* Onam Specific Preferences */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Onam Special Activities
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Controller
                          name="traditionalDress"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              id="traditionalDress"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                            />
                          )}
                        />
                        <label
                          htmlFor="traditionalDress"
                          className="text-sm font-medium text-gray-700"
                        >
                          Will wear traditional Kerala dress (Mundu/Dhoti/Saree)
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Controller
                          name="culturalProgram"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              id="culturalProgram"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                            />
                          )}
                        />
                        <label
                          htmlFor="culturalProgram"
                          className="text-sm font-medium text-gray-700"
                        >
                          Interested in cultural program participation
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Controller
                          name="flowerArrangement"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              id="flowerArrangement"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                            />
                          )}
                        />
                        <label
                          htmlFor="flowerArrangement"
                          className="text-sm font-medium text-gray-700"
                        >
                          Will participate in Pookalam competition
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Controller
                          name="accommodation"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              id="accommodation"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                            />
                          )}
                        />
                        <label
                          htmlFor="accommodation"
                          className="text-sm font-medium text-gray-700"
                        >
                          Need accommodation for the event
                        </label>
                      </div>
                    </div>

                    {watchedValues.culturalProgram && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type of Cultural Program
                        </label>
                        <Controller
                          name="programType"
                          control={control}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            >
                              <option value="">Select program type</option>
                              <option value="classical-dance">
                                Classical Dance (Kathakali/Mohiniyattam)
                              </option>
                              <option value="folk-dance">Folk Dance</option>
                              <option value="music">
                                Music (Carnatic/Folk)
                              </option>
                              <option value="poetry">Poetry Recitation</option>
                              <option value="skit">Skit/Drama</option>
                              <option value="other">Other</option>
                            </select>
                          )}
                        />
                      </div>
                    )}

                    {watchedValues.flowerArrangement && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pookalam Size
                        </label>
                        <Controller
                          name="pookalamSize"
                          control={control}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            >
                              <option value="">Select size</option>
                              <option value="small">Small (2-3 feet)</option>
                              <option value="medium">Medium (4-6 feet)</option>
                              <option value="large">Large (7-10 feet)</option>
                              <option value="extra-large">
                                Extra Large (10+ feet)
                              </option>
                            </select>
                          )}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Participation Details
                      </label>
                      <Controller
                        name="participationDetails"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            placeholder="Tell us more about your interests and how you'd like to participate..."
                          />
                        )}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg p-8"
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-teal-600"
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
              <div className="w-16 h-0.5 bg-teal-500"></div>
            </div>

            <div className="space-y-6">
              {/* Payment Information */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Information
                </h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Adults (₹800 each):</span>
                    <span>
                      ₹
                      {(watchedValues.attendees?.adults || 0) +
                        (watchedValues.attendees?.adults || 0)}{" "}
                      × 800 = ₹
                      {((watchedValues.attendees?.adults || 0) +
                        (watchedValues.attendees?.adults || 0)) *
                        800}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Children (₹400 each):</span>
                    <span>
                      ₹
                      {(watchedValues.attendees?.children || 0) +
                        (watchedValues.attendees?.children || 0)}{" "}
                      × 400 = ₹
                      {((watchedValues.attendees?.children || 0) +
                        (watchedValues.attendees?.children || 0)) *
                        400}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount:</span>
                      <span className="text-teal-600">
                        ₹{watchedValues.proposedAmount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contribution Amount (₹){" "}
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="contributionAmount"
                  control={control}
                  rules={{ required: "Contribution amount is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min={1}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all ${
                        errors.contributionAmount
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter contribution amount"
                    />
                  )}
                />
                {errors.contributionAmount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contributionAmount.message}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-600">
                  Suggested amount: ₹{watchedValues.proposedAmount || 0} (any
                  amount accepted)
                </p>
              </div>

              <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                <h4 className="text-sm font-medium text-emerald-800 mb-3">
                  What's Included in Your Contribution
                </h4>
                <ul className="text-sm text-emerald-700 space-y-2">
                  <li>• Traditional Onam Sadya (feast)</li>
                  <li>• Cultural program participation</li>
                  <li>• Pookalam competition entry</li>
                  <li>• Traditional games and activities</li>
                  <li>• Souvenirs and certificates</li>
                  <li>• Transportation (if needed)</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="pt-4"
          >
            <button
              type="submit"
              disabled={isSubmitting || !emailVerified || !isValid}
              className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-200 ${
                isSubmitting || !emailVerified || !isValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl"
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
                  <span>Complete Onam Registration</span>
                </div>
              )}
            </button>

            {!emailVerified && (
              <p className="mt-3 text-sm text-red-600 text-center">
                Please complete email verification before submitting
              </p>
            )}
          </motion.div>
        </form>

        {/* Professional Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16 pt-8 border-t border-gray-200"
        >
          <div className="mb-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-4"></div>
          </div>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed">
            "Onam is not just a festival, it's a celebration of unity,
            prosperity, and the spirit of giving. We look forward to celebrating
            this joyous occasion with you."
          </p>
          <p className="text-emerald-600 font-medium mt-4">Happy Onam! 🎉</p>
        </motion.div>
      </div>
    </div>
  );
};

export default OnamRegistrationForm;
