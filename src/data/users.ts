import { useMutation, useQuery } from "@tanstack/react-query";
import { LoginSchemaType } from "../schema/login";
import useAuthContext from "../hooks/useAuthContext";
import { BASE_API_URL } from "../constants/routes";
import { api } from "../config/client";

export const useLogin = (props: {
  onSuccess: (data: { accessToken: string; refreshToken: string }) => void;
  onError: () => void;
}) => {
  return useMutation({
    mutationFn: async (payload: LoginSchemaType) => {
      const res = await api.post(`${BASE_API_URL}/api/users/login`, payload);
      return await res?.data;
    },
    mutationKey: ["User Login"],
    onSuccess: (data) => props?.onSuccess?.(data),
    onError: () => props?.onError?.(),
  });
};

export const useUser = () => {
  const { token } = useAuthContext();
  return useQuery({
    enabled: !!token,
    queryKey: ["User"],
    queryFn: async () => {
      const res = await api.get(`${BASE_API_URL}/api/users/session`);
      return await res?.data;
    },
    refetchOnWindowFocus: false,
  });
};

export const useUserAccessToken = (props: {
  onSuccess: (data: {  sessionId: string; accessToken: string }) => void;
  onError: () => void;
}) => {
  return useMutation({
    mutationKey: ["User AccessToken"],
    mutationFn: async () => {
      const res = await api.post(`${BASE_API_URL}/api/users/accessToken`, {
        refreshToken: localStorage.getItem("refreshToken"),
      });
      return await res?.data;
    },
    onSuccess: (data) => props?.onSuccess?.(data),
    onError: () => props?.onError?.(),
  });
};

export const useLogout = (props: {
  onSuccess: (data: unknown) => void;
  onError?: () => void;
}) => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.delete(`${BASE_API_URL}/api/users/logout`);
      return await res?.data;
    },
    mutationKey: ["User Logout"],
    onSuccess: (data) => props?.onSuccess?.(data),
    onError: () => props?.onError?.(),
  });
};
