import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    LuClipboardList,
    LuHandshake,
    LuMessageCircle,
    LuMic,
    LuPlus,
    LuSearch,
    LuSend,
} from "react-icons/lu";
import { Button } from "@/components/ui";
import { CarCard, MotorCard } from "@/pages/home/components";

const HOW_TO_BUY = [
    {
        icon: LuSearch,
        text: "Search and find your dream car or motor, fully available on AUTOMARKET.",
    },
    {
        icon: LuClipboardList,
        text: "Explore comprehensive details of your dream car or motor.",
    },
    {
        icon: LuHandshake,
        text: "Make your choice and submit your dream car or motor purchase.",
    },
    {
        icon: LuMessageCircle,
        text: "Seller will contact you as soon as possible.",
    },
];

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQ = searchParams.get("q") ?? "";

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);
    const sentInitialRef = useRef(false);

    const send = async (text) => {
        const trimmed = text.trim();
        if (!trimmed || sending) return;

        const nextMessages = [...messages, { role: "user", content: trimmed }];
        setMessages(nextMessages);
        setInput("");
        setSending(true);

        const lastWithVehicles = [...messages]
            .reverse()
            .find((m) => m.role === "assistant" && m.vehicles?.length);
        const recentVehicles = lastWithVehicles?.vehicles ?? [];

        try {
            const res = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: nextMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    recentVehicles,
                }),
            });
            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.message ?? "Maaf, ada yang salah.",
                    vehicles: data.vehicles ?? [],
                },
            ]);
        } catch (e) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Maaf, lagi error nih. Coba lagi sebentar.",
                    vehicles: [],
                },
            ]);
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        if (initialQ && !sentInitialRef.current) {
            sentInitialRef.current = true;
            send(initialQ);
            setSearchParams({}, { replace: true });
        }
    }, [initialQ, setSearchParams]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sending]);

    return (
        <>
            <div className="mx-auto flex max-w-7xl gap-6 px-6 pt-8 pb-32">
                <HowToBuySidebar />
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                    {messages.length === 0 && !sending ? (
                        <EmptyChat />
                    ) : (
                        messages.map((m, i) => (
                            <MessageBubble key={i} message={m} />
                        ))
                    )}
                    {sending && <TypingIndicator />}
                    <div ref={bottomRef} />
                </div>
            </div>

            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-6">
                <div className="mx-auto flex max-w-7xl gap-6">
                    <div className="hidden w-64 shrink-0 lg:block" />
                    <div className="pointer-events-auto min-w-0 flex-1 bg-white py-4">
                        <SearchInput
                            value={input}
                            onChange={setInput}
                            onSubmit={(e) => {
                                e.preventDefault();
                                send(input);
                            }}
                            disabled={sending}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

const HowToBuySidebar = () => (
    <aside className="sticky top-4 hidden h-fit w-64 shrink-0 self-start rounded-2xl bg-blue-50/60 p-6 lg:block">
        <h2 className="mb-5 border-b border-blue-200 pb-3 text-center text-sm font-semibold text-blue-700">
            How to buy
        </h2>
        <ol className="space-y-6">
            {HOW_TO_BUY.map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex flex-col items-center text-center">
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-blue-100">
                        <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
                        {text}
                    </p>
                </li>
            ))}
        </ol>
    </aside>
);

const EmptyChat = () => (
    <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
        <p className="text-2xl font-bold text-slate-800">Hi! Aku AUTO&apos;Z</p>
        <p className="mt-2 text-sm text-slate-500">
            Tanya apa saja soal mobil atau motor bekas — aku bantu carikan.
        </p>
    </div>
);

const MessageBubble = ({ message }) => {
    if (message.role === "user") {
        return (
            <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl bg-blue-600 px-4 py-3 text-sm text-white">
                    {message.content}
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-3">
            <div className="max-w-[85%] rounded-2xl bg-slate-50 px-5 py-4">
                <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
                    AUTO&apos;Z
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {message.content}
                </p>
            </div>
            {message.vehicles?.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {message.vehicles.map((v) =>
                        v.type === "CAR" ? (
                            <CarCard key={v.id} car={v} />
                        ) : (
                            <MotorCard key={v.id} motor={v} />
                        ),
                    )}
                </div>
            )}
        </div>
    );
};

const TypingIndicator = () => (
    <div className="flex w-fit gap-1 rounded-2xl bg-slate-50 px-5 py-4">
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
    </div>
);

const SearchInput = ({ value, onChange, onSubmit, disabled }) => (
    <form
        onSubmit={onSubmit}
        className="flex items-center gap-1 rounded-full border border-slate-300 bg-white p-2 shadow-sm"
    >
        <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Attach"
        >
            <LuPlus className="h-5 w-5" />
        </button>
        <input
            type="text"
            placeholder="Ask AUTO'Z"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:opacity-50"
        />
        <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Voice search"
        >
            <LuMic className="h-5 w-5" />
        </button>
        <Button
            type="submit"
            disabled={disabled}
            className="flex h-10 w-10 items-center justify-center rounded-full p-0"
            aria-label="Send"
        >
            <LuSend className="h-4 w-4" />
        </Button>
    </form>
);

export default Search;
