import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovieViewModel } from "../../../../../viewmodel/MovieViewModel";
import type { EpisodeResponseDTO, MovieDetailResponseDTO } from "../../../models/movie.dto";
import { MediaPlayer } from "./movie_player";
import "./detail_page.css";
import { MdPlayArrow } from "react-icons/md";




export default function DetailMovie() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const movievm = useMovieViewModel();
    const movie = movievm.movie_detail;

    const [isPlaying, setIsPlaying] = useState(false);
    const [activeServer, setActiveServer] = useState<string | null>(null);
    const [currentEpisode, setCurrentEpisode] = useState<EpisodeResponseDTO | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

    useEffect(() => {
        if (slug) movievm.fetchMoviesBySlug(slug);
    }, [slug]);

    useEffect(() => {
        if (movie?.episodes?.length) {
            setCurrentEpisode(movie.episodes[0]);
            setActiveServer(movie.episodes[0].server_name ?? null);
        }
    }, [movie]);

    const serverGroups: Record<string, EpisodeResponseDTO[]> = {};
    movie?.episodes?.forEach(ep => {
        const key = ep.server_name ?? "Server mặc định";
        if (!serverGroups[key]) serverGroups[key] = [];
        serverGroups[key].push(ep);
    });

    // Sắp xếp từng server theo số trong name_episode
    const extractEpNumber = (name: string): number => {
        const match = name.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    };

    Object.keys(serverGroups).forEach(key => {
        serverGroups[key].sort((a, b) =>
            extractEpNumber(a.name_episode) - extractEpNumber(b.name_episode)
        );
    });
    const serverNames = Object.keys(serverGroups);
    const videoUrl = currentEpisode?.link_embed || currentEpisode?.link_m3u8 || "";

    if (!movie) {
        return (
            <div className="detail-loading">
                <div className="detail-spinner" />
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="detail-page">

            <button className="detail-back-btn" onClick={() => navigate(-1)}>‹</button>


            { !isTrailerPlaying &&( 
                    
                <div
                    className="detail-hero"
                    style={{ backgroundImage: `url(${movie.thumb_url || movie.poster_url}   )` }}
                >   
                    
                    <div className="detail-hero__overlay" />
                    <div className="detail-hero__gradient" />
                    { movie.trailer_url&&(
                        <div className="detail-hero__button-trailer">
                            <MdPlayArrow style={{ scale: 10 }} onClick={() => setIsTrailerPlaying(true)}  />
                        </div>
                        )
                    }

                </div>
            )}
            { isTrailerPlaying && movie.trailer_url &&( 
                
                <div
                    className="detail-hero"
                    style={{ backgroundImage: `url(${movie.thumb_url || movie.poster_url})` }}
                >    
                    <iframe style={{background:`${movie.thumb_url}`}}
                        src={getAutoplayUrl(movie.trailer_url)} 
                        className="detail-hero__iframe"
                        allow="autoplay; fullscreen"
                        title="Trailer"
                    ></iframe>
                    <div className="detail-hero__gradient" />

                </div>
            )}

            <div className="detail-content">
                <div className="detail-info-row">
                    <div className="detail-poster-wrap">
                        <img
                            className="detail-poster"
                            src={movie.poster_url ?? ""}
                            alt={movie.name}
                            onError={e => {
                                (e.target as HTMLImageElement).src =
                                    "https://via.placeholder.com/120x170/1e293b/475569?text=No+Image";
                            }}
                        />
                    </div>
                    <div className="detail-info-column">
                        
                        <span className={movie.is_series == true?"detail-info-column__badge-series":"detail-info-column__badge-movie"}>{movie.is_series?"Phim bộ":"Phim lẻ"}</span>
                        
                        <h1 className="detail-info-column__title">{movie.name}</h1>
                        
                        {movie.origin_name && (
                            <h2 className="detail-info-column__subtitle">{movie.origin_name}</h2>
                        )}
                        
                        <h2 style={{
                                textTransform:"uppercase", 
                                color:`${movie.status=="completed"?"lightgreen":"yellow"}`,
                                fontSize: "12px"
                            }} 
                            className="detail-info-column__subtitle">
                            {movie.status?movie.status:"Chưa cập nhật"}
                        </h2>
                    </div>
                </div>

                {isPlaying && videoUrl && (
                    <div className="detail-player-wrap">
                        <MediaPlayer videoUrl={videoUrl} />
                    </div>
                )}

                <div className="detail-cta-group">
                    <button className="detail-btn-watch" onClick={() => setIsPlaying(true)}>
                        Xem phim
                    </button>
                    <div className="detail-btn-row-secondary">
                        <button className="detail-btn-save">Lưu vào bộ sưu tập</button>
                    </div>
                </div>

                {/* STATS BAR */}
                <div className="detail-stats-bar">
                    {[
                        { value: movie.year            ?? "—", label: "Năm"        },
                        { value: movie.quality         ?? "—", label: "Chất lượng" },
                        { value: movie.lang            ?? "—", label: "Ngôn ngữ"   },
                        { value: movie.episode_current ?? "—", label: "Tập"        },
                    ].map((item, i) => (
                        <div key={i} className="detail-stat-item">
                            <span className="detail-stat-value">{item.value}</span>
                            <span className="detail-stat-label">{item.label}</span>
                        </div>
                    ))}
                </div>

                {serverNames.length > 0 && (
                    <div className="detail-section">
                        <div className="detail-section__header">
                            <div className="detail-section__accent" />
                            <span className="detail-section__title">Chọn server</span>
                            <span className="detail-section__sub">
                                {serverNames.length}/{serverNames.length} server
                            </span>
                        </div>

                        <div className="detail-server-list">
                            {serverNames.map(name => (
                                <button
                                    key={name}
                                    className={`detail-server-btn ${activeServer === name ? "detail-server-btn--active" : ""}`}
                                    onClick={() => {
                                        setActiveServer(name);
                                        const firstEp = serverGroups[name][0];
                                        setCurrentEpisode(firstEp);
                                    }}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>

                        {activeServer && serverGroups[activeServer]?.length >= 1 && (
                            <div className="detail-episode-list">
                                {serverGroups[activeServer].map(ep => (
                                    <button
                                        key={ep.id}
                                        className={`detail-ep-btn ${currentEpisode?.id === ep.id ? "detail-ep-btn--active" : ""}`}
                                        onClick={() => { setCurrentEpisode(ep);}}
                                    >
                                        {ep.name_episode}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="detail-section">
                    <div className="detail-section__header">
                        <div className="detail-section__accent" />
                        <span className="detail-section__title">Nội Dung Phim</span>
                    </div>
                    <p className={`detail-description`}>
                        {movie.description ?? "Chưa có mô tả."}
                    </p>
                </div>

                {(movie.categories?.length > 0 || movie.countries?.length > 0) && (
                    <div className="detail-tags-section">
                        {movie.categories?.map(c => (
                            <span key={c.id} className="detail-tag">{c.name}</span>
                        ))}
                        {movie.countries?.map(c => (
                            <span key={c.id} className="detail-tag detail-tag--country">{c.name}</span>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

const getAutoplayUrl = (url:string) => {
  if (!url) return "";
  // Nếu URL đã có dấu hỏi chấm (?) thì nối bằng dấu &, ngược lại nối bằng dấu ?
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}autoplay=1&mute=1`;
};