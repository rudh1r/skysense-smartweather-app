import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Cloud, 
  Mail, 
  Lock, 
  ArrowLeft,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  User,
  Check,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./auth-context";
import { ForgotPasswordDialog } from "./forgot-password-dialog";
import { toast } from "sonner";

interface SignInScreenProps {
  onBack: () => void;
  onContinueAsGuest?: () => void;
}

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export function SignInScreen({ onBack, onContinueAsGuest }: SignInScreenProps) {
  const { signIn, signUp, signInWithGoogle, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  
  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Common State
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Password validation
  const validatePassword = (password: string): PasswordValidation => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const passwordValidation = validatePassword(signUpPassword);
  const isPasswordValid = Object.values(passwordValidation).every(v => v);
  const passwordsMatch = signUpPassword === signUpConfirmPassword && signUpConfirmPassword.length > 0;

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signInEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (signInPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const { data, error: signInError } = await signIn(signInEmail, signInPassword);
      if (signInError) throw signInError;

      // If sign-in is successful and we have a user session, close the sign-in screen.
      if (data.user) {
        onBack();
      }
    } catch (err) {
      setError("Incorrect email or password. Please try again.");
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    // Name validation
    if (signUpName.trim().length < 2) {
      setError("Please enter your full name");
      return;
    }

    // Password validation
    if (!isPasswordValid) {
      setError("Password does not meet the requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error: signUpError } = await signUp(signUpEmail, signUpPassword, signUpName);
      if (signUpError) throw signUpError;
      toast.success("Account created successfully! Please sign in.");
      setActiveTab("signin");
    } catch (err) {
      setError("Failed to create account. This email may already be in use.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-950 flex overflow-hidden">
      {/* Left Side - Image/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-400 via-cyan-400 to-teal-400 dark:from-sky-950 dark:via-cyan-950 dark:to-teal-950 items-center justify-center p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <motion.div 
            className="absolute top-20 left-20"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Cloud className="h-32 w-32 text-white" />
          </motion.div>
          <motion.div 
            className="absolute bottom-32 right-20"
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -10, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Cloud className="h-24 w-24 text-white" />
          </motion.div>
        </div>

        {/* SkySense Branding */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Cloud className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-5xl text-white mb-4">SkySense</h1>
            <p className="text-xl text-white/90">
              Your intelligent weather companion
            </p>
            <p className="text-white/70 mt-3 max-w-md mx-auto">
              Get real-time weather updates, personalized forecasts, and smart alerts tailored to your lifestyle.
            </p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 space-y-4"
          >
            {["Real-time forecasts", "Smart weather alerts", "Location tracking"].map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-3 text-white/90">
                <Check className="h-5 w-5" />
                <span>{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto bg-gray-50 dark:bg-slate-900">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button - Mobile only */}
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 lg:hidden text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl text-gray-900 dark:text-white">SkySense</h2>
            </div>

            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-xl p-8">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-2xl text-gray-900 dark:text-white mb-2">
                  {activeTab === "signin" ? "Welcome back" : "Create account"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeTab === "signin" 
                    ? "Sign in to continue to SkySense" 
                    : "Sign up to see weather and forecasts"}
                </p>
              </div>

              {/* Error Alert */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Google Sign In - Top */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 mb-4"
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <Separator className="bg-gray-200 dark:bg-gray-700" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 px-3 text-sm text-gray-500 dark:text-gray-400">
                  OR
                </span>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-slate-700">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-gray-700 dark:text-gray-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="name@example.com"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600"
                          required
                          disabled={isLoading || isGoogleLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-gray-700 dark:text-gray-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signin-password"
                          type={showSignInPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          className="pl-10 pr-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600"
                          required
                          disabled={isLoading || isGoogleLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          disabled={isLoading || isGoogleLoading}
                        >
                          {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <button 
                        type="button"
                        onClick={() => setForgotPasswordOpen(true)}
                        className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white shadow-lg"
                      disabled={isLoading || isGoogleLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-700 dark:text-gray-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="name@example.com"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600"
                          required
                          disabled={isLoading || isGoogleLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                          className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600"
                          required
                          disabled={isLoading || isGoogleLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-700 dark:text-gray-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type={showSignUpPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          className="pl-10 pr-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600"
                          required
                          disabled={isLoading || isGoogleLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          disabled={isLoading || isGoogleLoading}
                        >
                          {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      
                      {/* Password Requirements */}
                      {signUpPassword.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg space-y-1.5"
                        >
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Password must contain:</p>
                          <div className="space-y-1">
                            <PasswordRequirement met={passwordValidation.length} text="At least 8 characters" />
                            <PasswordRequirement met={passwordValidation.uppercase} text="One uppercase letter" />
                            <PasswordRequirement met={passwordValidation.lowercase} text="One lowercase letter" />
                            <PasswordRequirement met={passwordValidation.number} text="One number" />
                            <PasswordRequirement met={passwordValidation.special} text="One special character" />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password" className="text-gray-700 dark:text-gray-300">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={signUpConfirmPassword}
                          onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                          className="pl-10 pr-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600"
                          required
                          disabled={isLoading || isGoogleLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          disabled={isLoading || isGoogleLoading}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      
                      {/* Password Match Indicator */}
                      {signUpConfirmPassword.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="flex items-center gap-2 mt-2"
                        >
                          {passwordsMatch ? (
                            <>
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <span className="text-sm text-green-600 dark:text-green-400">Passwords match</span>
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                              <span className="text-sm text-red-600 dark:text-red-400">Passwords do not match</span>
                            </>
                          )}
                        </motion.div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white shadow-lg"
                      disabled={isLoading || isGoogleLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>

                    {/* Terms and Privacy */}
                    <p className="text-xs text-center text-muted-foreground mt-6">
                      By signing up, you agree to our{" "}
                      <a href="#" className="text-sky-600 dark:text-sky-400 hover:underline">Terms</a>,{" "}
                      <a href="#" className="text-sky-600 dark:text-sky-400 hover:underline">Privacy Policy</a> and{" "}
                      <a href="#" className="text-sky-600 dark:text-sky-400 hover:underline">Cookies Policy</a>
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Footer */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activeTab === "signin" ? "Don't have an account? " : "Have an account? "}
                <button
                  onClick={() => setActiveTab(activeTab === "signin" ? "signup" : "signin")}
                  className="text-sky-600 dark:text-sky-400 hover:underline font-medium"
                >
                  {activeTab === "signin" ? "Sign up" : "Log in"}
                </button>
              </p>
              
              {onContinueAsGuest && (
                <>
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  <button
                    onClick={onContinueAsGuest}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Continue as Guest →
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog 
        open={forgotPasswordOpen} 
        onOpenChange={setForgotPasswordOpen}
      />
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
      ) : (
        <X className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
      )}
      <span className={`text-xs ${met ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
        {text}
      </span>
    </div>
  );
}