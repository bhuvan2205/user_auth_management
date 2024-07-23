import {
  createContext,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { BASE_API_URL } from "../constants/routes";
import { api } from "../config/client";
import { AxiosRequestConfig } from "axios";

type TAuthContext = {
  token: string;
  setToken: (token: string) => void;
};

type CustomAxiosRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

export const AuthContext = createContext<TAuthContext | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        await api.get(`${BASE_API_URL}/api/users/session`);
      } catch (error) {
        setToken("");
      }
    };

    fetchSession();
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (config: any) => {
        if (token && !config._retry) {
          if (!config.headers) {
            config.headers = {};
          }
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (
            (error.response.status === 401 || error.response.status === 403) &&
            !originalRequest._retry &&
            refreshToken
          ) {
            originalRequest._retry = true;

            const response = await api.post(
              `${BASE_API_URL}/api/users/accessToken`,
              {
                refreshToken,
              }
            );
            const { data } = response || {};
            setToken(data?.accessToken as string);

            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }
            originalRequest.headers.Authorization = `Bearer ${data?.accessToken}`;

            return api(originalRequest);
          }
        } catch (error) {
          setToken("");
          localStorage.removeItem("refreshToken");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
