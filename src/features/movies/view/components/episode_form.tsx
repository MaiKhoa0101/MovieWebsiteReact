import type { EpisodeCreateDTO } from "../../models/movie.dto";

export function EpisodeFormBlock({
    index,
    episode,
    onChange,
    onRemove,
}: {
    index: number;
    episode: EpisodeCreateDTO;
    onChange: (index: number, field: keyof EpisodeCreateDTO, value: string) => void;
    onRemove: (index: number) => void;
}) {
    return (
        <div style={{ backgroundColor: "#0f172a", padding: "15px", borderRadius: "8px",
            border: "1px solid #334155", marginBottom: "10px", position: "relative" }}>
            <h5 style={{ margin: "0 0 10px 0", color: "#94a3b8" }}>Tập {index + 1}</h5>
            <button type="button" onClick={() => onRemove(index)}
                style={{ position: "absolute", top: "10px", right: "10px", background: "none",
                    border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "bold" }}>
                ✕
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <input className="form-input" placeholder="Tên tập (VD: Tập 1, Full...)" required
                    value={episode.name_episode}
                    onChange={e => onChange(index, "name_episode", e.target.value)} />
                <input className="form-input" placeholder="Server name (VD: #HN Vietsub)"
                    value={episode.server_name ?? ""}
                    onChange={e => onChange(index, "server_name", e.target.value)} />
                <input className="form-input" placeholder="Slug (VD: tap-1, full)"
                    value={episode.slug ?? ""}
                    onChange={e => onChange(index, "slug", e.target.value)} />
                <input className="form-input" placeholder="Filename"
                    value={episode.filename ?? ""}
                    onChange={e => onChange(index, "filename", e.target.value)} />
                <input className="form-input" placeholder="Link Embed (https://player...)"
                    value={episode.link_embed ?? ""}
                    onChange={e => onChange(index, "link_embed", e.target.value)} />
                <input className="form-input" placeholder="Link M3U8 (https://...index.m3u8)"
                    value={episode.link_m3u8 ?? ""}
                    onChange={e => onChange(index, "link_m3u8", e.target.value)} />
                <input className="form-input" placeholder="Mô tả tập"
                    value={episode.description ?? ""}
                    onChange={e => onChange(index, "description", e.target.value)} />
            </div>
        </div>
    );
}