import { useEffect, useMemo, useState } from "react";
import type { EpisodeCreateDTO, EpisodeWithVid } from "../../features/movies/models/movie.dto";
import { EpisodeFormBlock } from "../../features/movies/view/components/episode_form";

interface EpisodeSectionProps {
    episodes: EpisodeWithVid[];
    onChange: (vid: string, field: keyof EpisodeCreateDTO, value: string) => void;
    onAdd: (serverName: string) => void;
    onRemove: (vid: string) => void;
    // movieSlug + onUploadVideo chỉ truyền ở UpdateForm — CreateForm để undefined
    movieSlug?: string;
    onUploadVideo?: (movieSlug: string, episodeSlug: string, file: File) => Promise<string | null>;
}

export function EpisodeSection({
    episodes,
    onChange,
    onAdd,
    onRemove,
    movieSlug,
    onUploadVideo,
}: EpisodeSectionProps) {
    const servers = useMemo(() => {
        const names = episodes.map(ep => ep.server_name?.trim() || "Mặc định");
        return [...new Set(names)];
    }, [episodes]);

    const [activeServer, setActiveServer] = useState<string>(servers[0] || "Mặc định");
    const [showServerInput, setShowServerInput] = useState(false);
    const [newServerName, setNewServerName] = useState("");

    // Sync active tab nếu server hiện tại bị xóa hết episode
    useEffect(() => {
        if (servers.length > 0 && !servers.includes(activeServer)) {
            setActiveServer(servers[0]);
        }
    }, [servers, activeServer]);

    const handleAddServer = () => {
        const name = newServerName.trim();
        if (!name || servers.includes(name)) return;
        onAdd(name);           // thêm episode mới vào server mới
        setActiveServer(name);
        setNewServerName("");
        setShowServerInput(false);
    };

    const filteredEpisodes = episodes.filter(
        ep => (ep.server_name?.trim() || "Mặc định") === activeServer
    );

    const countOf = (server: string) =>
        episodes.filter(ep => (ep.server_name?.trim() || "Mặc định") === server).length;

    return (
        <div>
            {/* ── Server Tabs ── */}
            <div style={{
                display: "flex", alignItems: "center", gap: 4,
                borderBottom: "1px solid #334155", marginBottom: 12, flexWrap: "wrap",
            }}>
                {servers.map(server => (
                    <button
                        key={server}
                        type="button"
                        onClick={() => setActiveServer(server)}
                        style={{
                            padding: "5px 14px", border: "none", background: "none",
                            borderBottom: activeServer === server
                                ? "2px solid #10b981" : "2px solid transparent",
                            color: activeServer === server ? "#10b981" : "#64748b",
                            fontWeight: activeServer === server ? 600 : 400,
                            cursor: "pointer", fontSize: 13,
                        }}
                    >
                        {server}
                        <span style={{
                            marginLeft: 5, fontSize: 11, background: "#1e293b",
                            padding: "1px 6px", borderRadius: 10, color: "#94a3b8",
                        }}>
                            {countOf(server)}
                        </span>
                    </button>
                ))}

                {showServerInput ? (
                    <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
                        <input
                            autoFocus
                            value={newServerName}
                            onChange={e => setNewServerName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleAddServer()}
                            placeholder="Tên server..."
                            style={{
                                fontSize: 12, padding: "3px 8px", borderRadius: 4,
                                border: "1px solid #475569", background: "#1e293b",
                                color: "#e2e8f0", width: 130,
                            }}
                        />
                        <button type="button" onClick={handleAddServer}
                            style={{ fontSize: 12, padding: "3px 8px", background: "#10b981", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
                            ✓
                        </button>
                        <button type="button" onClick={() => setShowServerInput(false)}
                            style={{ fontSize: 12, padding: "3px 8px", background: "#475569", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
                            ✕
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setShowServerInput(true)}
                        style={{
                            marginLeft: 4, fontSize: 11, padding: "3px 10px",
                            background: "#1e293b", color: "#94a3b8",
                            border: "1px dashed #475569", borderRadius: 4, cursor: "pointer",
                        }}
                    >
                        + Server
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => onAdd(activeServer)}
                    style={{
                        marginLeft: "auto", padding: "4px 12px",
                        background: "#10b981", color: "#fff",
                        border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13,
                    }}
                >
                    + Thêm Tập
                </button>
            </div>

            {/* ── Episode list ── */}
            {filteredEpisodes.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b", fontStyle: "italic", fontSize: 13 }}>
                    Chưa có tập phim trong server này.
                </p>
            ) : (
                filteredEpisodes.map(ep => {
                    // episodeSlug dùng cho upload URL — tách biệt khỏi _vid
                    const slug = ep.slug?.trim() || undefined;

                    return (
                        <EpisodeFormBlock
                            key={ep._vid}          // _vid luôn ổn định dù slug thay đổi
                            episode={ep}
                            onChange={onChange}
                            onRemove={onRemove}
                            episodeSlug={slug}
                            onUploadVideo={
                                onUploadVideo && movieSlug && slug
                                    ? (epSlug, file) => onUploadVideo(movieSlug, epSlug, file)
                                    : undefined
                            }
                        />
                    );
                })
            )}
        </div>
    );
}