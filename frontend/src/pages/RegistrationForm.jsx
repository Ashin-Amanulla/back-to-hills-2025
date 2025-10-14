import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
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
    if (watchedValues.batch) {
      const batchNumber = parseInt(watchedValues.batch.split(" ")[1]);
      const isFreeBatch = batchNumber >= 28 && batchNumber <= 32;

      const adultCount = watchedValues.attendees?.adults || 0;
      const childCount = watchedValues.attendees?.children || 0;

      let total = 0;

      // Calculate adult charges
      if (adultCount > 0) {
        if (isFreeBatch) {
          // First adult is free for batches 28-32
          total += 0;
          // Additional adults (beyond the first one)
          if (adultCount > 1) {
            total += (adultCount - 1) * 200;
          }
        } else {
          // First adult costs 300
          total += 300;
          // Additional adults (beyond the first one)
          if (adultCount > 1) {
            total += (adultCount - 1) * 200;
          }
        }
      }

      // Children (6-17 years) - Rs 150 each
      total += childCount * 150;

      // Infants are free (no charge)

      setValue("contributionAmount", total);
    }
  }, [
    watchedValues.batch,
    watchedValues.attendees?.adults,
    watchedValues.attendees?.children,
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 py-4 sm:py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Event Poster */}
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="/images/poster.jpeg"
                alt="Back to the Hills 5.0 - Alumni Meet 2025"
                className="w-full h-auto max-h-[500px] sm:max-h-[600px] md:max-h-[700px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
            </div>
          </div>

          {/* Title Section */}
          <div className="mb-8 relative">
            <div className="inline-block">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Alumni Reunion 2025
                </span>
              </h1>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
                <div className="h-1 w-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base">
              <div className="flex items-center gap-2 text-gray-700">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-semibold">27-28 December 2025</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-semibold">JNV Calicut Campus</span>
              </div>
            </div>
          </div>

          {/* Welcome Message with Quote */}
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-6">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed italic">
                "The memories we made within these hills shaped who we are
                today. Let's reunite, reminisce, and create new stories
                together!"
              </p>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Welcome back to the hills! Join us for an unforgettable alumni
              reunion where old friendships are rekindled and new connections
              are made. Secure your spot at this special celebration of our
              school's legacy.
            </p>
          </div>
        </motion.div>

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 sm:p-8 lg:p-10 hover:shadow-emerald-200/50 transition-all duration-300"
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Personal Information
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Let us know who you are
                  </p>
                </div>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
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
                      className={`w-full px-4 sm:px-5 py-3.5 bg-white/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-base placeholder:text-gray-400 ${
                        errors.name
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 group-hover:border-emerald-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                  )}
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
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
                      className={`w-full px-4 sm:px-5 py-3.5 bg-white/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-base placeholder:text-gray-400 ${
                        errors.email
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 group-hover:border-emerald-300"
                      }`}
                      placeholder="your.email@example.com"
                    />
                  )}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="mobile"
                  control={control}
                  rules={{
                    required: "Mobile number is required",
                    pattern: {
                      message: "Please enter your mobile number",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      className={`w-full px-4 sm:px-5 py-3.5 bg-white/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-base placeholder:text-gray-400 ${
                        errors.mobile
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 group-hover:border-emerald-300"
                      }`}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  )}
                />
                {errors.mobile && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.mobile.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Gender <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 sm:px-5 py-3.5 bg-white/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-base ${
                        errors.gender
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 group-hover:border-emerald-300"
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
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.gender.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Batch <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="batch"
                  control={control}
                  rules={{ required: "Batch is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 sm:px-5 py-3.5 bg-white/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-base ${
                        errors.batch
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 group-hover:border-emerald-300"
                      }`}
                    >
                      <option value="">Select your batch</option>
                      {Array.from({ length: 32 }, (_, i) => (
                        <option key={i + 1} value={`Batch ${i + 1}`}>
                          Batch {i + 1}{" "}
                          {i + 1 >= 28 && i + 1 <= 32 ? "🎉 (Free Entry)" : ""}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.batch && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.batch.message}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Event Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 sm:p-8 lg:p-10 hover:shadow-teal-200/50 transition-all duration-300"
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Event Preferences
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Help us plan better for you
                  </p>
                </div>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Food Choice <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="foodChoice"
                  control={control}
                  rules={{ required: "Food choice is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 sm:px-5 py-3.5 bg-white/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-base ${
                        errors.foodChoice
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 group-hover:border-teal-300"
                      }`}
                    >
                      <option value="">Select food preference</option>
                      <option value="Veg">🥗 Vegetarian</option>
                      <option value="Non-Veg">🍗 Non-Vegetarian</option>
                    </select>
                  )}
                />
                {errors.foodChoice && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.foodChoice.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Expected Arrival Time <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="expectedArrivalTime"
                  control={control}
                  rules={{ required: "Expected arrival time is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 sm:px-5 py-3.5 bg-white/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-base ${
                        errors.expectedArrivalTime
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 group-hover:border-teal-300"
                      }`}
                    >
                      <option value="">Select arrival time</option>
                      <option value="8-11">🌅 8:00 AM - 11:00 AM</option>
                      <option value="11-14">☀️ 11:00 AM - 2:00 PM</option>
                      <option value="14-17">🌤️ 2:00 PM - 5:00 PM</option>
                      <option value="17-20">🌆 5:00 PM - 8:00 PM</option>
                    </select>
                  )}
                />
                {errors.expectedArrivalTime && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.expectedArrivalTime.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
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
                      className={`w-full px-4 sm:px-5 py-3.5 bg-white/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-base ${
                        errors.overnightAccommodation
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 group-hover:border-teal-300"
                      }`}
                    >
                      <option value="">Select preference</option>
                      <option value="Yes">🛏️ Yes, I need accommodation</option>
                      <option value="No">
                        🏠 No, I don't need accommodation
                      </option>
                    </select>
                  )}
                />
                {errors.overnightAccommodation && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.overnightAccommodation.message}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Number of Attendees Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 sm:p-8 lg:p-10 hover:shadow-purple-200/50 transition-all duration-300"
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Number of Attendees
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    How many people will join you?
                  </p>
                </div>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-bold text-gray-800">👨‍👩‍👧‍👦 Adults</h5>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                    18+ years
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <span className="text-sm text-gray-600 block">
                    {(() => {
                      const batchNumber = parseInt(
                        watchedValues.batch?.split(" ")[1]
                      );
                      const isFreeBatch =
                        batchNumber >= 28 && batchNumber <= 32;
                      if (isFreeBatch)
                        return "🎉 ₹0 for 1st adult (Batches 28-32)";
                      return "₹300 for 1st adult";
                    })()}
                  </span>
                  <span className="text-sm text-gray-600 block">
                    ₹200 for each additional
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      const current = watchedValues.attendees?.adults || 0;
                      if (current > 0) {
                        setValue("attendees.adults", current - 1);
                      }
                    }}
                    className="w-12 h-12 bg-white border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 flex items-center justify-center shadow-sm active:shadow-none"
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
                        strokeWidth={2.5}
                        d="M20 12H4"
                      />
                    </svg>
                  </motion.button>
                  <div className="min-w-[60px] text-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {watchedValues.attendees?.adults || 0}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      const current = watchedValues.attendees?.adults || 0;
                      setValue("attendees.adults", current + 1);
                    }}
                    className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center shadow-lg active:shadow-md"
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
                        strokeWidth={2.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-bold text-gray-800">👦👧 Children</h5>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    6-17 years
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <span className="text-sm text-gray-600 block">₹150 each</span>
                  <span className="text-sm text-gray-400 block">&nbsp;</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      const current = watchedValues.attendees?.children || 0;
                      if (current > 0) {
                        setValue("attendees.children", current - 1);
                      }
                    }}
                    className="w-12 h-12 bg-white border-2 border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 flex items-center justify-center shadow-sm active:shadow-none"
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
                        strokeWidth={2.5}
                        d="M20 12H4"
                      />
                    </svg>
                  </motion.button>
                  <div className="min-w-[60px] text-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {watchedValues.attendees?.children || 0}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      const current = watchedValues.attendees?.children || 0;
                      setValue("attendees.children", current + 1);
                    }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center shadow-lg active:shadow-md"
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
                        strokeWidth={2.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-bold text-gray-800">👶 Infants</h5>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                    0-5 years
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <span className="text-sm font-bold text-emerald-600 block">
                    🎁 FREE
                  </span>
                  <span className="text-sm text-gray-400 block">&nbsp;</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      const current = watchedValues.attendees?.infants || 0;
                      if (current > 0) {
                        setValue("attendees.infants", current - 1);
                      }
                    }}
                    className="w-12 h-12 bg-white border-2 border-emerald-200 text-emerald-600 rounded-xl hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-200 flex items-center justify-center shadow-sm active:shadow-none"
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
                        strokeWidth={2.5}
                        d="M20 12H4"
                      />
                    </svg>
                  </motion.button>
                  <div className="min-w-[60px] text-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {watchedValues.attendees?.infants || 0}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      const current = watchedValues.attendees?.infants || 0;
                      setValue("attendees.infants", current + 1);
                    }}
                    className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 flex items-center justify-center shadow-lg active:shadow-md"
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
                        strokeWidth={2.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Family Information Section - Only show if total attendees > 1 */}
          <AnimatePresence>
            {(() => {
              const totalAttendees =
                (watchedValues.attendees?.adults || 0) +
                (watchedValues.attendees?.children || 0) +
                (watchedValues.attendees?.infants || 0);

              return totalAttendees > 1 ? (
                <motion.div
                  key="family-info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 sm:p-8 lg:p-10 hover:shadow-orange-200/50 transition-all duration-300"
                >
                  <div className="mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                          <svg
                            className="w-6 h-6 text-white"
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
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            Family Information
                          </h2>
                          <p className="text-sm text-gray-600 mt-1">
                            Add your family members (optional)
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={addGuest}
                        className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200 flex items-center space-x-2 shadow-lg"
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="font-semibold">Add Family Member</span>
                      </motion.button>
                    </div>
                    <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  </div>

                  {guests.length === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-dashed border-orange-200">
                      <svg
                        className="w-16 h-16 mx-auto text-orange-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="text-gray-500 text-base">
                        No family members added yet.
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Click "Add Family Member" to include additional
                        attendees.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {guests.map((guest, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-2xl border-2 border-orange-100 hover:border-orange-300 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </span>
                                Family Member {index + 1}
                              </h4>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => removeGuest(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                              </motion.button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  value={guest.name}
                                  onChange={(e) =>
                                    updateGuest(index, "name", e.target.value)
                                  }
                                  className="w-full px-4 py-2.5 bg-white/70 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder:text-gray-400 group-hover:border-orange-300"
                                  placeholder="Name"
                                />
                              </div>
                              <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Gender
                                </label>
                                <select
                                  value={guest.gender}
                                  onChange={(e) =>
                                    updateGuest(index, "gender", e.target.value)
                                  }
                                  className="w-full px-4 py-2.5 bg-white/70 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 group-hover:border-orange-300"
                                >
                                  <option value="">Select</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Food
                                </label>
                                <select
                                  value={guest.foodChoice}
                                  onChange={(e) =>
                                    updateGuest(
                                      index,
                                      "foodChoice",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-2.5 bg-white/70 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 group-hover:border-orange-300"
                                >
                                  <option value="">Select</option>
                                  <option value="Veg">🥗 Veg</option>
                                  <option value="Non-Veg">🍗 Non-Veg</option>
                                </select>
                              </div>
                              <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Age Category
                                </label>
                                <select
                                  value={guest.ageCategory}
                                  onChange={(e) =>
                                    updateGuest(
                                      index,
                                      "ageCategory",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-2.5 bg-white/70 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 group-hover:border-orange-300"
                                >
                                  <option value="">Select</option>
                                  <option value="Adult">Adult (18+)</option>
                                  <option value="Child">Child (6-17)</option>
                                  <option value="Infant">Infant (0-5)</option>
                                </select>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              ) : null;
            })()}
          </AnimatePresence>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 sm:p-8 lg:p-10 hover:shadow-emerald-200/50 transition-all duration-300"
          >
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Payment Details
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Complete your registration payment
                  </p>
                </div>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
            </div>

            <div className="space-y-6">
              {/* Payment Information */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-100 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-gray-900">
                    💰 Payment Summary
                  </h4>
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-full text-lg">
                    ₹{watchedValues.contributionAmount || 0}
                  </span>
                </div>

                <div className="space-y-4">
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
                        <div className="bg-white/70 rounded-xl p-4 space-y-2">
                          {isFreeBatch ? (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">
                                  👨‍👩‍👧‍👦 Adults (1st) - Batch {batchNumber}
                                </span>
                                <span className="font-bold text-emerald-600">
                                  1 × ₹0 = ₹0
                                </span>
                              </div>
                              {adultCount > 1 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-700">
                                    👥 Additional Adults
                                  </span>
                                  <span className="font-bold text-gray-900">
                                    {adultCount - 1} × ₹200 = ₹
                                    {(adultCount - 1) * 200}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">
                                  👨‍👩‍👧‍👦 Adults (1st)
                                </span>
                                <span className="font-bold text-gray-900">
                                  1 × ₹300 = ₹300
                                </span>
                              </div>
                              {adultCount > 1 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-700">
                                    👥 Additional Adults
                                  </span>
                                  <span className="font-bold text-gray-900">
                                    {adultCount - 1} × ₹200 = ₹
                                    {(adultCount - 1) * 200}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="bg-white/70 rounded-xl p-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">
                              👦👧 Children (6-17 years)
                            </span>
                            <span className="font-bold text-gray-900">
                              {childCount} × ₹150 = ₹{childCount * 150}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">
                              👶 Infants (0-5 years)
                            </span>
                            <span className="font-bold text-emerald-600">
                              {infantCount} × FREE = FREE
                            </span>
                          </div>
                        </div>

                        {isFreeBatch && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-r from-emerald-100 to-green-100 p-4 rounded-xl border-2 border-emerald-200"
                          >
                            <p className="text-sm text-emerald-800 flex items-center font-medium">
                              <svg
                                className="w-5 h-5 mr-2 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              🎉 Free registration for Batches 28-32! Only
                              additional adults pay ₹200 each.
                            </p>
                          </motion.div>
                        )}

                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-5 text-white">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">
                              Total Amount Payable
                            </span>
                            <span className="text-3xl font-extrabold">
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-2xl border-2 border-blue-200">
                <h5 className="font-bold text-blue-900 mb-6 text-center text-xl flex items-center justify-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Bank Details for Payment
                </h5>

                {/* UPI QR Code Image */}
                <div className="mb-6 text-center">
                  <div className="bg-white p-5 rounded-2xl border-2 border-blue-200 inline-block shadow-xl">
                    <img
                      src="/images/upi.jpeg"
                      alt="UPI QR Code for Payment"
                      className="w-56 h-56 mx-auto rounded-xl shadow-lg"
                    />
                  </div>
                  <p className="text-base text-blue-700 mt-3 font-bold flex items-center justify-center gap-2">
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
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    Scan QR Code to Pay
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-blue-100 shadow-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-900">
                    <div className="space-y-3">
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">Bank:</strong>
                        <span>Punjab National Bank</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">
                          Account Holder:
                        </strong>
                        <span>
                          JAWAHAR NAVODAYA VIDYALAYA CALICUT ALUMNI NETWORK
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">UPI ID:</strong>
                        <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                          9496470738m@pnb
                        </span>
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">Account No:</strong>
                        <span className="font-mono">4274000102054962</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">IFSC Code:</strong>
                        <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                          PUNB0427400
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <strong className="min-w-[110px]">Method:</strong>
                        <span>UPI / Bank Transfer</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-900 flex items-start gap-2 font-medium">
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>Important:</strong> Please mention your
                        name/batch number in the payment description for easy
                        verification.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-3">
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
                      className={`w-full px-5 py-4 bg-white/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-base placeholder:text-gray-400 font-mono ${
                        errors.paymentTransactionId
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 group-hover:border-emerald-300"
                      }`}
                      placeholder="Enter transaction ID (e.g., UTR/UPI Reference Number)"
                    />
                  )}
                />
                {errors.paymentTransactionId && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.paymentTransactionId.message}
                  </motion.p>
                )}
                <p className="mt-2 text-sm text-gray-600 flex items-center gap-1">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Enter the transaction ID from your payment confirmation
                  message/email
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="pt-6"
          >
            <motion.button
              whileHover={!isSubmitting && isValid ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting && isValid ? { scale: 0.98 } : {}}
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`group relative w-full py-5 px-6 text-lg font-bold rounded-2xl transition-all duration-300 overflow-hidden ${
                isSubmitting || !isValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white shadow-2xl hover:shadow-emerald-500/50 active:shadow-lg"
              }`}
            >
              {!isSubmitting && isValid && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}

              <div className="relative z-10">
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                    <span>Submitting Your Registration...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Complete Registration for Back to Hills 5.0</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </motion.button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-20 pt-12 border-t-2 border-gradient-to-r from-emerald-200 via-teal-200 to-blue-200"
        >
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              <div className="h-1.5 w-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
              <div className="h-1 w-4 bg-blue-500 rounded-full"></div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-8">
              <p className="text-gray-700 text-lg leading-relaxed italic font-medium">
                "Back to the Hills 5.0 is more than just an alumni reunion -
                it's a celebration of our shared memories, lasting friendships,
                and the spirit of our school community. We can't wait to see you
                there!"
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 text-2xl font-bold">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Welcome Back to the Hills!
              </span>
              <span className="text-3xl animate-bounce">🏔️</span>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>alumni@jnvcalicut.org</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-teal-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+91 94964 70738</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-8">
              © 2025 JNV Calicut Alumni Network. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BackToHillsRegistrationForm;
