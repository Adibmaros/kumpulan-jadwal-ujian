"use client";

import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";

export default function ExtractJudulPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [extracting, setExtracting] = useState<boolean>(false);
  const [results, setResults] = useState<{ index: number; src: string; judul: string[] }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("/data/data-ujian.json");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const urls: string[] = [];
        data.forEach((item: any) => {
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

  // Fungsi ekstraksi judul tabel dari semua gambar
  const extractAllJudul = async () => {
    setExtracting(true);
    setResults([]);
    setError(null);
    try {
      const worker = await createWorker("ind");
      const tempResults: { index: number; src: string; judul: string[] }[] = [];
      for (let i = 0; i < images.length; i++) {
        const imgUrl = images[i];
        const { data } = await worker.recognize(imgUrl);
        // Ambil baris pertama yang panjang (header tabel), misal baris dengan banyak kata/kolom
        const lines = data.text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        // Asumsi: header tabel adalah baris pertama yang mengandung beberapa kata/kolom
        let headerLines: string[] = [];
        for (const line of lines) {
          // Jika baris mengandung lebih dari 2 kata, anggap sebagai header
          if (line.split(/\s+/).length > 2) headerLines.push(line);
          // Stop jika sudah dapat 1-2 baris header
          if (headerLines.length >= 2) break;
        }
        tempResults.push({ index: i + 1, src: imgUrl, judul: headerLines });
      }
      await worker.terminate();
      setResults(tempResults);
    } catch (err) {
      setError("Gagal ekstrak judul tabel");
    } finally {
      setExtracting(false);
    }
  };

  // Fungsi download hasil sebagai data.json
  const downloadJson = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">Ekstraksi Judul Tabel Jadwal Ujian (OCR)</h1>
        {loading ? (
          <div className="text-center py-12">Memuat data gambar...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : (
          <>
            <button onClick={extractAllJudul} disabled={extracting || images.length === 0} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium mb-6">
              {extracting ? "Memproses OCR..." : "Ekstrak Judul Semua Gambar"}
            </button>
            {results.length > 0 && (
              <button onClick={downloadJson} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium ml-4">
                Download data.json
              </button>
            )}
            <div className="mt-8">
              {results.length > 0 ? (
                <div className="space-y-8">
                  {results.map((res) => (
                    <div key={res.index} className="bg-white rounded-xl shadow p-4">
                      <div className="mb-2 font-semibold text-indigo-600">Gambar #{res.index}</div>
                      <img src={res.src} alt={`Gambar ${res.index}`} className="w-full max-w-md mb-2 rounded" />
                      <div className="text-sm text-gray-800">
                        <div className="font-bold mb-1">Judul Tabel (OCR):</div>
                        <ul className="list-disc pl-5">{res.judul.length > 0 ? res.judul.map((j, idx) => <li key={idx}>{j}</li>) : <li className="text-red-500">Judul tidak ditemukan</li>}</ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : extracting ? (
                <div className="text-center py-12">Memproses OCR pada semua gambar...</div>
              ) : (
                <div className="text-center py-12 text-gray-500">Belum ada hasil ekstraksi.</div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
