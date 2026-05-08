import axios from "axios";
import { useEffect, useState } from "react";


export function useMovieViewModel(){

    const [movielist, setMovieList] = useState([])
    
    async function fetchMovies(){
        const token = localStorage.getItem('auth_token');
        if (!token) {
            return;
        }
        try{

            let response = await axios.get('http://localhost:8000/api/v1/movies',{
                headers: {
                    'Authorization': `Bearer ${token}` // Đây là lúc Frontend khớp nối với HTTPBearer() ở Backend
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
    })

    return {
        movielist
    }

}