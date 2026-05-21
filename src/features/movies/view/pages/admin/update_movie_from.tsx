import { useState } from "react";
import type {
    EpisodeCreateDTO,
    EpisodeWithVid,
    MovieDetailResponseDTO,
    MoviePatchDTO,
} from "../../../models/movie.dto";
import { initEpisodeSession, stripVid } from "../../../models/movie.dto";
import { defaultEpisode } from "./create_movie_form";
import { EpisodeSection } from "../../../../../shared/components/form_episode_section";

type Tab = "info" | "episodes";

export function UpdateMovieInfo({
    movie,
    onClose,
    onSubmit,
    onUploadVideo,
}: {
    movie: MovieDetailResponseDTO;
    onClose: () => void;
    onSubmit: (id: string, data: MoviePatchDTO) => void;
    onUploadVideo: (movieSlug: string, episodeSlug: string, file: File) => Promise<string | null>;
}) {
    const [activeTab, setActiveTab] = useState<Tab>("info");

    // ── State: thông tin phim (không chứa episodes) ──
    const [formData, setFormData] = useState<Omit<MoviePatchDTO, "episodes">>({
        name: movie.name,
        slug_name: movie.slug_name,
        origin_name: movie.origin_name ?? "",
        is_series: movie.is_series,
        status: movie.status ?? "",
        description: movie.description ?? "",
        poster_url: movie.poster_url ?? "",
        thumb_url: movie.thumb_url ?? "",
        trailer_url: movie.trailer_url ?? "",
        quality: movie.quality ?? "FHD",
        lang: movie.lang ?? "Vietsub",
        time: movie.time ?? "",
        year: movie.year,
        episode_current: movie.episode_current ?? "",
        episode_total: movie.episode_total ?? "",
        is_copyright: movie.is_copyright ?? false,
        sub_docquyen: movie.sub_docquyen ?? false,
        chieurap: movie.chieurap ?? false,
    });

    // ── State: bản nháp episodes (Virtual State) ──
    // initEpisodeSession deep clone + gán _vid → tách biệt hoàn toàn khỏi dữ liệu gốc
    const [tempEpisodes, setTempEpisodes] = useState<EpisodeWithVid[]>(
        () => initEpisodeSession(movie.episodes ?? [])
    );
    const [isDirty, setIsDirty] = useState(false);

    // ════════════════════════════════════════════
    // HANDLERS: Movie Info
    // ════════════════════════════════════════════

    const handleInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Chỉ gửi thông tin phim, không kèm episodes
        onSubmit(movie.id, { ...formData });
    };

    // ════════════════════════════════════════════
    // HANDLERS: Episodes (tất cả dùng _vid)
    // ════════════════════════════════════════════

    // Tìm episode bằng _vid → update field
    const handleEpisodeChange = (vid: string, field: keyof EpisodeCreateDTO, value: string) => {
        setTempEpisodes(prev =>
            prev.map(ep => ep._vid === vid ? { ...ep, [field]: value } : ep)
        );
        setIsDirty(true);
    };

    // Xóa episode bằng _vid
    const handleRemoveEpisode = (vid: string) => {
        setTempEpisodes(prev => prev.filter(ep => ep._vid !== vid));
        setIsDirty(true);
    };

    // Thêm episode mới — gán _vid = uuid mới
    const handleAddEpisode = (serverName: string) => {
        const newEp: EpisodeWithVid = {
            ...defaultEpisode,
            server_name: serverName,
            _vid: crypto.randomUUID(), // virtual ID cho episode chưa tồn tại trên DB
        };
        setTempEpisodes(prev => [...prev, newEp]);
        setIsDirty(true);
    };

    // Rollback — giải phóng bản nháp, khôi phục về trạng thái ban đầu
    const handleRollback = () => {
        setTempEpisodes(initEpisodeSession(movie.episodes ?? []));
        setIsDirty(false);
    };

    const handleEpisodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(movie.id, {
            episodes: stripVid(tempEpisodes),
        });
        setIsDirty(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: 720, width: "100%" }}>
                <h3 className="modal-title">Sửa Phim: {movie.name}</h3>

                {/* ── Tabs ── */}
                <div style={{
                    display: "flex", gap: 8, margin: "12px 0",
                    borderBottom: "1px solid #334155",
                }}>
                    {(["info", "episodes"] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: "6px 18px", border: "none",
                                borderBottom: activeTab === tab
                                    ? "2px solid #6366f1" : "2px solid transparent",
                                background: "none",
                                color: activeTab === tab ? "#6366f1" : "#94a3b8",
                                fontWeight: activeTab === tab ? 600 : 400,
                                cursor: "pointer", fontSize: 14,
                            }}
                        >
                            {tab === "info" ? "Thông tin phim" : (
                                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    Tập phim ({tempEpisodes.length})
                                    {/* Chấm vàng báo hiệu có thay đổi chưa lưu */}
                                    {isDirty && (
                                        <span
                                            title="Có thay đổi chưa lưu"
                                            style={{
                                                width: 7, height: 7, borderRadius: "50%",
                                                background: "#f59e0b", display: "inline-block",
                                            }}
                                        />
                                    )}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ════════ TAB: THÔNG TIN PHIM ════════ */}
                {activeTab === "info" && (
                    <form onSubmit={handleInfoSubmit} className="modal-form">
                        <label className="form-label">Tên phim *</label>
                        <input className="form-input" required
                            value={formData.name ?? ""}
                            onChange={e => setFormData({ ...formData, name: e.target.value })} />

                        <label className="form-label">Tên gốc</label>
                        <input className="form-input"
                            value={formData.origin_name ?? ""}
                            onChange={e => setFormData({ ...formData, origin_name: e.target.value })} />

                        <label className="form-label">Slug *</label>
                        <input className="form-input" required
                            value={formData.slug_name ?? ""}
                            onChange={e => setFormData({ ...formData, slug_name: e.target.value })} />

                        <label className="form-label">Mô tả</label>
                        <textarea className="form-input" rows={3}
                            value={formData.description ?? ""}
                            onChange={e => setFormData({ ...formData, description: e.target.value })} />

                        <label className="form-label">Poster URL</label>
                        <input className="form-input"
                            value={formData.poster_url ?? ""}
                            onChange={e => setFormData({ ...formData, poster_url: e.target.value })} />

                        <label className="form-label">Thumbnail URL</label>
                        <input className="form-input"
                            value={formData.thumb_url ?? ""}
                            onChange={e => setFormData({ ...formData, thumb_url: e.target.value })} />

                        <label className="form-label">Trailer URL</label>
                        <input className="form-input"
                            value={formData.trailer_url ?? ""}
                            onChange={e => setFormData({ ...formData, trailer_url: e.target.value })} />

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div>
                                <label className="form-label">Chất lượng</label>
                                <select className="form-input"
                                    value={formData.quality ?? ""}
                                    onChange={e => setFormData({ ...formData, quality: e.target.value })}>
                                    <option value="FHD">FHD</option>
                                    <option value="HD">HD</option>
                                    <option value="SD">SD</option>
                                    <option value="CAM">CAM</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Ngôn ngữ</label>
                                <select className="form-input"
                                    value={formData.lang ?? ""}
                                    onChange={e => setFormData({ ...formData, lang: e.target.value })}>
                                    <option value="Vietsub">Vietsub</option>
                                    <option value="Thuyết Minh">Thuyết Minh</option>
                                    <option value="Lồng Tiếng">Lồng Tiếng</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Năm</label>
                                <input className="form-input" type="number"
                                    value={formData.year ?? ""}
                                    onChange={e => setFormData({ ...formData, year: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="form-label">Thời lượng</label>
                                <input className="form-input"
                                    value={formData.time ?? ""}
                                    onChange={e => setFormData({ ...formData, time: e.target.value })} />
                            </div>
                            <div>
                                <label className="form-label">Tập hiện tại</label>
                                <input className="form-input"
                                    value={formData.episode_current ?? ""}
                                    onChange={e => setFormData({ ...formData, episode_current: e.target.value })} />
                            </div>
                            <div>
                                <label className="form-label">Tổng số tập</label>
                                <input className="form-input"
                                    value={formData.episode_total ?? ""}
                                    onChange={e => setFormData({ ...formData, episode_total: e.target.value })} />
                            </div>
                            <div>
                                <label className="form-label">Tình trạng</label>
                                <input className="form-input"
                                    value={formData.status ?? ""}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 20, marginTop: 10, flexWrap: "wrap" }}>
                            {[
                                { key: "chieurap", label: "Chiếu Rạp" },
                                { key: "is_series", label: "Phim bộ?" },
                                { key: "sub_docquyen", label: "Sub Độc Quyền" },
                            ].map(({ key, label }) => (
                                <label key={key} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={(formData as any)[key] ?? false}
                                        onChange={e => setFormData({ ...formData, [key]: e.target.checked })}
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>

                        <div className="modal-actions">
                            <button type="submit" className="btn-primary">Cập nhật thông tin</button>
                            <button type="button" onClick={onClose} className="btn-cancel">Đóng</button>
                        </div>
                    </form>
                )}

                {/* ════════ TAB: DANH SÁCH TẬP ════════ */}
                {activeTab === "episodes" && (
                    <form onSubmit={handleEpisodeSubmit} className="modal-form">

                        {/* Dirty banner + Rollback */}
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", marginBottom: 10,
                        }}>
                            <span style={{ fontSize: 13, color: isDirty ? "#f59e0b" : "#64748b" }}>
                                {isDirty
                                    ? `⚠ ${tempEpisodes.length} tập · Có thay đổi chưa lưu`
                                    : `${tempEpisodes.length} tập · Chưa có thay đổi`
                                }
                            </span>
                            {isDirty && (
                                <button
                                    type="button"
                                    onClick={handleRollback}
                                    style={{
                                        fontSize: 12, padding: "3px 10px", background: "none",
                                        color: "#94a3b8", border: "1px solid #475569",
                                        borderRadius: 4, cursor: "pointer",
                                    }}
                                >
                                    ↩ Hủy thay đổi
                                </button>
                            )}
                        </div>

                        <EpisodeSection
                            episodes={tempEpisodes}
                            onChange={handleEpisodeChange}
                            onAdd={handleAddEpisode}
                            onRemove={handleRemoveEpisode}
                            onUploadVideo={onUploadVideo}
                            movieSlug={movie.slug_name}
                        />

                        <div className="modal-actions">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={!isDirty}
                                style={{ opacity: isDirty ? 1 : 0.5, cursor: isDirty ? "pointer" : "not-allowed" }}
                            >
                                Lưu danh sách tập
                            </button>
                            <button type="button" onClick={onClose} className="btn-cancel">Đóng</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}