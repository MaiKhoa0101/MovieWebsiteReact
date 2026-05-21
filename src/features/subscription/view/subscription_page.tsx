import { useNavigate } from "react-router-dom";
import './subscription_page.css';
import { useSubscriptionViewModel } from "../../../viewmodel/SubscriptionViewModel";
import { Topbar } from "../../../shared/components/topbar/topbar";

function formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

function formatDuration(days: number): string {
    if (days % 365 === 0) return `${days / 365} năm`;
    if (days % 30 === 0) return `${days / 30} tháng`;
    return `${days} ngày`;
}


export default function SubscriptionPage() {
    const navigate = useNavigate();
    const { plans, isLoading, error, subscribePlan } = useSubscriptionViewModel();

    const handleSubscribe = async (planId: string, planName: string) => {
        if (!localStorage.getItem("auth_token")) {
            navigate("/login");
            return;
        }
        const ok = await subscribePlan(planId);
        if (ok) {
            alert(`Đăng ký "${planName}" thành công!`);
        } else {
            alert("Đăng ký thất bại. Vui lòng thử lại.");
        }
    };

    if (error) {
        return (
            <div>
                <Topbar />
                <div className="sub-page">
                    <div className="sub-error-box">
                        <strong>Cảnh báo:</strong> {error}
                    </div>
                    <button className="sub-btn-primary" onClick={() => navigate("/login")}>
                        Đăng nhập lại
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>
                <Topbar />
                <div className="detail-loading">
                    <div className="detail-spinner" />
                    <p>Đang tải danh sách gói...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Topbar />
            <div className="sub-page">

                {/* ── Header ── */}
                <button className="detail-back-btn" onClick={() => navigate(-1)}>‹</button>

                <div className="sub-header">
                    <h1 className="sub-header__title">Gói đăng ký</h1>
                    <p className="sub-header__sub">Chọn gói phù hợp để trải nghiệm kho phim không giới hạn</p>
                </div>

                {plans.length === 0 && (
                    <p className="sub-empty">Hiện chưa có gói nào. Vui lòng quay lại sau.</p>
                )}

                <div className="sub-list">
                    {plans.map((plan) => (
                        <div key={plan.id} className="sub-card">

                            <div className="sub-card__body">
                                <div className="sub-card__top">
                                    <span className="sub-card__name">{plan.name}</span>
                                    <span className="sub-card__duration">
                                        {formatDuration(plan.duration_days)}
                                    </span>
                                </div>
                                <p className="sub-card__desc">{plan.description}</p>
                                <div className="sub-card__stats">
                                    {[
                                        { label: "Thời hạn", value: formatDuration(plan.duration_days) },
                                        { label: "Ngày cấp", value: new Date(plan.created_at).toLocaleDateString("vi-VN") },
                                    ].map((s, i) => (
                                        <div key={i} className="sub-card__stat">
                                            <span className="sub-card__stat-value">{s.value}</span>
                                            <span className="sub-card__stat-label">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: price + CTA */}
                            <div className="sub-card__action">
                                <div className="sub-card__price">{formatPrice(plan.price)}</div>
                                <div className="sub-card__price-sub">/ {formatDuration(plan.duration_days)}</div>
                                {localStorage.getItem("auth_token") ? (
                                    <button
                                        className="sub-btn-primary"
                                        onClick={() => handleSubscribe(plan.id, plan.name)}
                                    >
                                        Đăng ký ngay
                                    </button>
                                ) : (
                                    <button
                                        className="sub-btn-primary sub-btn-primary--guest"
                                        onClick={() => navigate("/login")}
                                    >
                                        Đăng nhập để đăng ký
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}