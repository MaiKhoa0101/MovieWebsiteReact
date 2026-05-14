export function EpisodePlayer({ videoUrl }: { videoUrl: string }) {
    if (!videoUrl) return null;
    const isEmbed =
        videoUrl.includes("player.phimapi.com") ||
        videoUrl.includes("/player/") ||
        videoUrl.includes("player?url=");

    if (isEmbed) {
        return (
            <iframe
                src={videoUrl}
                width="100%"
                height="100%"
                allowFullScreen
                allow="autoplay; encrypted-media"
                style={{ border: "none", display: "block" }}
            />
        );
    }
    return (
        <video controls width="100%" height="100%" style={{ display: "block", background: "#000" }}>
            <source src={videoUrl} type="video/mp4" />
        </video>
    );
}