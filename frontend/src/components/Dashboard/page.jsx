"use client";
import React from "react";

function MainComponent() {
  const [user] = useState({
    name: "John Doe",
    recentDares: [
      { id: 1, title: "Ice Bucket Challenge", status: "Completed" },
      { id: 2, title: "Dance in Public", status: "Pending" },
      { id: 3, title: "Karaoke Night", status: "In Progress" },
    ],
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-purple-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-roboto">DareApp</h1>
          <div className="flex gap-4">
            <i className="fas fa-bell text-xl cursor-pointer hover:text-purple-200"></i>
            <i className="fas fa-user-circle text-xl cursor-pointer hover:text-purple-200"></i>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 font-roboto">
            Welcome back, {user.name}! 👋
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-purple-600 transition-colors">
            <i className="fas fa-plus-circle text-2xl mb-2"></i>
            <h3 className="font-bold">Create Dare</h3>
          </div>
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition-colors">
            <i className="fas fa-list text-2xl mb-2"></i>
            <h3 className="font-bold">View Dares</h3>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-green-600 transition-colors">
            <i className="fas fa-user text-2xl mb-2"></i>
            <h3 className="font-bold">Profile</h3>
          </div>
          <div className="bg-gray-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-600 transition-colors">
            <i className="fas fa-cog text-2xl mb-2"></i>
            <h3 className="font-bold">Settings</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 font-roboto">
            Recent Activities
          </h3>
          <div className="space-y-4">
            {user.recentDares.map((dare) => (
              <div
                key={dare.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <h4 className="font-semibold">{dare.title}</h4>
                  <span
                    className={`text-sm ${
                      dare.status === "Completed"
                        ? "text-green-500"
                        : dare.status === "Pending"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  >
                    {dare.status}
                  </span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;