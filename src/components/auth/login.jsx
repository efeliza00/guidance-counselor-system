import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { useContext, useTransition } from "react";
import { Message } from "primereact/message";
import { Image } from "primereact/image";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { ToastContext } from "../providers/toast-provider";
const useLoginForm = () => {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const [isPending, startLogin] = useTransition();
  const methods = useForm({ defaultValues: { username: "", password: "" } });

  const onSubmit = (data) => {
    startLogin(async () => {
      try {
        const res = await window.account.login(data);
        if (res.status) {
          navigate("/dashboard");
          localStorage.setItem("auth-token", res.token);
          toast.current.show({
            severity: "success",
            summary: "Login Success",
            detail: res.message,
            life: 3500,
          });
        } else {
          methods.setError("root", {
            type: "manual",
            message: res.message || "Invalid username or password",
          });
        }
      } catch (err) {
        console.error("Login error:", err);
        methods.setError("root", {
          type: "manual",
          message: "Something went wrong. Please try again.",
        });
      }
    });
  };

  return {
    methods,
    isPending,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};
const LoginForm = ({ isPending }) => {
  const { register, control, formState } = useFormContext();

  const header = <div className="font-bold mb-3">Pick a password</div>;
  const footer = (
    <>
      <Divider />
      <p className="mt-2 font-medium">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3 text-sm">
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </>
  );

  return (
    <div className="grid grid-cols-12 gap-6 mt-5">
      {formState.errors?.root?.message && (
        <Message
          className="col-span-12 !justify-content-start"
          severity="error"
          text={formState.errors?.root?.message}
        />
      )}
      <FloatLabel className="col-span-12">
        <InputText
          {...register("username", { required: "Username is required" })}
          invalid={!!formState.errors.username}
          className="w-full"
        />
        <label>Username</label>
        <small className="p-error">{formState.errors.username?.message}</small>
      </FloatLabel>

      <FloatLabel className="col-span-12">
        <Controller
          name="password"
          control={control}
          rules={{ required: "Password is required" }}
          render={({ field: { value, onChange } }) => (
            <Password
              toggleMask
              value={value}
              onChange={onChange}
              invalid={!!formState.errors.password}
              header={header}
              footer={footer}
              inputClassName="w-full"
              className="w-full"
            />
          )}
        />
        <label>Password</label>
        <small className="p-error">{formState.errors.password?.message}</small>
      </FloatLabel>

      <div className="col-span-12">
        <Button
          type="submit"
          label="Submit"
          loading={isPending}
          className="w-full block mx-auto"
        />
      </div>
    </div>
  );
};

const LoginDetail = () => {
  const { methods, onSubmit, isPending } = useLoginForm();

  return (
    <div className="flex w-full h-full">
      <FormProvider {...methods}>
        <div className="flex flex-col items-center justify-center gap-4 p-4 w-full lg:w-1/3">
          <h3 className="text-3xl font-semibold">Login your Account</h3>
          <p className="text-gray-400">Enter your credentials.</p>
          <form onSubmit={onSubmit} className="space-y-6">
            <LoginForm isPending={isPending} />
          </form>
          <p className="text-center mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </FormProvider>
      <div className="flex items-center justify-center flex-col rounded-xl bg-blue-100/25 w-full m-4">
        <Image src="/logo.png" alt="logo-image" width="250" height="250" />
        <h3 className="text-3xl font-medium leading-8 text-blue-900">
          Guidance Counseling System
        </h3>
        <p className="text-blue-700">
          Organize complaints and resolutions in a modern way.
        </p>
      </div>
    </div>
  );
};

export default LoginDetail;
