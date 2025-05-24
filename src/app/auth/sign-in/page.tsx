
"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { auth } from "@/lib/firebase/config"; // Import auth
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from "firebase/auth"; // Import Firebase auth functions and Google Auth
import { useRouter } from 'next/navigation'; // Import useRouter

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

// Placeholder Google Icon SVG
const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

export default function SignInPage() {
  const { toast } = useToast();
  const router = useRouter(); // Get router instance
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log("Signing in with:", values);

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      
      console.log("User signed in successfully");
      toast({
        title: "Signed In Successfully!",
        description: "Welcome back!",
      });
      // form.reset(); // Optional: reset form on success
      router.push('/'); // Redirect to dashboard

    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = "Sign-in failed. Please try again."; // Generic fallback

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = "Invalid email or password. Please try again.";
          break;
        case 'auth/invalid-email':
          errorMessage = "The email address is not valid.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This user account has been disabled.";
          break;
        default:
          // Log unexpected errors for debugging
          console.error("Unexpected sign-in error code:", error.code);
          errorMessage = "An unexpected error occurred during sign-in. Please try again later.";
      }

      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsSubmitting(true); // Disable button during Google sign-in
    console.log("Attempting Google Sign In...");

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;

      // Check if the user is new
      const additionalUserInfo = getAdditionalUserInfo(result);
      if (additionalUserInfo?.isNewUser) {
        console.log("New Google user signed up:", user);
        // TODO: Perform any first-time setup for new Google users if needed
      } else {
        console.log("Existing Google user signed in:", user);
      }

      toast({
        title: "Signed in with Google successfully!",
        description: "Welcome back!",
      });
      router.push('/'); // Redirect to dashboard

    } catch (error: any) {
      console.error("Google Sign In error:", error);
      let errorMessage = "Google Sign-In failed. Please try again."; // Generic fallback

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          console.log("Google Sign In popup closed by user.");
          // No toast needed for this common user action
          errorMessage = ""; // Clear error message for no toast
          break;
        case 'auth/cancelled-popup-request':
          console.log("Google Sign In popup request cancelled.");
          // No toast needed
          errorMessage = ""; // Clear error message for no toast
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = "This email might be associated with another sign-in method.";
          break;
        case 'auth/auth-domain-config-required':
          errorMessage = "Firebase Auth domain is not configured.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Google sign-in is not enabled in Firebase console.";
          break;
        case 'auth/operation-not-supported-in-this-environment':
          errorMessage = "Google sign-in is not supported in this environment.";
          break;
        case 'auth/timeout':
          errorMessage = "Google sign-in timed out. Please try again.";
          break;
        default:
          // Log unexpected errors for debugging
          console.error("Unexpected Google sign-in error code:", error.code);
          errorMessage = "An unexpected error occurred during Google sign-in. Please try again later.";
      }

      // Only show toast if there's an error message
      if (errorMessage) {
        toast({
          title: "Sign In Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }

    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  }

  return (
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In to iAccessible</CardTitle>
          <CardDescription>Welcome back! Please enter your credentials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          className="pl-10"
                          aria-describedby="email-message"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    </div>
                    <FormMessage id="email-message" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                     <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="pl-10"
                          aria-describedby="password-message"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    </div>
                    <FormMessage id="password-message" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            <Link href="/auth/forgot-password" className="font-medium text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
            <GoogleIcon />
            Sign In with Google
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="font-semibold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
  );
}
