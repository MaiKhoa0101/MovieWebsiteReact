import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovieViewModel } from "../../../../../viewmodel/MovieViewModel";
import type { EpisodeResponseDTO } from "../../../models/movie.dto";
import { EpisodePlayer } from "./movie_player";
import "./DetailMovie.css";

export default function DetailMovie() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const movievm = useMovieViewModel();
    const movie = movievm.movie_detail;

    const [isPlaying, setIsPlaying] = useState(false);
    const [activeServer, setActiveServer] = useState<string | null>(null);
    const [currentEpisode, setCurrentEpisode] = useState<EpisodeResponseDTO | null>(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (slug) movievm.fetchMoviesBySlug(slug);
    }, [slug]);

    useEffect(() => {
        if (movie?.episodes?.length) {
            setCurrentEpisode(movie.episodes[0]);
            setActiveServer(movie.episodes[0].server_name ?? null);
        }
    }, [movie]);

    // Group episodes by server_name
    const serverGroups: Record<string, EpisodeResponseDTO[]> = {};
    movie?.episodes?.forEach(ep => {
        const key = ep.server_name ?? "Server mặc định";
        if (!serverGroups[key]) serverGroups[key] = [];
        serverGroups[key].push(ep);
    });
    const serverNames = Object.keys(serverGroups);
    const videoUrl = currentEpisode?.link_m3u8 || currentEpisode?.link_embed || "";

    // ── Loading ──────────────────────────────────────────────
    if (!movie) {
        return (
            <div className="detail-loading">
                <div className="detail-spinner" />
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    // ── Page ─────────────────────────────────────────────────
    return (
        <div className="detail-page">

            {/* BACK */}
            <button className="detail-back-btn" onClick={() => navigate(-1)}>‹</button>

            {/* HERO */}
            <div
                className="detail-hero"
                style={{ backgroundImage: `url(${movie.thumb_url || movie.poster_url})` }}
            >
                <div className="detail-hero__overlay" />
                <div className="detail-hero__gradient" />
                <h1 className="detail-hero__title">{movie.name}</h1>
                {movie.origin_name && (
                    <h2 className="detail-hero__subtitle">{movie.origin_name}</h2>
                )}
            </div>

            {/* CONTENT */}
            <div className="detail-content">

                {/* POSTER */}
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
                </div>

                {/* PLAYER */}
                {isPlaying && videoUrl && (
                    <div className="detail-player-wrap">
                        <EpisodePlayer videoUrl={videoUrl} />
                    </div>
                )}

                {/* CTA */}
                <div className="detail-cta-group">
                    <button className="detail-btn-watch" onClick={() => setIsPlaying(true)}>
                        ▶ Xem Phim
                    </button>
                    <div className="detail-btn-row-secondary">
                        <button className="detail-btn-save">🔖 Lưu vào bộ sưu tập</button>
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

                {/* SERVER + EPISODE SELECTOR */}
                {serverNames.length > 0 && (
                    <div className="detail-section">
                        <div className="detail-section__header">
                            <div className="detail-section__accent" />
                            <span className="detail-section__title">Chọn tập</span>
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
                                        setCurrentEpisode(serverGroups[name][0]);
                                    }}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>

                        {activeServer && serverGroups[activeServer]?.length > 1 && (
                            <div className="detail-episode-list">
                                {serverGroups[activeServer].map(ep => (
                                    <button
                                        key={ep.id}
                                        className={`detail-ep-btn ${currentEpisode?.id === ep.id ? "detail-ep-btn--active" : ""}`}
                                        onClick={() => { setCurrentEpisode(ep); setIsPlaying(true); }}
                                    >
                                        {ep.name_episode}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* DESCRIPTION */}
                <div className="detail-section">
                    <div className="detail-section__header">
                        <div className="detail-section__accent" />
                        <span className="detail-section__title">Nội Dung Phim</span>
                    </div>
                    <p className={`detail-description ${expanded ? "detail-description--expanded" : "detail-description--collapsed"}`}>
                        {movie.description ?? "Chưa có mô tả."}
                    </p>
                    {(movie.description?.length ?? 0) > 200 && (
                        <button className="detail-expand-btn" onClick={() => setExpanded(p => !p)}>
                            {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
                        </button>
                    )}
                </div>

                {/* TAGS */}
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