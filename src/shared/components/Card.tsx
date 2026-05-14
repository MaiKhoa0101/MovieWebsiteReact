import { useNavigate } from "react-router-dom";

interface MovieCardProps {
    name: string;
    slug: string;
    description: string;
    isSeries: boolean;
    imgUrl?: string;
}


export function MovieCard({ 
    name,
    description, 
    isSeries, 
    imgUrl,
    slug 
}: MovieCardProps) {
  const navigate = useNavigate();

  function onClick(){
    console.log("Click ne")
    navigate(`/detail/${slug}`);
  }


  return (
    <div className="movie-card" onClick={onClick}>
      <div className="image-container">
        <img src={imgUrl} alt={name} />
        <div className="movie-card-info">
          <h5>
            {description}
          </h5>
        </div>
      </div>
      <span className={isSeries?"badge-series":"badge-movie"}>{isSeries?"Bộ":"Lẻ"}</span>

      <div className="movie-info">
        <h3 className="movie-name">{name}</h3>
      </div>
      
    </div>
  );
}

