import React from "react";

const Loading = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 bg-white rounded-full shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Memuat Jadwal Ujian</h2>
          <p className="text-sm sm:text-base text-gray-500">Mohon tunggu sebentar...</p>
        </div>
      </div>
    </main>
  );
};

export default Loading;
