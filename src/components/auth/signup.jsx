import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Image } from "primereact/image";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useTransition } from "react";
import { ToastContext } from "../providers/toast-provider";

const useSignUpForm = () => {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const [isPending, startSignup] = useTransition();
  const methods = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (formData) => {
    startSignup(async () => {
      try {
        const res = await window.account.signUp(formData);
        if (res.status) {
          localStorage.setItem("auth-token", res.token);
          toast.current.show({
            severity: "success",
            summary: "Account Created",
            detail: res.message,
            life: 2000,
          });
          navigate("/dashboard");
        } else {
          methods.setError("root", {
            type: "manual",
            message: res.message || "Signup failed",
          });
        }
      } catch (err) {
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
    toast,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};

// ✅ Signup form UI
const SignUpForm = () => {
  const { register, control, formState, setError, watch } = useFormContext();

  const passwordValue = watch("password");

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
    <div className="grid grid-cols-12 gap-6">
      {formState.errors?.root?.message && (
        <Message
          className="col-span-12 !justify-content-start"
          severity="error"
          text={formState.errors.root.message}
        />
      )}
      <div className="col-span-12 flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <InputText
          id="email"
          type="email"
          invalid={!!formState.errors.email?.message}
          aria-describedby="email-help"
          className="w-full"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
        />
        <small id="email-help" className="p-error">
          {formState.errors.email?.message}
        </small>
      </div>

      {/* Username Field */}
      <div className="col-span-12 flex flex-col gap-2">
        <label htmlFor="username">Username</label>
        <InputText
          id="username"
          invalid={!!formState.errors.username?.message}
          aria-describedby="username-help"
          className="w-full"
          {...register("username", {
            required: "Username is required",
          })}
        />
        <small id="username-help" className="p-error">
          {formState.errors.username?.message}
        </small>
      </div>

      {/* Password Field */}
      <div className="col-span-12 flex flex-col gap-2">
        <label htmlFor="password">Password</label>
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
          render={({ field: { value, onChange } }) => (
            <Password
              id="password"
              toggleMask
              value={value}
              invalid={!!formState.errors.password?.message}
              onChange={onChange}
              header={header}
              footer={footer}
              inputClassName="w-full"
              className="w-full"
              aria-describedby="password-help"
            />
          )}
        />
        <small id="password-help" className="p-error">
          {formState.errors.password?.message}
        </small>
      </div>

      {/* Confirm Password Field */}
      <div className="col-span-12 flex flex-col gap-2">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Please confirm your password",
            validate: (value) =>
              value === passwordValue || "Passwords do not match",
          }}
          render={({ field: { value, onChange } }) => (
            <Password
              id="confirmPassword"
              toggleMask
              value={value}
              invalid={!!formState.errors.confirmPassword?.message}
              onChange={onChange}
              inputClassName="w-full"
              className="w-full"
              aria-describedby="confirmPassword-help"
            />
          )}
        />
        <small id="confirmPassword-help" className="p-error">
          {formState.errors.confirmPassword?.message}
        </small>
      </div>
      <div className="col-span-12">
        <Button
          type="submit"
          label="Submit"
          loading={formState.isSubmitting}
          className="w-full block mx-auto"
        />
      </div>
    </div>
  );
};

const SignUpDetail = () => {
  const { methods, onSubmit } = useSignUpForm();

  return (
    <div className="flex w-full h-full">
      <FormProvider {...methods}>
        <div className="flex flex-col items-center justify-center gap-4 p-4 w-full lg:w-1/3">
          <h3 className="text-3xl font-semibold leading-2">
            Create an Account
          </h3>
          <p>Register your information</p>
          <form onSubmit={onSubmit} className="space-y-6">
            <SignUpForm />
          </form>
          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login to your Account
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

export default SignUpDetail;
