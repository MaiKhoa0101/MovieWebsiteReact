import { useEffect, useRef } from "react";
import Hls from "hls.js";

function HLSPlayer({ url }: { url: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (Hls.isSupported()) {
            const hls = new Hls({ maxBufferLength: 30 });
            hls.loadSource(url);
            hls.attachMedia(video);
            return () => hls.destroy();
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
        }
    }, [url]);

    return (
        <video
            ref={videoRef}
            controls
            autoPlay
            width="100%"
            style={{ display: "block", background: "#000", aspectRatio: "16/9" }}
        />
    );
}

export function MediaPlayer({ videoUrl }: { videoUrl: string }) {
    if (!videoUrl) return null;

    const isEmbed =
        videoUrl.includes("player.phimapi.com") ||
        videoUrl.includes("/player/") ||
        videoUrl.includes("player?url=");

    const isHLS = videoUrl.endsWith(".m3u8");

    if (isEmbed) {
        return (
            <iframe
                src={videoUrl}
                width="100%"
                allowFullScreen
                allow="autoplay; encrypted-media"
                style={{ border: "none", display: "block", aspectRatio: "16/9" }}
            />
        );
    }

    if (isHLS) return <HLSPlayer url={videoUrl} />;

    return (
        <video
            controls
            width="100%"
            style={{ display: "block", background: "#000", aspectRatio: "16/9" }}
        >
            <source src={videoUrl} type="video/mp4" />
        </video>
    );
}