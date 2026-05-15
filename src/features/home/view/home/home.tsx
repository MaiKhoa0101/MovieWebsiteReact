// src/pages/Home.tsx

import { useMovieViewModel } from '../../../../viewmodel/MovieViewModel';
import { useEffect } from 'react';
import { MovieCard } from '../../../../shared/components/Card';
import { SlideNewMovie } from '../../components/sliding';
import { Topbar } from '../../../../shared/components/topbar/topbar';
import './home.css';

export default function Home() {
  const movievm = useMovieViewModel();
  const movielist = movievm.movielist;

  useEffect(() => {
    movievm.fetchMovies();
  }, []);

  return (
    <div>
      <Topbar />

      <div className="home">

        <SlideNewMovie movie_list={movielist}>

        </SlideNewMovie>


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
    </div>

  );
}