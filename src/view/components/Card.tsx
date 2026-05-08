interface MovieCardProps {
    name: string;
    description: string;
    isSeries: boolean;
    imgUrl?: string;
}


export function MovieCard({ 
    name,
    description, 
    isSeries, 
    imgUrl 
}: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="image-container">
        <span className="badge-quality">{isSeries?"Bộ":"Lẻ"}</span>
        <img src={imgUrl} alt={name} />
      </div>
      <div className="movie-info">
        <h3 className="movie-name">{name}</h3>
      </div>
    </div>
  );
}

