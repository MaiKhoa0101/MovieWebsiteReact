import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import type { SubscriptionPlanDTO } from "../features/subscription/data/subscription_dto";

const BASE_URL = import.meta.env.VITE_BASE_URL_SUBSCRIPTION;

function getHeaders() {
    const token = localStorage.getItem("auth_token");
    return { Authorization: `Bearer ${token}` };
}

export function useSubscriptionViewModel() {
    const [plans, setPlans] = useState<SubscriptionPlanDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlans = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axios.get(`${BASE_URL}/`, { headers: getHeaders() });
            setPlans(res.data.data ?? res.data ?? []);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    const msg =
                        err.response.data?.detail ||
                        err.response.data?.message ||
                        "Lỗi từ máy chủ!";
                    if (err.response.status === 401)
                        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    else
                        setError(msg);
                } else if (err.request) {
                    setError("Không thể kết nối đến máy chủ. Kiểm tra lại đường truyền mạng.");
                } else {
                    setError("Lỗi hệ thống khi gửi yêu cầu.");
                }
            } else {
                setError("Đã xảy ra lỗi không xác định.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const subscribePlan = useCallback(async (planId: string): Promise<boolean> => {
        try {
            await axios.post(
                `${BASE_URL}/subscriptions/subscribe`,
                { plan_id: planId },
                { headers: getHeaders() }
            );
            return true;
        } catch (err) {
            console.error("Lỗi đăng ký gói:", err);
            return false;
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    return { plans, isLoading, error, fetchPlans, subscribePlan };
}