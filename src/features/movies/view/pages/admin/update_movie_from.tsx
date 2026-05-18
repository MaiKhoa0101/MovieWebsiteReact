import { useState } from "react";
import type { EpisodeCreateDTO, EpisodeResponseDTO, MovieDetailResponseDTO, MoviePatchDTO } from "../../../models/movie.dto";
import { EpisodeFormBlock } from "../../components/episode_form";
import { defaultEpisode } from "./create_movie_form";

export function UpdateMovieInfo({
    movie,
    onClose,
    onSubmit,
    onUploadVideo,
}: {
    movie: MovieDetailResponseDTO;
    onClose: () => void;
    onSubmit: (id: string, data: MoviePatchDTO) => void;
    // Nhận hàm upload từ ViewModel
    onUploadVideo: (episodeId: string, file: File) => Promise<string | null>;
}) {
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

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">Sửa Thông Tin Phim</h3>
                <form onSubmit={handleSubmit} className="modal-form">

                    <label className="form-label">Tên phim *</label>
                    <input className="form-input" required
                        value={formData.name ?? ""}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} />

                    <label className="form-label">Tên gốc</label>
                    <input className="form-input" placeholder="Tên tiếng nước ngoài"
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

                    {/* DANH SÁCH TẬP */}
                    <div className="divider" />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 className="section-title" style={{ margin: 0 }}>
                            Danh sách tập phim ({formData.episodes?.length ?? 0})
                        </h4>
                        <button type="button" onClick={handleAddEpisode}
                            style={{
                                padding: "4px 10px", backgroundColor: "#10b981", color: "white",
                                border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px"
                            }}>
                            + Thêm Tập
                        </button>
                    </div>

                    {(formData.episodes ?? []).length === 0 && (
                        <p style={{ fontSize: "13px", color: "#64748b", fontStyle: "italic", textAlign: "center" }}>
                            Chưa có tập phim nào.
                        </p>
                    )}

                    {(formData.episodes ?? []).map((ep, index) => {
                        // Lấy id của episode nếu đang edit (EpisodeResponseDTO có id)
                        const epId = (ep as EpisodeResponseDTO).id ?? undefined;
                        return (
                            <EpisodeFormBlock
                                key={epId ?? index}
                                index={index}
                                episode={ep}
                                onChange={handleEpisodeChange}
                                onRemove={handleRemoveEpisode}
                                // Truyền episodeId và handler upload xuống
                                episodeId={epId}
                                onUploadVideo={onUploadVideo}
                            />
                        );
                    })}

                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Cập nhật</button>
                        <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
}