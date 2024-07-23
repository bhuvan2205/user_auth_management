import { useNavigate } from "react-router";
import { useUser, useUserAccessToken } from "../data/users";
import useAuthContext from "../hooks/useAuthContext";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const { data, isLoading } = useUser();
  const navigate = useNavigate();
  const { setToken } = useAuthContext();

  const queryClient = useQueryClient();

  const { mutateAsync } = useUserAccessToken({
    onSuccess: (data: { sessionId: string; accessToken: string }) => {
      queryClient.setQueryData(
        ["User"],
        (oldData: { email: string; sessionId: string }) => ({
          ...oldData,
          sessionId: data?.sessionId,
        })
      );
      setToken(data?.accessToken as string);
      navigate("/dashboard");
    },
    onError: () => {
      setToken("");
    },
  });

  const getRefreshToken = () => {
    mutateAsync();
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center my-20">
        {isLoading && (
          <div className="flex flex-col gap-4 w-52">
            <div className="w-full h-32 skeleton"></div>
            <div className="h-4 skeleton w-28"></div>
            <div className="w-full h-4 skeleton"></div>
            <div className="w-full h-4 skeleton"></div>
          </div>
        )}

        {data && (
          <div className="shadow-xl card bg-base-100 w-96">
            <figure>
              <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{data?.email}</h2>
              <p>Your session Id is {data?.sessionId}</p>
              <div className="justify-start card-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => getRefreshToken()}
                >
                  Refresh Token
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
