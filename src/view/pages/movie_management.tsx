import React, { useState } from 'react';
import '../../css/admin.css'; // Móc nối file CSS vào đây
import { useMovieAdminViewModel } from '../../viewmodel/MovieViewModel';
export function MovieManagement() {
    const vm = useMovieAdminViewModel();
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Quản lý Phim</h2>
                <button onClick={() => vm.setIsCreateOpen(true)} className="btn-primary">
                    + Thêm Phim Mới
                </button>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Tên Phim</th>
                        <th>Loại</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {vm.movielist?.map((movie) => (
                        <tr key={movie.id}>
                            <td>{movie.name}</td>
                            <td>{movie.is_series ? "Phim Bộ" : "Phim Lẻ"}</td>

                            <td className="action-cell">
                                <button
                                    onClick={() => setActiveMenuId(activeMenuId === (movie.id) ? null : (movie.id))}
                                    className="btn-icon"
                                >
                                    ...
                                </button>

                                {activeMenuId === (movie.id) && (
                                    <div className="dropdown-menu">
                                        <button
                                            onClick={() => { vm.setEditingMovie(movie); setActiveMenuId(null); }}
                                            className="dropdown-item"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => { vm.setDeletingMovie(movie); setActiveMenuId(null); }}
                                            className="dropdown-item text-danger"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {vm.isCreateOpen && <CreateMovieForm onClose={() => vm.setIsCreateOpen(false)} onSubmit={vm.createMovie} />}
            {vm.editingMovie && <UpdateMovieInfo movie={vm.editingMovie} onClose={() => vm.setEditingMovie(null)} onSubmit={vm.updateMovie} />}
            {vm.deletingMovie && <DeleteMovie movie={vm.deletingMovie} onClose={() => vm.setDeletingMovie(null)} onConfirm={vm.deleteMovie} />}
        </div>
    );
}

// ==========================================
// 2. FORM TẠO PHIM (CREATE)
// ==========================================
export function CreateMovieForm({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => void }) {
    const [formData, setFormData] = useState({
        name: "Brothers Under Fire",
        slug_name: "anh-em-duoi-lan-dan",
        is_series: false,
        poster_url: "https://phimimg.com/upload/vod/20260504-1/b510a8f2a9d592a5be3f5caf7310ece1.jpg",
        description: "Phi đội của Đại úy Jordan Wright...",
        episodes: [{ name_episode: "Trọn bộ", link_video: "https://v7...m3u8", description: "Trọn bộ" }]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Hàm hỗ trợ cập nhật dữ liệu mảng Episodes (Tránh lỗi copy nhầm poster_url lúc trước)
    const handleEpisodeChange = (field: string, value: string) => {
        const newEpisodes = [...formData.episodes];
        newEpisodes[0] = { ...newEpisodes[0], [field]: value };
        setFormData({ ...formData, episodes: newEpisodes });
    };

    return (
        <div className="modal-overlay">
            {/* Lớp phủ bên ngoài */}
            <div className="modal-content">
                <h3 className="modal-title">Tạo Phim Mới</h3>
                
                <form onSubmit={handleSubmit} className="modal-form">
                    <label className="form-label">Tên phim</label>
                    <input placeholder="Nhập tên phim" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="form-input" />
                    
                    <label className="form-label">Tên slug phim</label>
                    <input placeholder="ví-dụ-slug-phim" value={formData.slug_name} onChange={e => setFormData({ ...formData, slug_name: e.target.value })} required className="form-input" />
                    
                    <label className="form-label">Poster phim (URL)</label>
                    <input placeholder="https://..." value={formData.poster_url} onChange={e => setFormData({ ...formData, poster_url: e.target.value })} className="form-input" />
                    
                    <label className="form-label">Mô tả phim</label>
                    <textarea placeholder="Nhập mô tả phim..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-input" rows={3} />

                    <label className="checkbox-label" style={{ marginTop: '5px', marginBottom: '10px' }}>
                        <input type="checkbox" checked={formData.is_series} onChange={e => setFormData({ ...formData, is_series: e.target.checked })} />
                        Đây là Phim Bộ (Nhiều tập)
                    </label>

                    <div className="divider"></div>
                    <h4 className="section-title">Thông tin Tập 1</h4>

                    <label className="form-label">Tên tập phim</label>
                    <input placeholder="Tập 1 / Trọn bộ" value={formData.episodes[0].name_episode} onChange={e => handleEpisodeChange('name_episode', e.target.value)} className="form-input" />
                    
                    <label className="form-label">Link Video (m3u8/mp4)</label>
                    <input placeholder="https://..." value={formData.episodes[0].link_video} onChange={e => handleEpisodeChange('link_video', e.target.value)} className="form-input" />
                    
                    <label className="form-label">Mô tả tập phim</label>
                    <input placeholder="Mô tả tóm tắt tập này" value={formData.episodes[0].description} onChange={e => handleEpisodeChange('description', e.target.value)} className="form-input" />
                    
                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Lưu Phim</button>
                        <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function UpdateMovieInfo({ movie, onClose, onSubmit }: { movie: any, onClose: () => void, onSubmit: (id: string, data: any) => void }) {
    const [formData, setFormData] = useState({
        name: movie.name || '',
        slug_name: movie.slug_name || '',
        is_series: movie.is_series || false,
        poster_url: movie.poster_url || '',
        description: movie.description || '',
        episodes: movie.episodes || [] // Lấy mảng tập phim từ BE gửi về
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(movie.id || movie._id, formData);
    };

    // Hàm cập nhật riêng lẻ từng trường của một tập phim xác định bằng vị trí (index)
    const handleEpisodeChange = (index: number, field: string, value: string) => {
        const newEpisodes = [...formData.episodes];
        newEpisodes[index] = { ...newEpisodes[index], [field]: value };
        setFormData({ ...formData, episodes: newEpisodes });
    };

    // Hàm thêm một tập phim trống mới vào mảng
    const handleAddEpisode = () => {
        setFormData({
            ...formData,
            episodes: [...formData.episodes, { name_episode: "", link_video: "", description: "" }]
        });
    };

    // Hàm xóa bớt một tập phim
    const handleRemoveEpisode = (indexToRemove: number) => {
        const newEpisodes = formData.episodes.filter((_: any, index: number) => index !== indexToRemove);
        setFormData({ ...formData, episodes: newEpisodes });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">Sửa Thông Tin Phim</h3>
                <form onSubmit={handleSubmit} className="modal-form">
                    
                    <label className="form-label">Tên phim</label>
                    <input placeholder="Tên phim" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="form-input" />
                    
                    <label className="form-label">Tên slug phim</label>
                    <input placeholder="Tên slug" value={formData.slug_name} onChange={e => setFormData({ ...formData, slug_name: e.target.value })} required className="form-input" />

                    <label className="form-label">Poster phim (URL)</label>
                    <input placeholder="https://..." value={formData.poster_url} onChange={e => setFormData({ ...formData, poster_url: e.target.value })} className="form-input" />
                    
                    <label className="form-label">Mô tả phim</label>
                    <textarea placeholder="Nhập mô tả phim..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-input" rows={3} />

                    <label className="checkbox-label" style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <input type="checkbox" checked={formData.is_series} onChange={e => setFormData({ ...formData, is_series: e.target.checked })} />
                        Đây là Phim Bộ (Nhiều tập)
                    </label>

                    <div className="divider"></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 className="section-title" style={{ margin: 0 }}>Danh sách tập phim</h4>
                        {formData.is_series && (
                            <button type="button" onClick={handleAddEpisode} style={{ padding: '4px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                + Thêm Tập Mới
                            </button>
                        )}
                    </div>

                    {formData.episodes.map((episode: any, index: number) => (
                        <div key={index} style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '10px', position: 'relative' }}>
                            
                            <h5 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Tập {index + 1}</h5>
                            
                            {/* Nút xóa tập (X) góc phải */}
                            <button type="button" onClick={() => handleRemoveEpisode(index)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input placeholder="Tên tập (VD: Tập 1, Trọn bộ...)" value={episode.name_episode} onChange={e => handleEpisodeChange(index, 'name_episode', e.target.value)} className="form-input" required/>
                                <input placeholder="Link Video (m3u8...)" value={episode.link_video || ''} onChange={e => handleEpisodeChange(index, 'link_video', e.target.value)} className="form-input" />
                                <input placeholder="Mô tả tập này..." value={episode.description || ''} onChange={e => handleEpisodeChange(index, 'description', e.target.value)} className="form-input" />
                            </div>
                        </div>
                    ))}

                    {formData.episodes.length === 0 && (
                        <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>Chưa có tập phim nào.</p>
                    )}

                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Cập nhật</button>
                        <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ==========================================
// 4. XÁC NHẬN XÓA (DELETE)
// ==========================================
export function DeleteMovie({ movie, onClose, onConfirm }: { movie: any, onClose: () => void, onConfirm: (id: string) => void }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ minWidth: '350px' }}>
                <h3 className="modal-title text-danger">Cảnh báo Xóa</h3>
                <p style={{ marginTop: '10px' }}>Bạn có chắc chắn muốn xóa phim: <strong className="text-danger">{movie.name}</strong>?</p>
                <div className="modal-actions" style={{ marginTop: '24px' }}>
                    <button onClick={() => onConfirm(movie.id || movie._id)} className="btn-danger">Xóa luôn</button>
                    <button onClick={onClose} className="btn-cancel">Hủy</button>
                </div>
            </div>
        </div>
    );
}