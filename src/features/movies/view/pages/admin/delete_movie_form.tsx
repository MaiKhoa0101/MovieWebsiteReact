import type { MovieResponseDTO } from "../../../models/movie.dto";

export function DeleteMovie({
    movie,
    onClose,
    onConfirm,
}: {
    movie: MovieResponseDTO;
    onClose: () => void;
    onConfirm: (id: string) => void;
}) {
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ minWidth: "350px" }}>
                <h3 className="modal-title text-danger">Cảnh báo Xóa</h3>
                <p style={{ marginTop: "10px" }}>
                    Bạn có chắc chắn muốn xóa phim:{" "}
                    <strong className="text-danger">{movie.name}</strong>?
                </p>
                <div className="modal-actions" style={{ marginTop: "24px" }}>
                    <button onClick={() => onConfirm(movie.id)} className="btn-danger">
                        Xóa luôn
                    </button>
                    <button onClick={onClose} className="btn-cancel">
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}