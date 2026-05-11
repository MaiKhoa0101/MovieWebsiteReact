import axios from "axios";
import { useEffect, useState } from "react";
import type { MovieCreateDTO, MovieDetailResponseDTO, MoviePatchDTO, MovieResponseDTO } from "../features/movies/models/movie.dto";


const BASE_URL = "http://localhost:8000/api/v1/movies";

function getHeaders() {
    const token = localStorage.getItem("auth_token");
    return { Authorization: `Bearer ${token}` };
}

// ==========================================
// ViewModel dùng cho trang xem phim (user)
// ==========================================
export function useMovieViewModel() {
    const [movielist, setMovieList] = useState<MovieResponseDTO[]>([]);

    async function fetchMovies() {
        try {
            const res = await axios.get(BASE_URL, { headers: getHeaders() });
            setMovieList(res.data.data ?? []);
        } catch (error) {
            console.error("Lỗi lấy danh sách phim:", error);
        }
    }

    useEffect(() => {
        fetchMovies();
    }, []);

    return { movielist };
}

// ==========================================
// ViewModel dùng cho trang Admin
// ==========================================
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

    // ---------- FETCH DETAIL (có episodes, external_ids) ----------
    const fetchMovieById = async (id: string): Promise<MovieDetailResponseDTO | null> => {
        try {
            const res = await axios.get(`${BASE_URL}/id/${id}`, { headers: getHeaders() });
            return res.data.data ?? res.data;
        } catch (error) {
            console.error("Lỗi lấy chi tiết phim:", error);
            return null;
        }
    };

    // Khi bấm nút Sửa: fetch detail trước để lấy đủ episodes
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

    return {
        movielist,
        isCreateOpen, setIsCreateOpen,
        editingMovie, setEditingMovie,
        deletingMovie, setDeletingMovie,
        openEditMovie,
        createMovie, updateMovie, deleteMovie,
    };
}