// src/pages/Home.tsx

import { useNavigate } from 'react-router-dom';
import { useMovieViewModel } from '../../../../viewmodel/MovieViewModel';
import { useEffect } from 'react';
import { MovieCard } from '../../../../shared/components/Card';


export default function Home() {
  const movievm = useMovieViewModel();
  const navigate = useNavigate();
  const movielist = movievm.movielist;  

  useEffect(() => {
    movievm.fetchMovies();
  }, []);
    
  return (
    <div style = {{padding:10}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Home</h1>
        <button onClick={() => {
          localStorage.removeItem('auth_token');
          navigate('/login');
        }}>Đăng xuất</button>
      </div>
      

      <section className="movie-grid">
        
        {movielist.map((movie: any) => (
          <MovieCard
                key={movie.id}
                name={movie.name}
                slug={movie.slug_name}
                imgUrl={movie.poster_url}
                description={movie.description} 
                isSeries={movie.is_series}         
          />
        ))}
      </section>
    </div>
  );
}