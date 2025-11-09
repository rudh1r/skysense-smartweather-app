import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, AlertCircle, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

interface OTPVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerified: () => void;
}

export function OTPVerificationDialog({ 
  open, 
  onOpenChange, 
  email,
  onVerified 
}: OTPVerificationDialogProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [verificationState, setVerificationState] = useState('');

  useEffect(() => {
    if (open && !generatedOTP) {
      // Generate OTP when dialog opens
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(newOtp);
      console.log("Generated OTP for sign up:", newOtp);
      setResendTimer(60); // 60 seconds timer
    }
  }, [open, generatedOTP]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verify OTP
      if (otp !== generatedOTP) {
        setError("Invalid OTP. Please check and try again.");
        setIsLoading(false);
        return;
      }
      
      // OTP verified successfully
      onVerified();
      setVerificationState('success');
      resetState();
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setOtp("");
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate new OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(newOtp);
      setResendTimer(60);
      
      console.log("New OTP for sign up:", newOtp);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setOtp("");
    setError("");
    setGeneratedOTP("");
    setResendTimer(0);
    setVerificationState('');
  };

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
          <DialogDescription>
            We've sent a 6-digit verification code to <strong>{email}</strong>
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleVerifyOTP} className="space-y-6">
          {/* Email Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-sky-600 dark:text-sky-400" />
            </div>
          </div>

          {/* OTP Input */}
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Label>Enter Verification Code</Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Resend OTP */}
            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Resend code in {resendTimer}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 disabled:opacity-50"
                >
                  Didn't receive the code? Resend
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>

          {/* Success State */}
          {verificationState === 'success' && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-xs text-green-700 dark:text-green-300 text-center">
                <strong>Success:</strong> OTP verified successfully
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}