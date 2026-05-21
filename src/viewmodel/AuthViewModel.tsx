import axios from "axios";
import { useState } from "react";
import type { LoginResponseDTO, UserResponseDTO } from "../features/auth/models/user.dto";
import { jwtDecode } from "jwt-decode";



export function useAuthViewModel() {
  const [user, setUser] = useState<UserResponseDTO>()

  const [error, setError] = useState('');



  const handleLogin = async (email: string, password: string, e: React.FormEvent) => {
    e.preventDefault(); // DÒNG QUAN TRỌNG NHẤT: Ngăn chặn reload trang web
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/login', {
        email: email,
        password: password
      });
      console.log(response)

      const token = response.data.data.token;
      console.log(`token lay duoc la ${token}`)
      getInfFromToken(token)

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const backendMessage = error.response.data?.detail || error.response.data?.message || "Lỗi từ máy chủ!";
          console.log(error)

          // Bạn có thể custom thêm dựa vào status code nếu muốn
          if (error.response.status === 401) {
            setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          } else if (error.response.status === 404) {
            setError("Không tìm thấy bộ phim này.");
          } else {
            setError(backendMessage);
          }
        } else if (error.request) {
          setError("Không thể kết nối đến máy chủ. Kiểm tra lại đường truyền mạng.");
        } else {
          setError("Lỗi hệ thống khi gửi yêu cầu.");
        }
      } else {
        setError(`Đã xảy ra lỗi không xác định. ${error}`);
      }
    }
  };

  const getInfFromToken = (token:string) => {
      localStorage.setItem('auth_token', token);
      const decodedPayload = jwtDecode<UserResponseDTO>(token);
      setUser(decodedPayload)
  }

  return {
    user,
    setUser,
    handleLogin,
    getInfFromToken,
    error
  }
}
