import { useState } from "react";
import type { EpisodeCreateDTO, EpisodeResponseDTO, MovieDetailResponseDTO, MoviePatchDTO } from "../../../models/movie.dto";
import { EpisodeFormBlock } from "../../components/episode_form";
import { defaultEpisode } from "./create_movie_form";

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
    onUploadVideo: (episodeId: string, episodeSlug: string, file: File) => Promise<string | null>;
}) {
    const [activeTab, setActiveTab] = useState<Tab>("info");
    const [formData, setFormData] = useState<MoviePatchDTO>({
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
        episodes: movie.episodes ?? [],
    });


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(movie.id, formData);
    };

    const handleEpisodeChange = (index: number, field: keyof EpisodeCreateDTO, value: string) => {
        const newEpisodes = [...(formData.episodes ?? [])];
        newEpisodes[index] = { ...newEpisodes[index], [field]: value };
        setFormData({ ...formData, episodes: newEpisodes });
    };

    const handleAddEpisode = () => {
        setFormData({
            ...formData,
            episodes: [...(formData.episodes ?? []), { ...defaultEpisode }],
        });
    };

    const handleRemoveEpisode = (index: number) => {
        setFormData({
            ...formData,
            episodes: (formData.episodes ?? []).filter((_, i) => i !== index),
        });
    };

    const episodes = (formData.episodes ?? []) as EpisodeResponseDTO[];

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: 720, width: "100%" }}>
                <h3 className="modal-title">Sửa Phim: {movie.name}</h3>

                {/* ── TABS ── */}
                <div style={{ display: "flex", gap: 8, margin: "12px 0", borderBottom: "1px solid #334155" }}>
                    {(["info", "episodes"] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: "6px 18px",
                                border: "none",
                                borderBottom: activeTab === tab ? "2px solid #6366f1" : "2px solid transparent",
                                background: "none",
                                color: activeTab === tab ? "#6366f1" : "#94a3b8",
                                fontWeight: activeTab === tab ? 600 : 400,
                                cursor: "pointer",
                                fontSize: 14,
                            }}
                        >
                            {tab === "info" ? "Thông tin phim" : `Tập phim (${episodes.length})`}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="modal-form">

                    {activeTab === "info" && (
                        <>
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
                                        <input type="checkbox"
                                            checked={(formData as any)[key] ?? false}
                                            onChange={e => setFormData({ ...formData, [key]: e.target.checked })} />
                                        {label}
                                    </label>
                                ))}
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Cập nhật thông tin</button>
                                <button type="button" onClick={onClose} className="btn-cancel">Đóng</button>
                            </div>
                        </>
                    )}

                    {activeTab === "episodes" && (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <span style={{ fontSize: 13, color: "#94a3b8" }}>
                                    {episodes.length} tập · Tập mới chưa lưu sẽ mất nếu đóng mà chưa Cập nhật
                                </span>
                                <button type="button" onClick={handleAddEpisode}
                                    style={{
                                        padding: "4px 12px", background: "#10b981", color: "#fff",
                                        border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13,
                                    }}>
                                    + Thêm Tập
                                </button>
                            </div>

                            {episodes.length === 0 && (
                                <p style={{ textAlign: "center", color: "#64748b", fontStyle: "italic", fontSize: 13 }}>
                                    Chưa có tập phim nào.
                                </p>
                            )}

                            {episodes.map((ep, index) => {
                                const epId = ep.id ?? undefined;
                                return (
                                    <div key={epId ?? index} style={{
                                        border: "1px solid #334155", borderRadius: 8,
                                        padding: 12, marginBottom: 10, background: "#0f172a",
                                    }}>
                                        <EpisodeFormBlock
                                            index={index}
                                            episode={ep}
                                            onChange={handleEpisodeChange}
                                            onRemove={handleRemoveEpisode}
                                            episodeId={epId}
                                            onUploadVideo={epId && ep.slug
                                                ? (id, file) => onUploadVideo(id, ep.slug!, file)
                                                : undefined
                                            }
                                        />
                                        {/* Xóa block upload status ở đây — EpisodeFormBlock tự xử lý */}
                                    </div>
                                );
                            })}

                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Lưu danh sách tập</button>
                                <button type="button" onClick={onClose} className="btn-cancel">Đóng</button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}