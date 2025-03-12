import React from "react";

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to App Tracker</h1>
        <p className="text-gray-600 mt-2">Manage your projects with ease.</p>
        <div className="mt-6">
          <a
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
