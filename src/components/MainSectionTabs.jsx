// MainSectionTabs.jsx
import React from "react";

const stats = [
  { id: 1, label: "Total Services", value: 1245 },
  { id: 2, label: "Active Technicians", value: 58 },
  { id: 3, label: "Completed Jobs", value: 1120 },
];

const reviews = [
  { id: 1, name: "Rahim Uddin", rating: 5, comment: "Excellent service, fast and professional!" },
  { id: 2, name: "Sadia Khan", rating: 4, comment: "Quick response and friendly technician." },
  { id: 3, name: "Imran Hossain", rating: 5, comment: "Highly skilled technician, fixed my AC in no time." },
];

export default function MainSectionTabs() {
  return (
    <div className="bg-sky-50"> {/* Full width background */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-6">
            Our Service Stats & Reviews
          </h2>
          <p className="text-center text-slate-600 mb-12">
            Join thousands of satisfied users and experienced technicians.
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center mb-16">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white p-6 rounded-xl shadow-sm border-2 border-slate-300 hover:shadow-md transition">
                <p className="text-4xl font-extrabold text-sky-600 mb-2">
                  {stat.value}+
                </p>
                <p className="text-slate-700 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Reviews Section */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-slate-900 mb-8 text-center">User Reviews</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border-2 border-slate-300 hover:shadow-md transition">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
                      {review.name[0]}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-slate-900">{review.name}</p>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-2">{review.comment}</p>
                  <p className="text-yellow-500 font-semibold">{"⭐".repeat(review.rating)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
