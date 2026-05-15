import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoPng from "../../assets/icon/logo.png";
import "./topbar.css";

const APK_URL = "/downloads/WannaWatch.apk";

function triggerApkDownload(url: string, filename: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
export function Topbar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    return (
        <header className="topbar">
            <Logo onClick={() => navigate("/")} />

            <div className="topbar__right">
                <DownloadAppBtn />
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    onSearch={(q) => {
                        if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
                    }}
                />
                <AccountBtn onClick={() => navigate("/profile")} />
            </div>
        </header>
    );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ onClick }: { onClick?: () => void }) {
    return (
        <div className="topbar__logo" onClick={onClick} role="button" tabIndex={0}>
            <img src={logoPng} alt="WannaWatch" className="topbar__logo-img" />
            <span className="topbar__logo-name">WannaWatch</span>
        </div>
    );
}

// ─── Download Button ──────────────────────────────────────────────────────────
function DownloadAppBtn() {
    return (
        <button
            className="topbar__btn-download"
            onClick={() => triggerApkDownload(APK_URL, "WannaWatch.apk")}
        >
            {/* Android icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zm-2.5-1C2.67 17 2 17.67 2 18.5v-9C2 8.67 2.67 8 3.5 8S5 8.67 5 9.5v9c0 .83-.67 1.5-1.5 1.5zm17 0c-.83 0-1.5-.67-1.5-1.5v-9c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.87.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C7.1 3.08 6 4.94 6 7h12c0-2.06-1.1-3.92-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
            </svg>
            Tải App
        </button>
    );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
interface SearchBarProps {
    value: string;
    onChange: (v: string) => void;
    onSearch: (v: string) => void;
}

function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") onSearch(value);
        if (e.key === "Escape") {
            onChange("");
            inputRef.current?.blur();
        }
    };

    return (
        <div className="topbar__search">
            <span className="topbar__search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </span>
            <input
                ref={inputRef}
                className="topbar__search-input"
                type="text"
                placeholder="Tìm kiếm..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
            />
        </div>
    );
}

// ─── Account Button ───────────────────────────────────────────────────────────
function AccountBtn({ onClick }: { onClick?: () => void }) {
    return (
        <button className="topbar__btn-account" onClick={onClick} aria-label="Tài khoản">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        </button>
    );
}