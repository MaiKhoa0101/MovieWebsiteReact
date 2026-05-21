
// ==========================================
// 2. FORM TẠO PHIM (CREATE)

import { useState } from "react";
import type { EpisodeCreateDTO, MovieCreateDTO } from "../../../models/movie.dto";
import { EpisodeFormBlock } from "../../components/episode_form";
import { EpisodeSection } from "../../../../../shared/components/form_episode_section";

// ==========================================
export const defaultEpisode: EpisodeCreateDTO = {
    name_episode: "",
    slug: "",
    filename: "",
    link_embed: "",
    link_m3u8: "",
    server_name: "",
    description: "",
};

export const defaultCreateForm: MovieCreateDTO = {
    name: "",
    slug_name: "",
    origin_name: "",
    is_series: false,
    status: "completed",
    description: "",
    poster_url: "",
    thumb_url: "",
    trailer_url: "",
    quality: "FHD",
    lang: "Vietsub",
    time: "",
    year: new Date().getFullYear(),
    view: 0,
    episode_current: "Full",
    episode_total: "1",
    is_copyright: false,
    sub_docquyen: false,
    chieurap: false,
    episodes: [{ ...defaultEpisode, name_episode: "Full" }],
    actor_ids: [],
    director_ids: [],
    category_ids: [],
    country_ids: [],
    external_ids: null,
};

export function CreateMovieForm({
    onClose,
    onSubmit,
}: {
    onClose: () => void;
    onSubmit: (data: MovieCreateDTO) => void;
}) {
    const [formData, setFormData] = useState<MovieCreateDTO>(defaultCreateForm);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleEpisodeChange = (slug: string, field: keyof EpisodeCreateDTO, value: string) => {
        setFormData(prev => {
            const episodes = [...prev.episodes];
            const idx = episodes.findIndex(ep => ep.slug === slug);
            if (idx === -1) return prev;
            episodes[idx] = { ...episodes[idx], [field]: value };
            return { ...prev, episodes };
        });
    };
    const handleAddEpisode = (serverName: string) => {
        setFormData({
            ...formData,
            episodes: [...formData.episodes, { ...defaultEpisode, server_name: serverName }],
        });
    };

    const handleRemoveEpisode = (slug: string) => {
        setFormData(prev => ({
            ...prev,
            episodes: prev.episodes.filter(ep => ep.slug !== slug),
        }));
    };
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">Tạo Phim Mới</h3>
                <form onSubmit={handleSubmit} className="modal-form">

                    {/* -- THÔNG TIN CƠ BẢN -- */}
                    <label className="form-label">Tên phim *</label>
                    <input className="form-input" placeholder="Tên phim" required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} />

                    <label className="form-label">Tên gốc (origin name)</label>
                    <input className="form-input" placeholder="Tên tiếng nước ngoài"
                        value={formData.origin_name ?? ""}
                        onChange={e => setFormData({ ...formData, origin_name: e.target.value })} />

                    <label className="form-label">Slug *</label>
                    <input className="form-input" placeholder="vi-du-slug" required
                        value={formData.slug_name}
                        onChange={e => setFormData({ ...formData, slug_name: e.target.value })} />

                    <label className="form-label">Mô tả</label>
                    <textarea className="form-input" rows={3} placeholder="Nội dung phim..."
                        value={formData.description ?? ""}
                        onChange={e => setFormData({ ...formData, description: e.target.value })} />

                    {/* -- ẢNH & TRAILER -- */}
                    <label className="form-label">Poster URL</label>
                    <input className="form-input" placeholder="https://..."
                        value={formData.poster_url ?? ""}
                        onChange={e => setFormData({ ...formData, poster_url: e.target.value })} />

                    <label className="form-label">Thumbnail URL</label>
                    <input className="form-input" placeholder="https://..."
                        value={formData.thumb_url ?? ""}
                        onChange={e => setFormData({ ...formData, thumb_url: e.target.value })} />

                    <label className="form-label">Trailer URL</label>
                    <input className="form-input" placeholder="https://youtube.com/..."
                        value={formData.trailer_url ?? ""}
                        onChange={e => setFormData({ ...formData, trailer_url: e.target.value })} />

                    {/* -- THÔNG TIN PHÁT SÓNG -- */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
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
                            <input className="form-input" type="number" placeholder="2025"
                                value={formData.year ?? ""}
                                onChange={e => setFormData({ ...formData, year: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Thời lượng</label>
                            <input className="form-input" placeholder="174 phút"
                                value={formData.time ?? ""}
                                onChange={e => setFormData({ ...formData, time: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Tập hiện tại</label>
                            <input className="form-input" placeholder="Full / Tập 12"
                                value={formData.episode_current ?? ""}
                                onChange={e => setFormData({ ...formData, episode_current: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Tổng số tập</label>
                            <input className="form-input" placeholder="1 / 24"
                                value={formData.episode_total ?? ""}
                                onChange={e => setFormData({ ...formData, episode_total: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "20px", marginTop: "10px", flexWrap: "wrap" }}>
                        <label className="checkbox-label">
                            <input type="checkbox" checked={formData.chieurap ?? false}
                                onChange={e => setFormData({ ...formData, chieurap: e.target.checked })} />
                            Chiếu Rạp
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" checked={formData.is_series ?? false}
                                onChange={e => setFormData({ ...formData, is_series: e.target.checked })} />
                            Phim bộ?
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" checked={formData.sub_docquyen ?? false}
                                onChange={e => setFormData({ ...formData, sub_docquyen: e.target.checked })} />
                            Sub Độc Quyền
                        </label>
                    </div>

                    <div className="divider" />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <h4 className="section-title" style={{ margin: 0 }}>
                            Danh sách tập phim ({formData.episodes.length})
                        </h4>
                    </div>

                    <EpisodeSection
                        episodes={formData.episodes}
                        onChange={handleEpisodeChange}
                        onAdd={handleAddEpisode}
                        onRemove={handleRemoveEpisode}
                    />

                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Lưu Phim</button>
                        <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
}