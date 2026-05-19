import { useRef, useState } from "react";
import type { EpisodeCreateDTO, EpisodeResponseDTO } from "../../models/movie.dto";

interface EpisodeFormBlockProps {
    index: number;
    episode: EpisodeCreateDTO | EpisodeResponseDTO;
    onChange: (index: number, field: keyof EpisodeCreateDTO, value: string) => void;
    onRemove: (index: number) => void;
    episodeId?: string;
    // slug baked-in bởi parent, component này chỉ cần (id, file)
    onUploadVideo?: (episodeId: string, file: File) => Promise<string | null>;
}

export function EpisodeFormBlock({
    index,
    episode,
    onChange,
    onRemove,
    episodeId,
    onUploadVideo,
}: EpisodeFormBlockProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !episodeId || !onUploadVideo) return;

        setUploadStatus("uploading");

        try {
            const relativePath = await onUploadVideo(episodeId, file);
            if (relativePath) {
                // Lưu relative path vào form — FE ghép BASE_URL khi cần phát
                onChange(index, "link_m3u8", relativePath);
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

    return (
        <div style={{
            backgroundColor: "#0f172a", padding: "15px", borderRadius: "8px",
            border: "1px solid #334155", marginBottom: "10px", position: "relative",
        }}>
            {/* Header */}
            <h5 style={{ margin: "0 0 10px 0", color: "#94a3b8" }}>Tập {index + 1}</h5>
            <button
                type="button" onClick={() => onRemove(index)}
                style={{
                    position: "absolute", top: 10, right: 10, background: "none",
                    border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16,
                }}
            >✕</button>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

                <input className="form-input" placeholder="Tên tập (VD: Tập 1, Full...)" required
                    value={episode.name_episode}
                    onChange={e => onChange(index, "name_episode", e.target.value)} />

                <input className="form-input" placeholder="Slug (VD: tap-1, full)"
                    value={episode.slug ?? ""}
                    onChange={e => onChange(index, "slug", e.target.value)} />

                <input className="form-input" placeholder="Server name (VD: #HN Vietsub)"
                    value={episode.server_name ?? ""}
                    onChange={e => onChange(index, "server_name", e.target.value)} />

                <input className="form-input" placeholder="Filename"
                    value={episode.filename ?? ""}
                    onChange={e => onChange(index, "filename", e.target.value)} />

                <input className="form-input" placeholder="Link Embed (https://player...)"
                    value={episode.link_embed ?? ""}
                    onChange={e => onChange(index, "link_embed", e.target.value)} />

                {/* Link M3U8 + Upload */}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                        className="form-input"
                        placeholder="Link HLS (tự điền sau khi upload)"
                        value={episode.link_m3u8 ?? ""}
                        onChange={e => onChange(index, "link_m3u8", e.target.value)}
                        style={{ flex: 1 }}
                        readOnly={isUploading}
                    />

                    {episodeId && onUploadVideo ? (
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
                                    padding: "8px 14px",
                                    backgroundColor: isUploading ? "#475569" : "#2563eb",
                                    color: "white", border: "none", borderRadius: 6,
                                    cursor: isUploading ? "not-allowed" : "pointer",
                                    fontSize: 12, whiteSpace: "nowrap",
                                    display: "flex", alignItems: "center", gap: 6,
                                }}
                            >
                                {isUploading
                                    ? <><Spinner /> Đang tải...</>
                                    : "⬆ Upload HLS"
                                }
                            </button>
                        </>
                    ) : (
                        <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap" }}>
                            Lưu phim trước
                        </span>
                    )}
                </div>

                {/* Status messages */}
                {uploadStatus === "uploading" && (
                    <p style={{ color: "#f59e0b", fontSize: 12, margin: 0 }}>
                        ⏳ Đang upload... ffmpeg sẽ xử lý HLS ở nền sau khi xong
                    </p>
                )}
                {uploadStatus === "done" && (
                    <p style={{ color: "#10b981", fontSize: 12, margin: 0 }}>
                        ✅ Upload xong · HLS đang xử lý nền · link đã được điền
                    </p>
                )}
                {uploadStatus === "error" && (
                    <p style={{ color: "#ef4444", fontSize: 12, margin: 0 }}>
                        ❌ Upload thất bại. Thử lại.
                    </p>
                )}

                <input className="form-input" placeholder="Mô tả tập"
                    value={episode.description ?? ""}
                    onChange={e => onChange(index, "description", e.target.value)} />
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function Spinner() {
    return (
        <span style={{
            width: 12, height: 12, border: "2px solid #fff",
            borderTopColor: "transparent", borderRadius: "50%",
            display: "inline-block", animation: "spin 0.8s linear infinite",
        }} />
    );
}