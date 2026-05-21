import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import type {
    MovieCreateDTO,
    MovieDetailResponseDTO,
    MoviePatchDTO,
    MovieResponseDTO
} from "../features/movies/models/movie.dto";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_MEDIA_URL = import.meta.env.VITE_BASE_MEDIA_URL;

function getHeaders() {
    const token = localStorage.getItem("auth_token");
    return { Authorization: `Bearer ${token}` };
}

// ============================================================
// ViewModel dùng cho trang xem phim (user)
// ============================================================
export function useMovieViewModel() {
    const [movielist, setMovieList] = useState<MovieResponseDTO[]>([]);
    const [movie_detail, setMovieDetail] = useState<MovieDetailResponseDTO | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchMovies = useCallback(async () => {
        try {
            const res = await axios.get(BASE_URL, { headers: getHeaders() });
            setMovieList(res.data.data ?? []);
        } catch (error) {
            console.error("Lỗi lấy danh sách phim:", error);
        }
    }, []);

    const fetchMoviesBySlug = useCallback(async (slug: string, token?: string | null) => {
        try {
            if (!token) return;
            setError(null);
            const res = await axios.get(
                `${BASE_URL}/name/${slug}`,
                { headers: { ...getHeaders(), Authorization: `Bearer ${token}` } }
            );
            setMovieDetail(res.data.data ?? null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const backendMessage =
                        error.response.data?.detail ||
                        error.response.data?.message ||
                        "Lỗi từ máy chủ!";
                    if (error.response.status === 401)
                        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    else if (error.response.status === 404)
                        setError("Không tìm thấy bộ phim này.");
                    else
                        setError(backendMessage);
                } else if (error.request) {
                    setError("Không thể kết nối đến máy chủ. Kiểm tra lại đường truyền mạng.");
                } else {
                    setError("Lỗi hệ thống khi gửi yêu cầu.");
                }
            } else {
                setError("Đã xảy ra lỗi không xác định.");
            }
        }
    }, []);

    return { movielist, movie_detail, fetchMoviesBySlug, fetchMovies, error };
}

// ============================================================
// ViewModel dùng cho trang Admin
// ============================================================
export function useMovieAdminViewModel() {
    const [movielist, setMoviesList] = useState<MovieResponseDTO[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<MovieDetailResponseDTO | null>(null);
    const [deletingMovie, setDeletingMovie] = useState<MovieResponseDTO | null>(null);

    // ── FETCH LIST ──
    const fetchMovies = async () => {
        try {
            const res = await axios.get(BASE_URL, { headers: getHeaders() });
            setMoviesList(res.data.data ?? []);
        } catch (error) {
            console.error("Lỗi lấy danh sách phim:", error);
        }
    };

    useEffect(() => { fetchMovies(); }, []);

    // ── FETCH DETAIL ──
    const fetchMovieById = async (id: string): Promise<MovieDetailResponseDTO | null> => {
        try {
            const res = await axios.get(`${BASE_URL}/id/${id}`, { headers: getHeaders() });
            return res.data.data ?? res.data;
        } catch (error) {
            console.error("Lỗi lấy chi tiết phim:", error);
            return null;
        }
    };

    const openEditMovie = async (movie: MovieResponseDTO) => {
        const detail = await fetchMovieById(movie.id);
        setEditingMovie(detail);
    };

    // ── CREATE ──
    const createMovie = async (newMovieData: MovieCreateDTO) => {
        try {
            await axios.post(`${BASE_URL}/create`, newMovieData, { headers: getHeaders() });
            setIsCreateOpen(false);
            fetchMovies();
            alert("Tạo phim thành công!");
        } catch (error) {
            console.error("Lỗi tạo phim:", error);
            alert("Tạo phim thất bại!");
        }
    };

    // ── PATCH ──
    // Nhận MoviePatchDTO — có thể chứa episodes (purge + re-insert) hoặc không (chỉ info)
    const updateMovie = async (id: string, patchData: MoviePatchDTO) => {
        try {
            await axios.patch(`${BASE_URL}/patch-movie/${id}`, patchData, { headers: getHeaders() });
            // Reload detail để tempEpisodes ở UpdateMovieInfo nhận dữ liệu mới khi mở lại
            const updated = await fetchMovieById(id);
            if (updated) setEditingMovie(updated);
            fetchMovies();
            alert("Cập nhật thành công!");
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("Cập nhật thất bại!");
        }
    };

    // ── DELETE ──
    const deleteMovie = async (id: string) => {
        try {
            await axios.delete(`${BASE_URL}/delete-by-id/${id}`, { headers: getHeaders() });
            setDeletingMovie(null);
            fetchMovies();
            alert("Đã xóa phim!");
        } catch (error) {
            console.error("Lỗi xóa phim:", error);
            alert("Xóa phim thất bại!");
        }
    };

    // ── UPLOAD VIDEO HLS ──
    // Chỉ cần movieSlug + episodeSlug — không cần episodeId
    // Backend tra cứu episode bằng slug, lưu vào media/movie/{movieSlug}/{episodeSlug}/hls/
    const uploadEpisodeVideo = async (
        movieSlug: string,
        episodeSlug: string,
        file: File
    ): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(
                `${BASE_URL}/upload-video-hls/${movieSlug}/${episodeSlug}`,
                formData,
                { headers: { ...getHeaders(), "Content-Type": "multipart/form-data" } }
            );

            // BE trả relative path: "movie/the-avengers/tap-1/hls/index.m3u8"
            const localPath: string = res.data.data;
            return `${BASE_MEDIA_URL}/${localPath.replace(/\\/g, "/")}`;

        } catch (error) {
            console.error("Lỗi upload video:", error);
            alert("Upload thất bại!");
            return null;
        }
    };

    return {
        movielist,
        isCreateOpen, setIsCreateOpen,
        editingMovie, setEditingMovie,
        deletingMovie, setDeletingMovie,
        openEditMovie,
        createMovie, updateMovie, deleteMovie,
        uploadEpisodeVideo,
    };
}