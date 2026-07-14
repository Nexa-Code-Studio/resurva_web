<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## graphify

This project has a knowledge graph at graphify-out/. The graph auto-updates on commit.

PENTING: Hanya gunakan graphify secara eksplisit jika pengguna mengetik perintah `/graphify` atau memintanya secara langsung. Jangan jalankan perintah `graphify` atau membaca berkas `graphify-out/` secara otomatis di awal sesi atau saat melakukan kueri pencarian kode biasa.

Aturan saat menggunakan graphify secara eksplisit:
- Untuk kueri graph, gunakan `graphify query "<question>"`.
- Untuk mencari hubungan antar file, gunakan `graphify path "<A>" "<B>"`.
- Untuk memperbarui graf setelah modifikasi kode, jalankan `graphify update .`.
- Jangan membaca `GRAPH_REPORT.md` kecuali untuk tinjauan arsitektur secara manual atas instruksi pengguna.
