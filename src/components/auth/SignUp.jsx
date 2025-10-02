import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

// Form validation schema
const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form data:", data);
      // Handle successful signup here
      navigate("/dashboard", { state: { fromSignup: true } });
      reset();
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration - Hidden on mobile and tablet */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 p-12 items-center justify-center">
        <div className="w-full max-w-2xl text-center">
          <img 
            src="/signup.png" 
            alt="Signup illustration" 
            className="w-full h-auto max-w-none mx-auto scale-110"
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center lg:justify-start justify-center p-4 md:p-6 lg:p-8 bg-white">
        <div className="w-full max-w-sm md:max-w-md lg:max-w-lg px-4 md:px-6 lg:px-8">
          <div className="space-y-6 md:space-y-8">
            <div className="text-center lg:text-left space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Create An <span className="text-blue-500">Account</span>
              </h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
              {/* Username Field */}
              <div className="space-y-3 md:space-y-4">
                <Label htmlFor="username" className="text-lg md:text-xl font-medium text-gray-800">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 md:h-6 md:w-6" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    className={`pl-12 md:pl-14 h-12 md:h-14 text-base md:text-lg ${errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                    {...register("username")}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-600 text-xs md:text-sm lg:text-base mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-3 md:space-y-4">
                <Label htmlFor="email" className="text-lg md:text-xl font-medium text-gray-800">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 md:h-6 md:w-6" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className={`pl-12 md:pl-14 h-12 md:h-14 text-base md:text-lg ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs md:text-sm lg:text-base mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-3 md:space-y-4">
                <Label htmlFor="password" className="text-lg md:text-xl font-medium text-gray-800">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 md:h-6 md:w-6" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`pl-12 md:pl-14 pr-12 md:pr-14 h-12 md:h-14 text-base md:text-lg ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 md:h-6 md:w-6" /> : <Eye className="h-5 w-5 md:h-6 md:w-6" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs md:text-sm lg:text-base mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-3 md:space-y-4">
                <Label htmlFor="confirmPassword" className="text-lg md:text-xl font-medium text-gray-800">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 md:h-6 md:w-6" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className={`pl-12 md:pl-14 pr-12 md:pr-14 h-12 md:h-14 text-base md:text-lg ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 md:h-6 md:w-6" /> : <Eye className="h-5 w-5 md:h-6 md:w-6" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs md:text-sm lg:text-base mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Login Link */}
              <div className="text-center lg:text-right text-base md:text-lg pt-2">
                <span className="text-gray-600">Already have an account? </span>
                <button
                  type="button"
                  onClick={handleLoginRedirect}
                  className="text-blue-500 hover:text-blue-600 font-medium hover:underline"
                >
                  Login
                </button>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 md:py-4 px-6 rounded-lg text-base md:text-lg transition-colors h-12 md:h-14"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Register"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;