import { useForm } from "react-hook-form";
import { LoginSchema, LoginSchemaType } from "../schema/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../data/users";
import { useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import { useEffect } from "react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) });

  const navigate = useNavigate();
  const { setToken, token } = useAuthContext();
  const { mutateAsync, isPending } = useLogin({
    onSuccess: (data: { accessToken: string; refreshToken: string }) => {
      setToken(data?.accessToken);
      localStorage.setItem("refreshToken", data?.refreshToken);
      navigate("/dashboard");
    },
    onError: () => {
      setToken("");
      localStorage.removeItem("refreshToken");
    },
  });

  const onSubmit = async (formData: LoginSchemaType) => {
    const { email, password } = formData || {};
    await mutateAsync({ email, password });
  };

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      <div className="min-h-screen hero bg-base-200">
        <div className="flex-col hero-content lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <div className="w-full max-w-sm shadow-2xl card bg-base-100 shrink-0">
            <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  placeholder="Enter your Email"
                  className="input input-bordered"
                  {...register("email")}
                />
                {errors?.email?.message && (
                  <p className="text-xs text-red-500">
                    {errors?.email?.message}
                  </p>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  className="input input-bordered"
                  {...register("password")}
                />
                {errors?.password?.message && (
                  <p className="text-xs text-red-500">
                    {errors?.password?.message}
                  </p>
                )}
              </div>
              <div className="mt-6 form-control">
                <button disabled={isPending} className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
