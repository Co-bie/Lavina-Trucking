import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft,
  Star,
  Truck,
  Calendar,
  MapPin,
  Award,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import { mockDrivers } from "@/constants/mock-data";
type DriverProfileProps = {
  params: { id: string };
};

export default function DriverProfile({ params }: DriverProfileProps) {
  const driverId = params.id;
  const driver = mockDrivers.find((d) => d.id === driverId);

  if (!driver) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-[#1e786c] to-[#1e786c]/90 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md w-full">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl mb-4"
          >
            😢
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Driver Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The driver with ID "{driverId}" does not exist.
          </p>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1e786c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e786c]/90 transition-colors"
            >
              ← Back to Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header
        className="bg-[#1e786c] text-white py-8 px-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto">
          <Link href="/">
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center text-white/90 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Drivers
            </motion.button>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.img
              src={driver.profile_image || "/default-driver.jpg"}
              alt={driver.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 shadow-2xl object-cover"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            />

            <div className="text-center md:text-left">
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-2"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {driver.name}
              </motion.h1>

              <motion.p
                className="text-white/90 mb-4 text-lg"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Professional {driver.vehicle.vehicle_type} Driver
              </motion.p>

              <motion.div
                className="flex flex-wrap items-center justify-center md:justify-start gap-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span
                  className={`status-badge ${driver.current_status} ${
                    driver.isOnline ? "online" : ""
                  }`}
                >
                  {driver.current_status?.replace("_", " ").toUpperCase()}
                  {driver.isOnline && <span className="online-dot"></span>}
                </span>

                <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                  <Star
                    size={16}
                    className="text-[#cfab3d] mr-1 fill-current"
                  />
                  <span className="font-semibold">
                    {driver.ratings.overall}
                  </span>
                  <span className="text-white/80 ml-1">
                    ({driver.ratings.total_reviews})
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto p-4 -mt-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {[
            {
              icon: <Truck size={24} />,
              value: driver.stats.total_shipments,
              label: "Deliveries",
            },
            {
              icon: <Star size={24} className="text-[#cfab3d] fill-current" />,
              value: driver.ratings.overall,
              label: "Rating",
            },
            {
              icon: <Calendar size={24} />,
              value: driver.years_experience,
              label: "Years Exp",
            },
            {
              icon: <CheckCircle size={24} />,
              value: `${Math.round(
                (driver.stats.on_time_deliveries /
                  driver.stats.total_shipments) *
                  100
              )}%`,
              label: "On Time",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-200"
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="text-[#1e786c] mb-2 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <motion.section
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Truck size={20} className="text-[#1e786c] mr-2" />
                Vehicle Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Make/Model:</span>
                  <span className="font-semibold">
                    {driver.vehicle.make} {driver.vehicle.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-semibold">{driver.vehicle.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">License Plate:</span>
                  <span className="font-semibold text-[#1e786c]">
                    {driver.vehicle.license_plate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold">
                    {driver.vehicle.vehicle_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-semibold">
                    {driver.vehicle.capacity.weight.toLocaleString()} lbs
                  </span>
                </div>
              </div>
            </motion.section>

            <motion.section
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <MapPin size={20} className="text-[#1e786c] mr-2" />
                Service Area
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Current Location:</span>
                  <p className="font-semibold">
                    {driver.location.city}, {driver.location.state}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Service Areas:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {driver.service_areas.map((area, index) => (
                      <span
                        key={index}
                        className="bg-[#1e786c] text-white px-3 py-1 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          <div className="space-y-6">
            <motion.section
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Award size={20} className="text-[#cfab3d] mr-2" />
                Specializations
              </h2>
              <div className="flex flex-wrap gap-2">
                {driver.specializations.map((spec, index) => (
                  <motion.span
                    key={index}
                    className="bg-[#cfab3d] text-white px-4 py-2 rounded-full text-sm font-semibold"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    {spec}
                  </motion.span>
                ))}
              </div>
            </motion.section>

            <motion.section
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield size={20} className="text-[#1e786c] mr-2" />
                Performance
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Success Rate",
                    value: `${Math.round(
                      (driver.stats.successful_deliveries /
                        driver.stats.total_shipments) *
                        100
                    )}%`,
                    color: "bg-[#1e786c]",
                  },
                  {
                    label: "Miles Driven",
                    value: driver.stats.miles_driven.toLocaleString(),
                    color: "bg-[#cfab3d]",
                  },
                  {
                    label: "Avg Delivery Time",
                    value: `${driver.stats.average_delivery_time}h`,
                    color: "bg-[#1e786c]",
                  },
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">{stat.label}</span>
                      <span className="font-semibold">{stat.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${stat.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.9 + index * 0.1, duration: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Clock size={20} className="text-[#1e786c] mr-2" />
                Availability
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-semibold ${
                      driver.isAvailable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {driver.isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
                {driver.availability_schedule && (
                  <div>
                    <span className="text-gray-600">Schedule:</span>
                    <p className="font-semibold">
                      {driver.availability_schedule.days_available.join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {driver.availability_schedule.hours_available.start} -{" "}
                      {driver.availability_schedule.hours_available.end}
                    </p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
