import { useNavigate } from "react-router-dom";

import "./sliding.css";
import type { MovieResponseDTO } from "../../movies/models/movie.dto";
import { HeroSlide, HeroSlideOverlay, SlideArrow, SlideContent, SlideDots, SlideProgressBar, useCarousel } from "../../../shared/components/Carousel";

interface SlideNewMovieProps {
    movie_list: MovieResponseDTO[];
}

const AUTO_PLAY_MS = 5000;

export function SlideNewMovie({ movie_list }: SlideNewMovieProps) {
    const navigate = useNavigate();
    const { current, next, prev, goTo } = useCarousel({
        total: movie_list.length,
        autoPlayMs: AUTO_PLAY_MS,
    });
 
    if (!movie_list.length) return null;
    
    const movie = movie_list[current];
 
    return (
        <div className="hero-carousel">

            {movie_list.map((m, i) => (
                <HeroSlide
                    key={m.id}
                    imageUrl={m.thumb_url || m.poster_url || ""}
                    isActive={i === current}
                />
                
            ))} 
            <HeroSlideOverlay />

            <SlideContent
                key={current}
                title={movie.name}
                originName={movie.origin_name}
                description={movie.description}
                year={movie.year}
                quality={movie.quality}
                isSeries={movie.is_series}
                onWatch={() => navigate(`/detail/${movie.slug_name}`)}
            />
 
            {movie_list.length > 1 && (
                <>
                    <SlideArrow direction="prev" onClick={prev} />
                    <SlideArrow direction="next" onClick={next} />
                </>
            )}
 
            {movie_list.length > 1 && (
                <SlideDots
                    total={movie_list.length}
                    current={current}
                    onDotClick={goTo}
                />
            )}
 
            {/* <SlideProgressBar key={`progress-${current}`} durationMs={AUTO_PLAY_MS} /> */}
        </div>
    );
}