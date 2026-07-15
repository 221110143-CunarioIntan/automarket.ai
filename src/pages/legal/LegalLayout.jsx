const LegalLayout = ({ title, updated, children }) => (
    <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">
            Terakhir diperbarui: {updated}
        </p>
        <div className="mt-8 space-y-8">{children}</div>
    </div>
);

export const Section = ({ title, children }) => (
    <section>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-slate-600">
            {children}
        </div>
    </section>
);

export default LegalLayout;
