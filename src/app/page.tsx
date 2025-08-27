// app/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<{ src: string; index: number } | null>(null);
  const itemsPerPage = 9; // 3x3 grid per halaman

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("/data/data-ujian.json");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Filter hanya item dengan judul mengandung "jadwal ujian"
        const filtered = data.filter((item: any) => typeof item.judul === "string" && item.judul.toLowerCase().includes("jadwal ujian"));

        // Ekstrak URL gambar dari field detail
        const urls: string[] = [];
        filtered.forEach((item: any) => {
          const regex = /<img[^>]+src="([^">]+)"/g;
          let match;
          while ((match = regex.exec(item.detail)) !== null) {
            urls.push(match[1]);
          }
        });

        setImages(urls);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Hitung total halaman
  const totalPages = Math.ceil(images.length / itemsPerPage);

  // Dapatkan gambar untuk halaman saat ini
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentImages = images.slice(startIndex, startIndex + itemsPerPage);

  // Fungsi untuk membuka modal
  const openImageModal = (src: string, globalIndex: number) => {
    setSelectedImage({ src, index: globalIndex });
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Fungsi navigasi pagination
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate nomor halaman untuk pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Handle ESC key untuk menutup modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  if (loading) {
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
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="max-w-sm sm:max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-red-100">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Gagal Memuat Data</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2m-6 9l-3-3 6-6" />
              </svg>
            </div>
            {/* Caution */}
            <div className="mb-2">
              <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-xl border border-yellow-200 shadow">⚠️ Disarankan menggunakan laptop/PC untuk pengalaman terbaik!</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Kumpulan Jadwal Ujian</h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Menampilkan <span className="font-semibold text-indigo-600">{currentImages.length}</span> dari <span className="font-semibold text-indigo-600">{images.length}</span> jadwal ujian
            </p>
          </div>

          {/* Grid Gambar */}
          {currentImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              {currentImages.map((src, idx) => {
                const globalIndex = startIndex + idx;
                return (
                  <div
                    key={globalIndex}
                    className="group relative bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-1 sm:hover:-translate-y-2"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={src}
                        alt={`Jadwal Ujian ${globalIndex + 1}`}
                        className="w-full h-48 sm:h-64 lg:h-80 object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-700 sm:cursor-pointer select-none"
                        loading="lazy"
                        onClick={(e) => {
                          // Only work on desktop
                          if (window.innerWidth >= 640) {
                            openImageModal(src, globalIndex);
                          }
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='40%25' font-size='16' text-anchor='middle' dy='.3em' fill='%236b7280'%3E📅%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='14' text-anchor='middle' dy='.3em' fill='%236b7280'%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E";
                        }}
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Badge nomor */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold shadow-lg">
                      #{globalIndex + 1}
                    </div>

                    {/* Hover overlay dengan tombol - Desktop only */}
                    <div className="hidden sm:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                      <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openImageModal(src, globalIndex);
                          }}
                          className="bg-white text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base pointer-events-auto"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white relative">
                      <p className="text-sm sm:text-base font-medium text-gray-700">Jadwal Ujian #{globalIndex + 1}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:hidden">Ketuk tombol di bawah untuk melihat detail lengkap</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Klik gambar untuk melihat detail lengkap</p>
                      {/* Mobile view button - Only way to open modal on mobile */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openImageModal(src, globalIndex);
                        }}
                        className="sm:hidden mt-3 w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md active:shadow-lg transform active:scale-95"
                      >
                        📱 Lihat Detail Jadwal
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20 px-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3">Tidak ada jadwal ujian</h3>
              <p className="text-gray-500 text-base sm:text-lg">Data jadwal ujian tidak ditemukan atau belum tersedia.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                {/* Info halaman */}
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    Menampilkan <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(startIndex + itemsPerPage, images.length)}</span> dari{" "}
                    <span className="font-semibold">{images.length}</span> gambar
                  </p>
                  <p className="text-xs text-gray-500">
                    Halaman {currentPage} dari {totalPages}
                  </p>
                </div>

                {/* Navigasi pagination */}
                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                  {/* Tombol Previous */}
                  <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                      currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    }`}
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Sebelumnya</span>
                    <span className="sm:hidden">Prev</span>
                  </button>

                  {/* Nomor halaman - Desktop */}
                  <div className="hidden md:flex space-x-1">
                    {currentPage > 3 && (
                      <>
                        <button
                          onClick={() => goToPage(1)}
                          className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          1
                        </button>
                        {currentPage > 4 && <span className="px-2 py-2 text-gray-400 text-xs sm:text-sm">...</span>}
                      </>
                    )}

                    {getPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                          currentPage === pageNum ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="px-2 py-2 text-gray-400 text-xs sm:text-sm">...</span>}
                        <button
                          onClick={() => goToPage(totalPages)}
                          className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Mobile & Tablet page indicator */}
                  <div className="md:hidden bg-gray-100 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {currentPage} / {totalPages}
                    </span>
                  </div>

                  {/* Tombol Next */}
                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                      currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <span className="sm:hidden">Next</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal untuk gambar detail */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onClick={closeModal}>
          <div className="relative max-w-full max-h-[95vh] sm:max-w-4xl sm:max-h-[90vh] w-full">
            {/* Tombol close */}
            <button onClick={closeModal} className="absolute -top-10 sm:-top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 p-2 sm:p-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header modal */}
            <div className="absolute -top-10 sm:-top-12 left-0 text-white mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Jadwal Ujian #{selectedImage.index + 1}</h3>
            </div>

            {/* Gambar */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] sm:max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex-1 overflow-hidden flex items-center justify-center">
                <img src={selectedImage.src} alt={`Jadwal Ujian ${selectedImage.index + 1}`} className="w-full h-auto max-h-full object-contain" />
              </div>

              {/* Footer modal */}
              <div className="p-3 sm:p-4 bg-gray-50 border-t flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-gray-800 text-sm sm:text-base">Jadwal Ujian #{selectedImage.index + 1}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Klik di luar gambar atau tekan ESC untuk menutup</p>
                  </div>
                  <div className="flex gap-2 justify-center sm:justify-end">
                    <button onClick={() => window.open(selectedImage.src, "_blank")} className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                      Buka di Tab Baru
                    </button>
                    <button onClick={closeModal} className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
