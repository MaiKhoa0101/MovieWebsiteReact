// ==========================================
// 1. EPISODE TYPES
// ==========================================
export interface EpisodeBaseDTO {
  name_episode: string;
  link_video?: string; // Dấu '?' tương đương với Optional trong Python
  description?: string;
}

export interface EpisodeCreateDTO extends EpisodeBaseDTO {}

export interface EpisodeResponseDTO extends EpisodeBaseDTO {
  id: string;
  id_movie: string;
  created_at?: string; // Python datetime trả về JSON dưới dạng chuỗi (ISO string)
  updated_at?: string;
}

// ==========================================
// 2. MOVIE TYPES
// ==========================================
export interface MovieBaseDTO {
  name: string;
  slug_name: string;
  is_series: boolean;
  description?: string;
  poster_url?: string;
}

export interface MovieCreateDTO extends MovieBaseDTO {
  episodes: EpisodeCreateDTO[];
}

export interface MoviePatchDTO {
  name?: string;
  slug_name?: string;
  is_series?: boolean;
  description?: string;
  poster_url?: string;
  episodes?: EpisodeCreateDTO[];
}

export interface MovieResponseDTO extends MovieBaseDTO {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface MovieDetailResponseDTO extends MovieResponseDTO {
  episodes: EpisodeResponseDTO[];
}