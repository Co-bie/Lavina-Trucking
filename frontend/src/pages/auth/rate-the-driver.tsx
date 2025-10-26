"use client";

import { useState } from "react";
import AuthLayout from "@/components/shared/auth-layout";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type DriverProfileProps = {
  params: { id: string };
};

export default function RateTheDriver({ params }: DriverProfileProps) {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    toast.success(
      `Thank you! You rated ${rating} star${rating > 1 ? "s" : ""}.`
    );

    console.log({ driverId: params.id, rating, feedback });
    setRating(0);
    setFeedback("");
  };

  return (
    <AuthLayout sidebarHidden>
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Rate Your Driver
          </h1>
          <p className="text-gray-500 mb-6 text-sm">
            Share your experience with Driver #{params.id}
          </p>

          {/* ⭐ Star Rating */}
          <div className="flex justify-center mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-transform ${
                  (hovered ?? rating) >= star
                    ? "fill-yellow-400 text-yellow-400 scale-110"
                    : "text-gray-300"
                }`}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          {/* 💬 Feedback */}
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback (optional)"
            className="mb-6 resize-none"
          />

          {/* 📤 Submit */}
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={handleSubmit}
          >
            <Send className="w-4 h-4" />
            Submit Rating
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
