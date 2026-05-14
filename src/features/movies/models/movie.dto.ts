// ==========================================
// 1. LOOKUP TYPES
// ==========================================
export interface ActorDTO {
  id: string;
  name: string;
  slug?: string;
}

export interface DirectorDTO {
  id: string;
  name: string;
  slug?: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug?: string;
}

export interface CountryDTO {
  id: string;
  name: string;
  slug?: string;
}

// ==========================================
// 2. EXTERNAL IDs TYPES
// ==========================================
export interface MovieExternalIdsCreateDTO {
  tmdb_type?: string;
  tmdb_id?: string;
  tmdb_season?: number | null;
  tmdb_vote_average?: number | null;
  tmdb_vote_count?: number | null;
  imdb_id?: string | null;
}

export interface MovieExternalIdsResponseDTO extends MovieExternalIdsCreateDTO {
  id: string;
  id_movie: string;
}

// ==========================================
// 3. EPISODE TYPES
// ==========================================
export interface EpisodeBaseDTO {
  name_episode: string;
  slug?: string;
  filename?: string;
  link_embed?: string;
  link_m3u8?: string;
  server_name?: string;
  description?: string;
}

export interface EpisodeCreateDTO extends EpisodeBaseDTO {}

export interface EpisodeUpdateDTO extends EpisodeBaseDTO {
  name_episode: string;
}

export interface EpisodeResponseDTO extends EpisodeBaseDTO {
  id: string;
  id_movie: string;
  created_at?: string;
  updated_at?: string;
}

// ==========================================
// 4. MOVIE TYPES
// ==========================================
export interface MovieBaseDTO {
  name: string;
  slug_name: string;
  origin_name?: string;
  is_series: boolean;

  status?: string;   
  description?: string;
  poster_url?: string;
  thumb_url?: string;
  trailer_url?: string;

  quality?: string;       
  lang?: string;            
  time?: string;           
  year?: number;
  view?: number;

  episode_current?: string;
  episode_total?: string;

  is_copyright?: boolean;
  sub_docquyen?: boolean;
  chieurap?: boolean;
  notify?: string;
  showtimes?: string;
  
}

export interface MovieCreateDTO extends MovieBaseDTO {
  episodes: EpisodeCreateDTO[];
  actor_ids: string[];
  director_ids: string[];
  category_ids: string[];
  country_ids: string[];
  external_ids?: MovieExternalIdsCreateDTO | null;
}

export interface MovieUpdateDTO extends MovieBaseDTO {
  episodes: EpisodeCreateDTO[];
  actor_ids: string[];
  director_ids: string[];
  category_ids: string[];
  country_ids: string[];
  external_ids?: MovieExternalIdsCreateDTO | null;
}

export interface MoviePatchDTO {
  name?: string;
  slug_name?: string;
  origin_name?: string;
  is_series?: boolean;
  status?: string;
  description?: string;
  poster_url?: string;
  thumb_url?: string;
  trailer_url?: string;
  quality?: string;
  lang?: string;
  time?: string;
  year?: number;
  view?: number;
  episode_current?: string;
  episode_total?: string;
  is_copyright?: boolean;
  sub_docquyen?: boolean;
  chieurap?: boolean;
  notify?: string;
  showtimes?: string;
  episodes?: EpisodeCreateDTO[];
  actor_ids?: string[];
  director_ids?: string[];
  category_ids?: string[];
  country_ids?: string[];
  external_ids?: MovieExternalIdsCreateDTO | null;
}

export interface MovieResponseDTO extends MovieBaseDTO {
  id: string;
  created_at?: string;
  updated_at?: string;
  actors: ActorDTO[];
  directors: DirectorDTO[];
  categories: CategoryDTO[];
  countries: CountryDTO[];
}

export interface MovieDetailResponseDTO extends MovieResponseDTO {
  episodes: EpisodeResponseDTO[];
  external_ids?: MovieExternalIdsResponseDTO | null;
}