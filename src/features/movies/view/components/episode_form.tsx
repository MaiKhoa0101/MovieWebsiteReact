import { useRef, useState } from "react";
import type { EpisodeCreateDTO, EpisodeWithVid } from "../../models/movie.dto";

interface EpisodeFormBlockProps {
    episode: EpisodeWithVid;
    onChange: (vid: string, field: keyof EpisodeCreateDTO, value: string) => void;
    onRemove: (vid: string) => void;
    // episodeSlug dùng riêng cho URL upload — tách biệt khỏi _vid
    episodeSlug?: string;
    onUploadVideo?: (episodeSlug: string, file: File) => Promise<string | null>;
}

export function EpisodeFormBlock({
    episode,
    onChange,
    onRemove,
    episodeSlug,
    onUploadVideo,
}: EpisodeFormBlockProps) {
    // _vid là "điểm neo" ổn định trong suốt phiên làm việc
    // dù user đổi slug field, _vid không thay đổi → onChange/onRemove luôn trúng đúng episode
    const vid = episode._vid;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !episodeSlug || !onUploadVideo) return;

        setUploadStatus("uploading");
        try {
            const relativePath = await onUploadVideo(episodeSlug, file);
            if (relativePath) {
                onChange(vid, "link_m3u8", relativePath); // dùng vid để update đúng episode
                setUploadStatus("done");
            } else {
                setUploadStatus("error");
            }
        } catch {
            setUploadStatus("error");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const isUploading = uploadStatus === "uploading";

    // Helper: tạo onChange handler cho từng field, luôn gửi vid
    const f = (field: keyof EpisodeCreateDTO) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange(vid, field, e.target.value);

    return (
        <div style={{
            backgroundColor: "#0f172a", padding: 15, borderRadius: 8,
            border: "1px solid #334155", marginBottom: 10, position: "relative",
        }}>
            <button
                type="button"
                onClick={() => onRemove(vid)}
                style={{
                    position: "absolute", top: 10, right: 10,
                    background: "none", border: "none",
                    color: "#ef4444", cursor: "pointer", fontSize: 16,
                }}
            >✕</button>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

                <input className="form-input" placeholder="Tên tập (VD: Tập 1, Full...)" required
                    value={episode.name_episode} onChange={f("name_episode")} />

                <input className="form-input" placeholder="Slug (VD: tap-1, full)"
                    value={episode.slug ?? ""} onChange={f("slug")} />

                <input className="form-input" placeholder="Filename"
                    value={episode.filename ?? ""} onChange={f("filename")} />

                <input className="form-input" placeholder="Link Embed (https://player...)"
                    value={episode.link_embed ?? ""} onChange={f("link_embed")} />

                {/* Link HLS + Upload */}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                        className="form-input"
                        placeholder="Link HLS (tự điền sau khi upload)"
                        value={episode.link_m3u8 ?? ""}
                        onChange={f("link_m3u8")}
                        style={{ flex: 1 }}
                        readOnly={isUploading}
                    />

                    {episodeSlug && onUploadVideo ? (
                        <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".mp4,.mkv,.avi"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                disabled={isUploading}
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    padding: "8px 14px", fontSize: 12, whiteSpace: "nowrap",
                                    backgroundColor: isUploading ? "#475569" : "#2563eb",
                                    color: "white", border: "none", borderRadius: 6,
                                    cursor: isUploading ? "not-allowed" : "pointer",
                                    display: "flex", alignItems: "center", gap: 6,
                                }}
                            >
                                {isUploading ? <><Spinner /> Đang tải...</> : "⬆ Upload HLS"}
                            </button>
                        </>
                    ) : (
                        <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap" }}>
                            {!episodeSlug ? "Điền slug trước" : ""}
                        </span>
                    )}
                </div>

                {uploadStatus === "uploading" && (
                    <p style={{ color: "#f59e0b", fontSize: 12, margin: 0 }}>
                        ⏳ Đang upload... HLS xử lý ở nền
                    </p>
                )}
                {uploadStatus === "done" && (
                    <p style={{ color: "#10b981", fontSize: 12, margin: 0 }}>
                        ✅ Upload xong · HLS đang xử lý nền
                    </p>
                )}
                {uploadStatus === "error" && (
                    <p style={{ color: "#ef4444", fontSize: 12, margin: 0 }}>
                        ❌ Upload thất bại. Thử lại.
                    </p>
                )}

                <input className="form-input" placeholder="Mô tả tập"
                    value={episode.description ?? ""} onChange={f("description")} />
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function Spinner() {
    return (
        <span style={{
            width: 12, height: 12,
            border: "2px solid #fff", borderTopColor: "transparent",
            borderRadius: "50%", display: "inline-block",
            animation: "spin 0.8s linear infinite",
        }} />
    );
}