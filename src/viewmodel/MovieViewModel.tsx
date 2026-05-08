import axios from "axios";
import { useEffect, useState } from "react";
import type { MovieCreateDTO, MoviePatchDTO, MovieResponseDTO } from "../data/movie.types";


export function useMovieViewModel(){

    const [movielist, setMovieList] = useState<MovieResponseDTO[]>([]);
    const token = localStorage.getItem('auth_token');

    async function fetchMovies(){
        if (!token) {
            return;
        }
        try{

            let response = await axios.get('http://localhost:8000/api/v1/movies',{
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            setMovieList(response.data.data)

        }
        catch ( error:any ){
            console.error("Lỗi lấy danh sách phim:", error);
        }

    }

    useEffect(()=>{
        fetchMovies()
    },[token])

    return {
        movielist
    }

}

export function useMovieAdminViewModel() {
  // BÁO CHO REACT: Cái mảng này chỉ được chứa các object có cấu trúc MovieResponseDTO
  const [movielist, setMoviesList] = useState<MovieResponseDTO[]>([]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // Ép kiểu cho biến đang được chọn
  const [editingMovie, setEditingMovie] = useState<MovieResponseDTO | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<MovieResponseDTO | null>(null);

  const token = localStorage.getItem('auth_token');
  const headers = { 'Authorization': `Bearer ${token}` };

  const fetchMovies = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/movies', { headers });
      setMoviesList(res.data.data || res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách", error);
    }
  };

  useEffect(() => { fetchMovies(); }, []);


  


  // Ép kiểu đầu vào phải chuẩn form tạo mới
  const createMovie = async (newMovieData: MovieCreateDTO) => {
    try {
      await axios.post('http://localhost:8000/api/v1/movies/create', newMovieData, { headers });
      setIsCreateOpen(false);
      fetchMovies();
      alert("Tạo phim thành công!");
    } catch (error) {
      console.error("Lỗi tạo phim", error);
    }
  };

  // Ép kiểu đầu vào cho form sửa
  const updateMovie = async (id: string, patchData: MoviePatchDTO) => {
    try {
      await axios.patch(`http://localhost:8000/api/v1/movies/patch-movie/${id}`, patchData, { headers });
      setEditingMovie(null);
      fetchMovies();
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật", error);
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/movies/delete-by-id/${id}`, { headers });
      setDeletingMovie(null);
      fetchMovies();
      alert("Đã xóa phim!");
    } catch (error) {
      console.error("Lỗi xóa phim", error);
    }
  };

  return {
    movielist,
    isCreateOpen, setIsCreateOpen,
    editingMovie, setEditingMovie,
    deletingMovie, setDeletingMovie,
    createMovie, updateMovie, deleteMovie
  };
}