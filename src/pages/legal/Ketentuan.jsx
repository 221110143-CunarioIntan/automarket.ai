import { Link } from "react-router-dom";
import LegalLayout, { Section } from "./LegalLayout";

const Ketentuan = () => (
    <LegalLayout title="Syarat & Ketentuan" updated="15 Juli 2026">
        <Section title="Penerimaan Ketentuan">
            <p>
                Dengan mengakses dan menggunakan Automarket, Anda dianggap
                menyetujui syarat dan ketentuan berikut. Mohon dibaca dengan
                saksama sebelum menggunakan layanan.
            </p>
        </Section>

        <Section title="Akun Pengguna">
            <ul className="list-disc space-y-2 pl-5">
                <li>
                    Anda bertanggung jawab menjaga kerahasiaan akun serta
                    seluruh aktivitas yang terjadi di dalamnya.
                </li>
                <li>
                    Anda wajib memberikan informasi yang benar dan akurat saat
                    mendaftar.
                </li>
            </ul>
        </Section>

        <Section title="Ketentuan Posting Iklan">
            <ul className="list-disc space-y-2 pl-5">
                <li>
                    Seluruh informasi pada iklan harus benar, akurat, dan dapat
                    dipertanggungjawabkan.
                </li>
                <li>
                    Iklan tidak langsung tampil di marketplace. Tim admin
                    meninjau dan menyetujui iklan terlebih dahulu.
                </li>
                <li>
                    Iklan yang terindikasi penipuan, memuat informasi palsu,
                    atau melanggar hukum akan ditolak atau diturunkan tanpa
                    pemberitahuan.
                </li>
                <li>
                    Anda bertanggung jawab penuh atas keaslian dokumen kendaraan
                    (STNK, BPKB, faktur, dll.) yang dijadikan dasar iklan.
                </li>
            </ul>
        </Section>

        <Section title="Moderasi Konten">
            <p>
                Automarket berhak meninjau, menolak, menurunkan, atau menghapus
                iklan maupun komentar yang melanggar ketentuan atau dilaporkan
                oleh pengguna lain.
            </p>
        </Section>

        <Section title="Transaksi di Luar Platform">
            <ul className="list-disc space-y-2 pl-5">
                <li>
                    Komunikasi dan transaksi lanjutan dengan calon pembeli atau
                    penjual dilakukan di luar platform Automarket.
                </li>
                <li>
                    Automarket tidak terlibat dalam proses negosiasi,
                    pembayaran, maupun pengiriman kendaraan, dan tidak
                    bertanggung jawab atas kerugian yang timbul dari transaksi
                    antar pengguna.
                </li>
            </ul>
        </Section>

        <Section title="Konten Pengguna">
            <p>
                Dengan mengunggah foto, deskripsi, atau komentar, Anda
                menyatakan memiliki hak atas konten tersebut dan memberi
                Automarket izin untuk menampilkannya di platform.
            </p>
        </Section>

        <Section title="Batasan Tanggung Jawab">
            <p>
                Layanan disediakan &quot;sebagaimana adanya&quot;. Automarket
                tidak menjamin keakuratan iklan yang diunggah pengguna maupun
                ketersediaan layanan tanpa gangguan.
            </p>
        </Section>

        <Section title="Perubahan Ketentuan">
            <p>
                Kami dapat mengubah syarat dan ketentuan ini sewaktu-waktu.
                Penggunaan layanan yang berkelanjutan berarti Anda menyetujui
                perubahan tersebut.
            </p>
        </Section>

        <Section title="Hubungi Kami">
            <p>
                Pertanyaan seputar ketentuan ini dapat Anda sampaikan melalui
                halaman{" "}
                <Link
                    to="/contact"
                    className="text-blue-600 hover:underline"
                >
                    Hubungi Kami
                </Link>
                .
            </p>
        </Section>
    </LegalLayout>
);

export default Ketentuan;
