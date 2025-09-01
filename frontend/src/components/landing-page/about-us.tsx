import { Calendar, MapPin, Target } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,#1e786c/15_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#cfab3d/15_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,#1e786c/5_50%,transparent_100%)]" />

      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#cfab3d]/10 to-transparent rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-[#1e786c]/10 to-transparent rounded-full blur-3xl animate-pulse animation-delay-300" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-[#1e786c]/20 to-[#cfab3d]/20 backdrop-blur-md border border-white/10">
            <Calendar className="w-5 h-5 text-[#cfab3d]" />
            <span className="text-sm font-semibold text-white/80">
              Est. 1974
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-8">
            <span className="text-transparent bg-gradient-to-r from-[#cfab3d] via-white to-[#1e786c] bg-clip-text hover:scale-105 transition-transform duration-500 inline-block">
              Our Story
            </span>
          </h2>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent to-[#cfab3d] rounded-full" />
            <div className="w-3 h-3 bg-[#cfab3d] rounded-full animate-pulse" />
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#1e786c] to-transparent rounded-full" />
          </div>

          <div className="inline-flex items-center gap-2 text-[#cfab3d] font-semibold">
            <MapPin className="w-4 h-4" />
            <span>Valencia City, Bukidnon</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-6">
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 hover:border-[#cfab3d]/30 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e786c]/5 to-[#cfab3d]/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-500" />
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed relative z-10">
                  Founded in{" "}
                  <span className="text-[#cfab3d] font-bold text-xl">1974</span>{" "}
                  in{" "}
                  <span className="text-[#1e786c] font-bold">
                    Valencia City, Bukidnon
                  </span>
                  , our story began when{" "}
                  <span className="text-white font-semibold">
                    Rolando and Virgie Laviña
                  </span>{" "}
                  set out to support local businesses with just{" "}
                  <span className="text-[#cfab3d] font-bold">
                    a single truck
                  </span>
                  . We started by transporting{" "}
                  <span className="text-[#1e786c] font-semibold">
                    agricultural products
                  </span>
                  , earning a reputation for{" "}
                  <span className="text-white font-bold">
                    dependable and timely service
                  </span>
                  .
                </p>
              </div>

              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 hover:border-[#1e786c]/30 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#cfab3d]/5 to-[#1e786c]/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-500" />
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed relative z-10">
                  Over the years, we{" "}
                  <span className="text-[#cfab3d] font-bold">
                    expanded our fleet
                  </span>{" "}
                  and adapted to meet the growing and varied needs of our
                  clients. Today, we are{" "}
                  <span className="text-white font-bold">
                    more than just a transportation provider
                  </span>{" "}
                  — we are a{" "}
                  <span className="text-[#1e786c] font-bold">
                    trusted partner in local logistics
                  </span>
                  , known for our commitment to{" "}
                  <span className="text-[#cfab3d] font-semibold">
                    service, integrity, and community
                  </span>
                  .
                </p>
              </div>

              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1e786c]/10 to-[#cfab3d]/10 backdrop-blur-md border-2 border-[#cfab3d]/20 hover:border-[#cfab3d]/40 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#cfab3d]/10 to-[#1e786c]/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-500" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#cfab3d] to-[#1e786c] flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[#cfab3d] font-bold text-lg mb-2">
                      Our Mission
                    </h3>
                    <p className="text-white font-medium leading-relaxed">
                      To move with{" "}
                      <span className="text-[#cfab3d] font-bold">
                        reliability
                      </span>
                      , <span className="text-[#1e786c] font-bold">care</span>,
                      and{" "}
                      <span className="text-[#cfab3d] font-bold">
                        dedication
                      </span>{" "}
                      — whether delivering goods across town or supporting
                      large-scale operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute w-full h-full rounded-3xl">
              <img src="/about.jpg" alt="" className="size-full object-cover" />
            </div>
            <div className="relative flex flex-col items-center justify-center h-96 bg-gradient-to-br from-[#1e786c]/10 to-[#cfab3d]/10 rounded-3xl shadow-xl z-50 ">
              <div className="text-7xl font-extrabold animate-pulse">50+</div>
              <div className="text-2xl font-semibold text-white mt-2">
                Years of Service
              </div>
              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#cfab3d] to-[#1e786c] text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                Since 1974
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .animation-delay-300 {
            animation-delay: 0.3s;
          }
        `}
      </style>
    </section>
  );
}
