// Map Supabase Auth errors to friendly Indonesian messages.
// Prefers the stable `error.code`, falls back to matching `error.message`.

const BY_CODE = {
    invalid_credentials: "Email atau password salah.",
    email_not_confirmed:
        "Email belum dikonfirmasi. Silakan cek inbox untuk link konfirmasi.",
    user_already_exists: "Email sudah terdaftar. Silakan login.",
    email_exists: "Email sudah terdaftar. Silakan login.",
    weak_password: "Password terlalu lemah (minimal 6 karakter).",
    over_email_send_rate_limit:
        "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.",
    over_request_rate_limit:
        "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.",
    validation_failed: "Data yang dimasukkan tidak valid.",
};

export const authErrorMessage = (error) => {
    if (!error) return null;
    if (error.code && BY_CODE[error.code]) return BY_CODE[error.code];

    const msg = error.message?.toLowerCase() ?? "";
    if (msg.includes("invalid login")) return BY_CODE.invalid_credentials;
    if (msg.includes("not confirmed")) return BY_CODE.email_not_confirmed;
    if (msg.includes("already registered") || msg.includes("already exists"))
        return BY_CODE.user_already_exists;
    if (msg.includes("rate limit")) return BY_CODE.over_email_send_rate_limit;

    return error.message || "Terjadi kesalahan. Silakan coba lagi.";
};
