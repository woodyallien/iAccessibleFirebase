
"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase/config"; // Import auth and db
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from "firebase/auth"; // Import Firebase auth functions and Google Auth
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useRouter } from 'next/navigation'; // Import useRouter
import { AuthLayout } from "@/components/layout/auth-layout";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, Loader2 } from "lucide-react"; // Added Loader2
import { useToast } from "@/hooks/use-toast";
import React from "react";

// Placeholder Google Icon SVG (reused from Sign In page)
const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
  confirmPassword: z.string(),
  termsAndConditions: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Set the error on the confirmPassword field
});

export default function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter(); // Get router instance
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAndConditions: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log("Signing up with:", values);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      // Update user profile with full name
      await updateProfile(userCredential.user, {
        displayName: values.fullName,
      });

      // Create user profile in Firestore
      await createUserProfileInFirestore(userCredential.user, values);

      console.log("User signed up and profile created:", userCredential.user);
      toast({
        title: "Account Created Successfully",
        description: "Your profile has been set up. Please sign in.",
      });
      form.reset();
      router.push('/auth/sign-in'); // Redirect to sign-in page

    } catch (error: any) {
      console.error("Sign up error:", error);
      let errorMessage = "Sign-up failed. Please try again."; // Generic fallback

      // Specific error handling based on Firebase Auth error codes
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email already in use.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak.";
      }
      // Add other specific error codes if needed

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Async function to create user profile in Firestore
  async function createUserProfileInFirestore(user: any, values: z.infer<typeof formSchema>) {
    if (!user || !user.uid) {
      console.error("Cannot create Firestore profile: User object is invalid.");
      return; // Or throw an error
    }

    const userRef = doc(db, "users", user.uid);

    const userProfileData = {
      email: user.email,
      fullName: user.displayName || values.fullName, // Use displayName if available (e.g., from Google), otherwise use form value
      authProvider: user.providerData[0]?.providerId || "password",
      creditBalance: 100, // Default credits
      subscriptionTierId: "free_tier_mvp", // Default tier ID
      activeSubscriptionId: null,
      themePreference: "system",
      notificationPreferences: { scanCompleteEmail: true, lowCreditWarningApp: true },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(), // Or set this on actual login
    };

    try {
      await setDoc(userRef, userProfileData);
      console.log(`Firestore user profile created for UID: ${user.uid}`);
    } catch (firestoreError) {
      console.error(`Error creating Firestore user profile for UID: ${user.uid}:`, firestoreError);
      // Decide how to handle this error - maybe log to a separate error tracking system
      // or attempt to delete the auth user if profile creation is critical.
    }
  }


  async function handleGoogleSignUp() {
    setIsSubmitting(true); // Disable button during Google sign-up
    console.log("Attempting Google Sign Up...");
    
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
        title: "Signed up with Google successfully!",
        description: "Welcome to iAccessible!",
      });
      router.push('/'); // Redirect to dashboard or intended page after sign up

    } catch (error: any) {
      console.error("Google Sign Up error:", error);
      let errorMessage = "Google Sign-Up failed."; // Generic fallback

      // Handle specific errors
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Google Sign Up popup closed by user.");
        // No toast needed for this common user action
      } else if (error.code === 'auth/cancelled-popup-request') {
         console.log("Google Sign Up popup request cancelled.");
         // No toast needed
      }
      else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "This email might be associated with another sign-in method.";
        toast({
          title: "Sign Up Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
      // Add other specific error codes if needed
      else {
         toast({
          title: "Sign Up Failed",
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
          <CardTitle className="text-2xl">Create your iAccessible Account</CardTitle>
          <CardDescription>Join us to make the web more accessible!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="Your Name" {...field} className="pl-10" aria-describedby="fullName-message" disabled={isSubmitting}/>
                      </FormControl>
                    </div>
                    <FormMessage id="fullName-message"/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} className="pl-10" aria-describedby="email-message" disabled={isSubmitting}/>
                      </FormControl>
                    </div>
                    <FormMessage id="email-message"/>
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
                        <Input type="password" placeholder="••••••••" {...field} className="pl-10" aria-describedby="password-message password-help" disabled={isSubmitting}/>
                      </FormControl>
                    </div>
                    <p id="password-help" className="text-xs text-muted-foreground mt-1">
                      Minimum 8 characters. Include uppercase, lowercase, number, and symbol.
                    </p>
                    <FormMessage id="password-message"/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="pl-10" aria-describedby="confirmPassword-message" disabled={isSubmitting}/>
                      </FormControl>
                    </div>
                    <FormMessage id="confirmPassword-message"/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="termsAndConditions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-describedby="terms-message"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="termsAndConditions" className="text-sm font-normal">
                        I agree to the{" "}
                        <Link href="/terms" target="_blank" className="font-medium text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" target="_blank" className="font-medium text-primary hover:underline">
                          Privacy Policy
                        </Link>.
                      </FormLabel>
                      <FormMessage id="terms-message"/>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </Form>

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

          <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isSubmitting}>
            <GoogleIcon />
            Sign Up with Google
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
  );
}
