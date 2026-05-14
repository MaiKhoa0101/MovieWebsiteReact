import { useRef, useState } from "react";
import type { EpisodeCreateDTO, EpisodeResponseDTO } from "../../models/movie.dto";

interface EpisodeFormBlockProps {
    index: number;
    episode: EpisodeCreateDTO | EpisodeResponseDTO;
    onChange: (index: number, field: keyof EpisodeCreateDTO, value: string) => void;
    onRemove: (index: number) => void;
    // Optional: truyền vào nếu episode đã có id (đang edit)
    episodeId?: string;
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
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !episodeId || !onUploadVideo) return;

        setUploading(true);
        setUploadError(null);

        try {
            const resultPath = await onUploadVideo(episodeId, file);
            if (resultPath) {
                // Tự động điền link_m3u8 sau khi upload xong
                onChange(index, "link_m3u8", resultPath);
            }
        } catch (err) {
            setUploadError("Upload thất bại. Thử lại.");
        } finally {
            setUploading(false);
            // Reset input để có thể chọn lại cùng file
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div style={{
            backgroundColor: "#0f172a", padding: "15px", borderRadius: "8px",
            border: "1px solid #334155", marginBottom: "10px", position: "relative"
        }}>
            {/* Header */}
            <h5 style={{ margin: "0 0 10px 0", color: "#94a3b8" }}>Tập {index + 1}</h5>
            <button type="button" onClick={() => onRemove(index)} style={{
                position: "absolute", top: "10px", right: "10px", background: "none",
                border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "bold", fontSize: "16px"
            }}>✕</button>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

                <input className="form-input" placeholder="Tên tập (VD: Tập 1, Full...)" required
                    value={episode.name_episode}
                    onChange={e => onChange(index, "name_episode", e.target.value)} />

                <input className="form-input" placeholder="Server name (VD: #HN Vietsub)"
                    value={episode.server_name ?? ""}
                    onChange={e => onChange(index, "server_name", e.target.value)} />

                <input className="form-input" placeholder="Slug (VD: tap-1, full)"
                    value={episode.slug ?? ""}
                    onChange={e => onChange(index, "slug", e.target.value)} />

                <input className="form-input" placeholder="Filename"
                    value={episode.filename ?? ""}
                    onChange={e => onChange(index, "filename", e.target.value)} />

                <input className="form-input" placeholder="Link Embed (https://player...)"
                    value={episode.link_embed ?? ""}
                    onChange={e => onChange(index, "link_embed", e.target.value)} />

                {/* Link M3U8 + Upload button */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                        className="form-input"
                        placeholder="Link video (tự điền sau khi upload)"
                        value={episode.link_m3u8 ?? ""}
                        onChange={e => onChange(index, "link_m3u8", e.target.value)}
                        style={{ flex: 1 }}
                        readOnly={uploading}
                    />

                    {/* Chỉ hiện nút upload nếu episode đã có id */}
                    {episodeId && onUploadVideo ? (
                        <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/mp4,video/mkv,video/avi,video/mov,video/webm"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                disabled={uploading}
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    padding: "8px 14px",
                                    backgroundColor: uploading ? "#475569" : "#2563eb",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: uploading ? "not-allowed" : "pointer",
                                    fontSize: "12px",
                                    whiteSpace: "nowrap",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }}
                            >
                                {uploading ? (
                                    <>
                                        <span style={{
                                            width: "12px", height: "12px", border: "2px solid #fff",
                                            borderTopColor: "transparent", borderRadius: "50%",
                                            display: "inline-block", animation: "spin 0.8s linear infinite"
                                        }} />
                                        Đang tải...
                                    </>
                                ) : "⬆ Upload"}
                            </button>
                        </>
                    ) : (
                        // Episode chưa có id (mới tạo) → chưa upload được
                        <span style={{ fontSize: "11px", color: "#64748b", whiteSpace: "nowrap" }}>
                            Lưu phim trước
                        </span>
                    )}
                </div>

                {/* Upload error */}
                {uploadError && (
                    <p style={{ color: "#ef4444", fontSize: "12px", margin: 0 }}>{uploadError}</p>
                )}

                {/* Upload progress hint */}
                {uploading && (
                    <p style={{ color: "#60a5fa", fontSize: "12px", margin: 0 }}>
                        ⏳ Đang upload video, vui lòng chờ...
                    </p>
                )}

                <input className="form-input" placeholder="Mô tả tập"
                    value={episode.description ?? ""}
                    onChange={e => onChange(index, "description", e.target.value)} />
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}