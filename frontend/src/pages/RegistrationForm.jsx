import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Select from "react-select";
import { createRegistration } from "../api/registration.api";

const OnamRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      whatsappNumber: "",
      
      gender: "",
      country: "IN",
      stateUT: "Kerala",
      district: "",
     
      location: "",
      yearOfPassing: "",
      houseColor: "",

      // Alumni Status
      isAlumni: true,
      alumniVerification: false,

      // Event Preferences
      isAttending: true,
      attendees: {
        adults: 0,
        children: 0,
        infants: 0,
      },
      eventParticipation: [],
      participationDetails: "",

      // Onam Specific
      traditionalDress: false,
      culturalProgram: false,
      programType: "",
      flowerArrangement: false,
      pookalamSize: "",

      // Additional Categories
      registrationTypes: [], // Array of selected registration types
   
   
  

      // Financial
      contributionAmount: 0,
      proposedAmount: 0,
      paymentStatus: "pending",
      paymentTransactionId: "",
    },
  });

  const watchedValues = watch();

  // Registration type options for multi-select
  const registrationOptions = [
    {
      value: "attendee",
      label: "🎉 Event Attendee - Join the Onam celebration",
    },
    {
      value: "sponsor",
      label: "🏢 Enterprise Sponsor - Sponsor your enterprise",
    },
    { value: "donor", label: "💝 Program Donor - Donate for Onam program" },
    { value: "volunteer", label: "🤝 Volunteer - Volunteer for the program" },
    {
      value: "passout-student",
      label: "🎓 Passout Student - 2020-2025 passout students",
    },
  ];

  // Calculate payment amount based on attendees and pricing categories
  useEffect(() => {
    if (watchedValues.isAttending && watchedValues.attendees) {
      const attendees = watchedValues.attendees;
      const adultCount = attendees?.adults || 0;
      const childCount = attendees?.children || 0;

      // Check if yearOfPassing is 2020-2025 for special pricing
      const isRecentPassout =
        watchedValues.yearOfPassing &&
        parseInt(watchedValues.yearOfPassing) >= 2020 &&
        parseInt(watchedValues.yearOfPassing) <= 2025;

      let totalExpense = 0;

      if (isRecentPassout) {
        // Only 1 adult gets discounted price, rest pay regular price
        const discountedAdults = Math.min(adultCount, 1);
        const regularAdults = Math.max(adultCount - 1, 0);
        totalExpense = discountedAdults * 400 + regularAdults * 750;
      } else {
        // Regular pricing
        totalExpense = adultCount * 750;
      }

      // Add children and infants pricing
      totalExpense += childCount * 400; // 6-17 years
      // Infants (5 and below) are free

      setValue("proposedAmount", totalExpense);
      setValue("contributionAmount", totalExpense);
    }
  }, [
    watchedValues.isAttending,
    watchedValues.attendees,
    watchedValues.attendees?.adults,
    watchedValues.attendees?.children,
    watchedValues.attendees?.infants,
    watchedValues.yearOfPassing,
    setValue,
  ]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Prepare data for API
      const registrationData = {
        ...data,
        // Ensure proper data types
        yearOfPassing: data.yearOfPassing
          ? parseInt(data.yearOfPassing)
          : undefined,
        contributionAmount: parseInt(data.contributionAmount) || 0,
        proposedAmount: parseInt(data.proposedAmount) || 0,
        attendees: {
          adults: parseInt(data.attendees?.adults) || 0,
          children: parseInt(data.attendees?.children) || 0,
          infants: parseInt(data.attendees?.infants) || 0,
        },
        // Ensure arrays are properly formatted
        registrationTypes: Array.isArray(data.registrationTypes)
          ? data.registrationTypes
          : [],
        eventParticipation: Array.isArray(data.eventParticipation)
          ? data.eventParticipation
          : [],
      };

      const response = await createRegistration(registrationData);

      const result = await response;

      if (response.success === true) {
        toast.success(
          `🎉 Onavesham 2.0 Registration Successful! Registration ID: ${result.data.registrationId}`
        );
        reset();
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
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
    "Mahe",
    "Lakshadweep",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      {/* Professional Header */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8">
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
                alt="Onavesham 2.0 - Onam Celebration 2025"
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Professional Title */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Onavesham 2.0
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 font-light">
              UNMA - Banglore Chapter Registration
            </p>
            <p className="text-xl text-gray-600 font-light">
              Date: 12th October 2025, Sunday
            </p>
            <p className="text-xl text-gray-600 font-light">
              Pookkala Malsaram among houses: 6:30 AM - 9:30 AM
            </p>
            <p className="text-xl text-gray-600 font-light">
              Main Program: 10:00 AM - 5:00 PM
            </p>
            <p className="text-xl text-gray-600 font-light">
              Location: Ecumenical Christian Center Whitefield, Bangalore
            </p>
          </div>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Hey Navodayans in Bengaluru! Our Onaghosham is around the corner and
            we're getting the whole gang together—friends from 16 JNVs! Let's
            relive those seven golden years of hostel banter, house spirit,
            morning PT, shared plates, and endless laughs. Come hang out, swap
            stories, bring your families, show the kids our crazy JNV energy,
            and enjoy a Sadhya that tastes like pure nostalgia. Bring old
            photos, wear your smiles, and let's turn Bengaluru into our Navodaya
            campus for a day—warm, welcoming, and forever family. See you there!
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
                      className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-base ${
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
                      className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-base ${
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
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="whatsappNumber"
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
                      className={`w-full px-3 sm:px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-base ${
                        errors.whatsappNumber
                          ? "border-red-300"
                          : "border-green-200"
                      }`}
                      placeholder="Enter your 10-digit mobile number"
                    />
                  )}
                />
                {errors.whatsappNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.whatsappNumber.message}
                  </p>
                )}
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
                      className={`w-full px-3 sm:px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-base ${
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
                      className={`w-full px-3 sm:px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-base ${
                        errors.stateUT ? "border-red-300" : "border-green-200"
                      }`}
                    >
                      <option value="">Select state/UT</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Lakshadweep">Lakshadweep</option>
                      <option value="Mahe">Mahe</option>
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
                    JNV District <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="district"
                    control={control}
                    rules={{ required: "District is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full px-3 sm:px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-base ${
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  House Color for Pookkalam{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="houseColor"
                  control={control}
                  rules={{ required: "House color is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 sm:px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-base ${
                        errors.houseColor
                          ? "border-red-300"
                          : "border-green-200"
                      }`}
                    >
                      <option value="">Select house color</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="yellow">Yellow</option>
                      <option value="orange">Orange</option>
                      <option value="purple">Purple</option>
                      <option value="pink">Pink</option>
                      <option value="not-sure">Not sure</option>
                    </select>
                  )}
                />
                {errors.houseColor && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.houseColor.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location they are coming from
                </label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 sm:px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-base"
                      placeholder="Enter your location"
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year of Passing
                </label>
                <Controller
                  name="yearOfPassing"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 sm:px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-base"
                    >
                      <option value="">Select year of passing</option>

                      {Array.from({ length: 2026 - 1993 }, (_, i) => {
                        const year = 1993 + i;
                        return (
                          <option value={year.toString()}>
                            {year.toString()}
                          </option>
                        );
                      })}
                    </select>
                  )}
                />
              </div>
            </div>

            {/* Email Verification */}
          </motion.div>

          {/* Registration Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Registration Category
                </h2>
              </div>
              <div className="w-16 h-0.5 bg-blue-500"></div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Registration Categories{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="registrationTypes"
                  control={control}
                  rules={{
                    required:
                      "Please select at least one registration category",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={registrationOptions}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select one or more categories..."
                      value={registrationOptions.filter((option) =>
                        field.value?.includes(option.value)
                      )}
                      onChange={(selectedOptions) => {
                        const values = selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : [];
                        field.onChange(values);
                      }}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: errors.registrationTypes
                            ? "#ef4444"
                            : state.isFocused
                            ? "#3b82f6"
                            : "#d1d5db",
                          boxShadow: state.isFocused
                            ? "0 0 0 1px #3b82f6"
                            : "none",
                          "&:hover": {
                            borderColor: errors.registrationTypes
                              ? "#ef4444"
                              : "#3b82f6",
                          },
                        }),
                        multiValue: (base) => ({
                          ...base,
                          backgroundColor: "#dbeafe",
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: "#1e40af",
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          color: "#1e40af",
                          "&:hover": {
                            backgroundColor: "#93c5fd",
                            color: "#1e40af",
                          },
                        }),
                      }}
                    />
                  )}
                />
                {errors.registrationTypes && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.registrationTypes.message}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-600">
                  Select multiple categories by clicking on them. Event
                  organizers will contact you directly for verification.
                </p>
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
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Number of Attendees
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">
                          Adults (18+ years)
                          <span className="text-sm text-gray-500 block">
                            {(() => {
                              const isRecentPassout =
                                watchedValues.yearOfPassing &&
                                parseInt(watchedValues.yearOfPassing) >= 2020 &&
                                parseInt(watchedValues.yearOfPassing) <= 2025;

                              if (isRecentPassout)
                                return "₹400 each (2020-2025 passout)";
                              return "₹750 each";
                            })()}
                          </span>
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
                          Children (6-17 years)
                          <span className="text-sm text-gray-500 block">
                            ₹400 each
                          </span>
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

                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">
                          Infants (5 years & below)
                          <span className="text-sm text-green-600 block">
                            FREE
                          </span>
                        </h5>
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const current =
                                    watchedValues.attendees?.infants || 0;
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
                                  const current =
                                    watchedValues.attendees?.infants || 0;
                                  setValue("attendees.infants", current + 1);
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 sm:p-6 lg:p-8"
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
              {/* Check if volunteer registration */}

              <>
                {/* Payment Information */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Information
                  </h4>
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-4 text-center">
                      Bank Details for Payment
                    </h5>

                    {/* Mobile-first responsive layout */}
                    <div className="space-y-4">
                      {/* Bank Details */}
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <h6 className="font-semibold text-blue-800 mb-3 text-sm">
                          Bank Account Details:
                        </h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-800">
                          <div className="space-y-2">
                            <p>
                              <strong>Account Holder:</strong> ANU M B
                            </p>
                            <p>
                              <strong>Account Number:</strong> 002001544868
                            </p>
                            <p>
                              <strong>IFSC Code:</strong> ICIC0000020
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p>
                              <strong>Branch:</strong> MUMBAI POWAI
                            </p>
                            <p>
                              <strong>Account Type:</strong> SAVING
                            </p>
                            <p>
                              <strong>UPI ID:</strong> anumbhaskaran@okicici
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* UPI QR Code */}
                      <div className="bg-white p-4 rounded-lg border border-blue-100 text-center">
                        <h6 className="font-semibold text-blue-800 mb-3 text-sm">
                          Scan QR Code for UPI Payment:
                        </h6>
                        <div className="flex justify-center">
                          <img
                            src="/images/upi.jpeg"
                            alt="UPI QR Code"
                            className="max-w-48 h-auto rounded-lg shadow-sm border border-gray-200"
                          />
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          Scan with any UPI app to pay instantly
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700">
                    {/* Check if person is alumni or recent passout */}
                    {(() => {
                      const isRecentPassout =
                        watchedValues.yearOfPassing &&
                        parseInt(watchedValues.yearOfPassing) >= 2020 &&
                        parseInt(watchedValues.yearOfPassing) <= 2025;

                      const adultCount = watchedValues.attendees?.adults || 0;
                      const childCount = watchedValues.attendees?.children || 0;
                      const infantCount = watchedValues.attendees?.infants || 0;

                      let adultLabel = "₹750 each";
                      let discountedAdultCount = 0;
                      let regularAdultCount = adultCount;

                      if (isRecentPassout) {
                        // Only 1 adult gets discounted price, rest pay regular price
                        discountedAdultCount = Math.min(adultCount, 1);
                        regularAdultCount = Math.max(adultCount - 1, 0);
                        adultLabel =
                          "₹400 each (1 adult - 2020-2025 passout) + ₹750 each (others)";
                      }

                      return (
                        <>
                          {/* Adults breakdown */}
                          {isRecentPassout ? (
                            <>
                              {discountedAdultCount > 0 && (
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                                  <span className="text-sm sm:text-base">
                                    Adults (18+ years) - 2020-2025 passout (1
                                    adult):
                                  </span>
                                  <span className="font-medium text-sm sm:text-base">
                                    {discountedAdultCount} × ₹400 = ₹
                                    {discountedAdultCount * 400}
                                  </span>
                                </div>
                              )}
                              {regularAdultCount > 0 && (
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                                  <span className="text-sm sm:text-base">
                                    Adults (18+ years) - Regular price:
                                  </span>
                                  <span className="font-medium text-sm sm:text-base">
                                    {regularAdultCount} × ₹750 = ₹
                                    {regularAdultCount * 750}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm sm:text-base">
                                Adults (18+ years) - {adultLabel}:
                              </span>
                              <span className="font-medium text-sm sm:text-base">
                                {adultCount} × ₹750 = ₹{adultCount * 750}
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <span className="text-sm sm:text-base">
                              Children (6-17 years) - ₹400 each:
                            </span>
                            <span className="font-medium text-sm sm:text-base">
                              {childCount} × ₹400 = ₹{childCount * 400}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <span className="text-sm sm:text-base">
                              Infants (5 years & below) - FREE:
                            </span>
                            <span className="font-medium text-sm sm:text-base">
                              {infantCount} × FREE = FREE
                            </span>
                          </div>
                          {isRecentPassout && (
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
                                {isRecentPassout
                                  ? "Recent passout discount applied! 1 adult pays ₹400, others pay ₹750."
                                  : ""}
                              </p>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 font-bold text-lg">
                        <span>Total Amount:</span>
                        <span className="text-teal-600 text-xl">
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
                        min={0}
                        value={field.value || watchedValues.proposedAmount || 0}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-base ${
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
                    <span className="font-semibold text-teal-600">
                      Total Amount: ₹{watchedValues.proposedAmount || 0}
                    </span>
                    <span className="block mt-1 text-xs text-gray-500">
                      (You can modify this amount if needed)
                    </span>
                  </p>
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
                        className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-base ${
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
                  </ul>
                </div>
              </>
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
              disabled={isSubmitting || !isValid}
              className={`w-full py-4 px-4 sm:px-6 text-base sm:text-lg font-semibold rounded-lg transition-all duration-200 touch-manipulation ${
                isSubmitting || !isValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl active:bg-emerald-800"
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
                  <span>Complete Onavesham 2.0 Registration</span>
                </div>
              )}
            </button>
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
            "Onavesham 2.0 is not just a festival, it's a celebration of unity,
            prosperity, and the spirit of giving. We look forward to celebrating
            this joyous occasion with you."
          </p>
          <p className="text-emerald-600 font-medium mt-4">
            Happy Onavesham 2.0! 🎉
          </p>

          {/* Created by xyvin footer */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-gray-500 text-xs">
              Created by{" "}
              <a
                href="https://xyvin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                xyvin
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnamRegistrationForm;
