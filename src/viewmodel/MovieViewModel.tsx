import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import type {
    MovieCreateDTO,
    MovieDetailResponseDTO,
    MoviePatchDTO,
    MovieResponseDTO
} from "../features/movies/models/movie.dto";

const BASE_URL = "http://localhost:8000/api/v1/movies";
const BASE_MEDIA_URL = "http://localhost:8000";

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

    const fetchMovies = useCallback(async () => {
        try {
            const res = await axios.get(BASE_URL, { headers: getHeaders() });
            setMovieList(res.data.data ?? []);
            for (let i = 0; i < res.data.data.length; i++) {
                console.log("Tim dc thumb: ",res.data.data[i].thumb_url)
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách phim:", error);
        }
    }, []);

    const fetchMoviesBySlug = useCallback(async (slug: string) => {
        try {
            const res = await axios.get(`${BASE_URL}/name/${slug}`, { headers: getHeaders() });
            setMovieDetail(res.data.data ?? null);
        } catch (error) {
            console.error("Lỗi lấy chi tiết phim:", error);
        }
    }, []);

    return { movielist, movie_detail, fetchMoviesBySlug, fetchMovies };
}

// ============================================================
// ViewModel dùng cho trang Admin
// ============================================================
export function useMovieAdminViewModel() {
    const [movielist, setMoviesList] = useState<MovieResponseDTO[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<MovieDetailResponseDTO | null>(null);
    const [deletingMovie, setDeletingMovie] = useState<MovieResponseDTO | null>(null);

    // ---------- FETCH LIST ----------
    const fetchMovies = async () => {
        try {
            const res = await axios.get(BASE_URL, { headers: getHeaders() });
            setMoviesList(res.data.data ?? []);
        } catch (error) {
            console.error("Lỗi lấy danh sách phim:", error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    // ---------- FETCH DETAIL ----------
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

    // ---------- CREATE ----------
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

    // ---------- PATCH ----------
    const updateMovie = async (id: string, patchData: MoviePatchDTO) => {
        try {
            await axios.patch(`${BASE_URL}/patch-movie/${id}`, patchData, { headers: getHeaders() });
            setEditingMovie(null);
            fetchMovies();
            alert("Cập nhật thành công!");
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("Cập nhật thất bại!");
        }
    };

    // ---------- DELETE ----------
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

    const uploadEpisodeVideo = async (
        episodeId: string,
        file: File
    ): Promise<string | null> => {
        if (!editingMovie) {
            alert("Không tìm thấy thông tin phim.");
            return null;
        }

        const movieSlug = editingMovie.slug_name;

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(
                `${BASE_URL}/upload-video/${movieSlug}/${episodeId}`,
                formData,
                {
                    headers: {
                        ...getHeaders(),
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // BE trả về local path VD: "media/movie/the-avengers/ep-id/video.mp4"
            // Normalize backslash (Windows) và ghép thành full URL
            const localPath: string = res.data.data;
            const fullUrl = `${BASE_MEDIA_URL}/${localPath.replace(/\\/g, "/")}`;

            return fullUrl;

        } catch (error) {
            console.error("Lỗi upload video:", error);
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