// src/pages/Home.tsx

import { useNavigate } from 'react-router-dom';
// Giả sử bạn đã tách MovieCard ra một file riêng
import '../../App.css'; // Import file CSS Grid lúc nãy
import { MovieCard } from '../components/Card';
import { useMovieViewModel } from '../../viewmodel/MovieViewModel';

export default function Home() {
  const movievm = useMovieViewModel();
  const navigate = useNavigate();
  const movielist = movievm.movielist;  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Home</h1>
        <button onClick={() => {
          localStorage.removeItem('auth_token');
          navigate('/login');
        }}>Đăng xuất</button>
      </div>

      <section className="movie-grid">
        {/* Map dữ liệu từ Backend ra giao diện */}
        {movielist.map((movie: any) => (
          <MovieCard 
                key={movie.id}
                name={movie.name}
                // Căn chỉnh các trường cho khớp với DTO của bạn nhé
                imgUrl={movie.poster_url}
                description={movie.description} 
                isSeries={movie.is_series}          />
        ))}
      </section>
    </div>
  );
}