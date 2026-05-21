import { useEffect, useRef, useState } from "react";

interface UseCarouselOptions {
    total: number;
    autoPlayMs?: number; // 0 = tắt auto-play
}

export function useCarousel({ total, autoPlayMs = 5000 }: UseCarouselOptions) {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    const goTo = (index: number) => {
        if (animating || index === current || total <= 1) return;
        clearTimer();
        setAnimating(true);
        setCurrent(index);
        setTimeout(() => setAnimating(false), 600);
    };

    const next = () => goTo((current + 1) % total);
    const prev = () => goTo((current - 1 + total) % total);

    // Auto-play
    useEffect(() => {
        if (autoPlayMs <= 0 || total <= 1) return;
        timerRef.current = setTimeout(next, autoPlayMs);
        return clearTimer;
    }, [current, total, autoPlayMs]);

    return { current, animating, goTo, next, prev };
}


interface HeroSlideProps {
    imageUrl: string;
    isActive: boolean;
}

export function HeroSlide({ imageUrl, isActive }: HeroSlideProps) {
    return (
        <div
            className={`hero-carousel__slide ${isActive ? "hero-carousel__slide--active" : ""}`}
            style={{ "--bg-image": `url(${imageUrl})` } as React.CSSProperties}
        />
    );
}

export function HeroSlideOverlay() {
    return (
        <>
            <div className="hero-carousel__overlay" />
            <div className="hero-carousel__vignette" />
        </>
    );
}


interface SlideContentProps {
    title: string;
    originName?: string;
    description?: string;
    year?: number;
    quality?: string;
    isSeries: boolean;
    onWatch: () => void;
}

export function SlideContent({
    title,
    originName,
    description,
    year,
    quality,
    isSeries,
    onWatch
}: SlideContentProps) {
    return (

        <div className={`hero-carousel__content`}>
            <div className="hero-carousel__meta">
                <span className={isSeries == true?"detail-info-column__badge-series":"detail-info-column__badge-movie"}>{isSeries?"Phim bộ":"Phim lẻ"}</span>

                {year     && <span className="hero-carousel__year">· {year}</span>}
                {quality  && <span className="hero-carousel__quality">· {quality}</span>}
            </div>

            <h2 className="hero-carousel__title">{title}</h2>

            {originName && (
                <p className="hero-carousel__origin">{originName}</p>
            )}

            {description && (
                <p className="hero-carousel__desc">
                    {description.length > 120
                        ? description.slice(0, 120) + "..."
                        : description}
                </p>
            )}

            <div className="hero-carousel__actions">
                <button className="hero-carousel__btn-watch" onClick={onWatch}>
                    Xem Phim
                </button>
            </div>
        </div>
    );
}


interface SlideArrowProps {
    direction: "prev" | "next";
    onClick: () => void;
    disabled?: boolean;
}

export function SlideArrow({ direction, onClick, disabled = false }: SlideArrowProps) {
    return (
        <button
            className={`hero-carousel__arrow hero-carousel__arrow--${direction}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={direction === "prev" ? "Slide trước" : "Slide tiếp"}
        >
            {direction === "prev" ? "‹" : "›"}
        </button>
    );
}

// Dot indicators — active dot giãn ra thành pill
// Tái sử dụng được cho bất kỳ carousel nào

interface SlideDotsProps {
    total: number;
    current: number;
    onDotClick: (index: number) => void;
}

export function SlideDots({ total, current, onDotClick }: SlideDotsProps) {
    return (
        <div className="hero-carousel__dots">
            {Array.from({ length: total }).map((_, i) => (
                <button
                    key={i}
                    className={`hero-carousel__dot ${i === current ? "hero-carousel__dot--active" : ""}`}
                    onClick={() => onDotClick(i)}
                    aria-label={`Chuyển đến slide ${i + 1}`}
                />
            ))}
        </div>
    );
}

// Thanh tiến trình chạy từ 0→100% mỗi khi slide thay đổi
// key={slideKey} ở ngoài để reset animation mỗi lần đổi slide

interface SlideProgressBarProps {
    durationMs?: number; // khớp với interval auto-slide, default 5000ms
}

export function SlideProgressBar({ durationMs = 5000 }: SlideProgressBarProps) {
    return (
        <div
            className="hero-carousel__progress"
            style={{ animationDuration: `${durationMs}ms` }}
        />
    );
}