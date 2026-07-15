import { Link } from "react-router-dom";
import LegalLayout, { Section } from "./LegalLayout";

const Privasi = () => (
    <LegalLayout title="Kebijakan Privasi" updated="15 Juli 2026">
        <Section title="Pendahuluan">
            <p>
                Automarket (&quot;kami&quot;) menghargai privasi Anda. Kebijakan
                ini menjelaskan data apa yang kami kumpulkan saat Anda
                menggunakan platform jual-beli kendaraan Automarket, bagaimana
                kami menggunakannya, serta hak Anda atas data tersebut.
            </p>
        </Section>

        <Section title="Data yang Kami Kumpulkan">
            <ul className="list-disc space-y-2 pl-5">
                <li>
                    <span className="font-medium text-slate-700">
                        Data akun:
                    </span>{" "}
                    alamat email dan nama yang Anda berikan saat mendaftar.
                </li>
                <li>
                    <span className="font-medium text-slate-700">
                        Data iklan:
                    </span>{" "}
                    informasi kendaraan (merek, model, tahun, harga,
                    spesifikasi), foto, lokasi, dan nomor WhatsApp yang Anda
                    cantumkan pada iklan.
                </li>
                <li>
                    <span className="font-medium text-slate-700">
                        Interaksi:
                    </span>{" "}
                    komentar dan pesan yang Anda kirim melalui platform.
                </li>
                <li>
                    <span className="font-medium text-slate-700">
                        Data teknis:
                    </span>{" "}
                    informasi sesi login yang diperlukan agar layanan dapat
                    berfungsi.
                </li>
            </ul>
        </Section>

        <Section title="Cara Kami Menggunakan Data">
            <ul className="list-disc space-y-2 pl-5">
                <li>
                    Menampilkan iklan Anda di marketplace setelah disetujui
                    admin.
                </li>
                <li>
                    Menghubungkan calon pembeli dengan penjual melalui nomor
                    WhatsApp yang dicantumkan.
                </li>
                <li>
                    Meninjau dan memoderasi konten untuk mencegah penipuan serta
                    pelanggaran ketentuan.
                </li>
                <li>Menjaga keamanan dan meningkatkan kualitas layanan.</li>
            </ul>
        </Section>

        <Section title="Berbagi Data">
            <ul className="list-disc space-y-2 pl-5">
                <li>
                    Nomor WhatsApp, lokasi, dan detail iklan akan tampil secara
                    publik ketika iklan Anda disetujui, agar calon pembeli dapat
                    menghubungi Anda.
                </li>
                <li>
                    Kami tidak menjual atau menyewakan data pribadi Anda kepada
                    pihak ketiga.
                </li>
                <li>
                    Kami dapat mengungkapkan data apabila diwajibkan oleh hukum
                    yang berlaku.
                </li>
            </ul>
        </Section>

        <Section title="Penyimpanan & Keamanan">
            <p>
                Data disimpan pada layanan infrastruktur pihak ketiga dengan
                kontrol akses. Kami berupaya menjaga keamanan data Anda, namun
                perlu dipahami bahwa tidak ada sistem penyimpanan yang sepenuhnya
                bebas dari risiko.
            </p>
        </Section>

        <Section title="Hak Anda">
            <ul className="list-disc space-y-2 pl-5">
                <li>
                    Anda dapat mengakses dan memperbarui data akun serta iklan
                    yang masih berstatus menunggu persetujuan (PENDING).
                </li>
                <li>
                    Anda dapat meminta penghapusan akun atau iklan dengan
                    menghubungi kami.
                </li>
            </ul>
        </Section>

        <Section title="Perubahan Kebijakan">
            <p>
                Kami dapat memperbarui kebijakan ini dari waktu ke waktu.
                Perubahan berlaku sejak dipublikasikan di halaman ini.
            </p>
        </Section>

        <Section title="Hubungi Kami">
            <p>
                Pertanyaan seputar privasi dapat Anda sampaikan melalui halaman{" "}
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

export default Privasi;
