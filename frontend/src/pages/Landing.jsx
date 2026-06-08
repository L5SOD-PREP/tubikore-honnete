import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">PMS System</h1>
            <p className="text-xs text-gray-300">SwiftWheels Enterprises</p>
          </div>
          <Link
            to="/login"
            className="px-5 py-2 bg-white text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 py-16 lg:py-24">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/30 rounded-full text-xs font-medium text-gray-200 mb-6">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                Vehicle Promotion Management System
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Promotion & Marketing<br />
                <span className="text-gray-300">Subsystem</span>
              </h2>
              <p className="text-lg text-gray-200 mb-8 max-w-lg mx-auto lg:mx-0">
                Streamline your vehicle promotions, manage customers, track campaigns, 
                and boost sales — all in one powerful platform.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-3 mb-8 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-2 text-sm text-gray-200">
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Vehicle Management
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-200">
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Customer Records
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-200">
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Promotion Campaigns
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-200">
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Performance Reports
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/login"
                  className="px-8 py-3 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg shadow-black/20 text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-gray-800/50 text-white font-medium rounded-xl border border-gray-700/30 hover:bg-gray-700/50 transition-all duration-200 text-center"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="flex-1 w-full max-w-lg">
              <div className="bg-gray-950/40 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/30">
                {/* Stats Preview */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-950/60 rounded-xl p-4 border border-gray-800/30">
                    <p className="text-xs text-gray-300 mb-1">Vehicles</p>
                    <p className="text-2xl font-bold text-white">10+</p>
                  </div>
                  <div className="bg-gray-950/60 rounded-xl p-4 border border-gray-800/30">
                    <p className="text-xs text-gray-300 mb-1">Customers</p>
                    <p className="text-2xl font-bold text-white">50+</p>
                  </div>
                  <div className="bg-gray-950/60 rounded-xl p-4 border border-gray-800/30">
                    <p className="text-xs text-gray-300 mb-1">Promotions</p>
                    <p className="text-2xl font-bold text-white">8+</p>
                  </div>
                  <div className="bg-gray-950/60 rounded-xl p-4 border border-gray-800/30">
                    <p className="text-xs text-gray-300 mb-1">Assignments</p>
                    <p className="text-2xl font-bold text-white">12+</p>
                  </div>
                </div>
                <div className="bg-gray-950/60 rounded-xl p-4 border border-gray-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-gray-200">Recent Activity</p>
                    <span className="text-xs text-gray-400">Today</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <p className="text-xs text-gray-200">New promotion added</p>
                      </div>
                      <span className="text-xs text-gray-400">2m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        <p className="text-xs text-gray-200">Customer updated</p>
                      </div>
                      <span className="text-xs text-gray-400">15m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                        <p className="text-xs text-gray-200">Vehicle assigned</p>
                      </div>
                      <span className="text-xs text-gray-400">1h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800/30 mt-16">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} SwiftWheels Enterprises — Promotion & Marketing Subsystem
          </div>
        </div>
      </main>
    </div>
  );
}
