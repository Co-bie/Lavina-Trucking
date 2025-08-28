import { Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-black text-white py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#1e786c] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,#cfab3d_0%,transparent_70%)]" />

      <div className="relative z-10 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
          <div className="text-center md:text-left space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center md:justify-start space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <img
                src="/logo.jpg"
                alt="Nony Lavina Trucking Services"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#1e786c] to-[#cfab3d] flex items-center justify-center"
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-gradient-to-r from-[#cfab3d] to-white bg-clip-text">
              Trucking Services
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              Delivering excellence, one mile at a time.
            </p>
          </div>

          <div className="text-center space-y-2 sm:space-y-3">
            <h4 className="text-base sm:text-lg font-bold text-[#cfab3d] mb-3 sm:mb-4">
              Contact Info
            </h4>
            <p className="text-sm sm:text-base text-gray-300">
              Valencia City, <span className="font-semibold">Bukidnon</span>
            </p>
            <p className="text-sm sm:text-base text-gray-300">
              G. Lavina Ave, P-5 Poblacion
            </p>
            <p className="text-sm sm:text-base text-gray-300">
              Phone: +63 917-1329-002
            </p>
            <p className="text-sm sm:text-base text-gray-300">
              Email: lilibethlavina2022@gmail.com
            </p>
          </div>

          <div className="text-center md:text-right">
            <h4 className="text-base sm:text-lg font-bold text-[#cfab3d] mb-4 sm:mb-6">
              Follow Us
            </h4>
            <div className="flex justify-center md:justify-end space-x-4 sm:space-x-6">
              {[{ icon: Facebook, label: "Facebook" }].map((social, i) => (
                <a
                  key={i}
                  href="https://www.facebook.com/profile.php?id=61556519280448"
                  target="_blank"
                  rel="noopener"
                  className="group relative p-2 sm:p-3 rounded-full bg-gradient-to-br from-[#1e786c] to-[#cfab3d] border border-[#cfab3d] hover:scale-110 hover:shadow-[0_0_15px_#cfab3d] transition-all duration-500"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#cfab3d] group-hover:scale-125 transition-all duration-300" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#cfab3d] pt-6 sm:pt-8 text-center">
          <p className="text-sm sm:text-base text-gray-400">
            &copy; {new Date().getFullYear()} Nony Lavina Trucking Services. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
