import React, { useState } from "react";
import "./movie_management.css";
import { useMovieAdminViewModel } from "../../../../viewmodel/MovieViewModel";
import type { EpisodeCreateDTO, MovieCreateDTO, MovieDetailResponseDTO, MoviePatchDTO, MovieResponseDTO } from "../../models/movie.dto";
import { CreateMovieForm } from "./create_movie_form";
import { UpdateMovieInfo } from "./update_movie_from";
import { DeleteMovie } from "./delete_movie_form";

// ==========================================
// 1. DANH SÁCH PHIM
// ==========================================
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
                        <th>Tên gốc</th>
                        <th>Loại</th>
                        <th>Năm</th>
                        <th>Chất lượng</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {vm.movielist?.map((movie) => (
                        <tr key={movie.id}>
                            <td>{movie.name}</td>
                            <td>{movie.origin_name ?? "—"}</td>
                            <td>{movie.is_series ? "Phim Bộ" : "Phim Lẻ"}</td>
                            <td>{movie.year ?? "—"}</td>
                            <td>{movie.quality ?? "—"}</td>
                            <td>{movie.status ?? "—"}</td>
                            <td className="action-cell">
                                <button
                                    onClick={() =>
                                        setActiveMenuId(activeMenuId === movie.id ? null : movie.id)
                                    }
                                    className="btn-icon"
                                >
                                    ...
                                </button>
                                {activeMenuId === movie.id && (
                                    <div className="dropdown-menu">
                                        <button
                                            onClick={() => {
                                                vm.openEditMovie(movie);
                                                setActiveMenuId(null);
                                            }}
                                            className="dropdown-item"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => {
                                                vm.setDeletingMovie(movie);
                                                setActiveMenuId(null);
                                            }}
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

            {vm.isCreateOpen && (
                <CreateMovieForm
                    onClose={() => vm.setIsCreateOpen(false)}
                    onSubmit={vm.createMovie}
                />
            )}
            {vm.editingMovie && (
                <UpdateMovieInfo
                    movie={vm.editingMovie}
                    onClose={() => vm.setEditingMovie(null)}
                    onSubmit={vm.updateMovie}
                />
            )}
            {vm.deletingMovie && (
                <DeleteMovie
                    movie={vm.deletingMovie}
                    onClose={() => vm.setDeletingMovie(null)}
                    onConfirm={vm.deleteMovie}
                />
            )}
        </div>
    );
}


