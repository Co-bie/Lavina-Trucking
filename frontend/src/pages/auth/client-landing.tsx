import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, MapPin, Calendar, Clock, Package } from "lucide-react";
import UserHeader from "@/components/shared/user-header";
import TripBookingDialog from "@/components/booking/TripBookingDialog";

export default function ClientLanding() {
  const { user } = useAuth();
  const [showBookingDialog, setShowBookingDialog] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UserHeader />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user?.first_name || user?.name}!
            </h1>
          <p className="text-gray-600 text-lg">
            Book your transportation needs with Lavina Trucking - Professional, reliable, and on-time delivery services.
          </p>
        </div>

        {/* Main Booking Card */}
        <Card className="mb-8 border-2 border-[#1e786c] shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#1e786c] to-[#2d8a7a] text-white">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Truck className="h-8 w-8" />
              Book Your Trip
            </CardTitle>
            <p className="text-blue-50">
              Schedule your cargo transportation with our professional team
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Ready to ship your cargo?
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our experienced drivers and well-maintained fleet ensure your goods reach their destination safely and on time. 
                  Get started by providing your trip details and we'll handle the rest.
                </p>
                <Button 
                  onClick={() => setShowBookingDialog(true)}
                  className="bg-[#cfab3d] hover:bg-[#b8961e] text-white px-8 py-3 text-lg font-semibold"
                  size="lg"
                >
                  Book a Trip Now
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-[#1e786c]" />
                  <span>Nationwide coverage</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="h-5 w-5 text-[#1e786c]" />
                  <span>24/7 customer support</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Package className="h-5 w-5 text-[#1e786c]" />
                  <span>Secure cargo handling</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="h-5 w-5 text-[#1e786c]" />
                  <span>Flexible scheduling</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

       

        {/* Quick Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Contact Us</h4>
                <p className="text-gray-600 text-sm">Phone: +63 917-1329-002</p>
                <p className="text-gray-600 text-sm">Email: lilibethlavina2022@gmail.com</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Operating Hours</h4>
                <p className="text-gray-600 text-sm">Monday - Friday: 5:00 AM - 8:00 PM</p>
                <p className="text-gray-600 text-sm">Saturday - Sunday: 6:00 AM - 6:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trip Booking Dialog */}
        <TripBookingDialog 
          open={showBookingDialog} 
          onOpenChange={setShowBookingDialog} 
        />
        </div>
      </main>
    </div>
  );
}