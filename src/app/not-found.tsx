export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6">
          <span className="text-3xl">😕</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-6">Maaf, halaman yang Anda cari tidak tersedia.</p>
        <a href="/" className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg">
          Kembali ke Beranda
        </a>
      </div>
    </main>
  );
}
