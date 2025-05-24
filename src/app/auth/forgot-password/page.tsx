
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
import { Mail, ArrowLeft, Loader2 } from "lucide-react"; // Added Loader2
import { useToast } from "@/hooks/use-toast";
import React from "react"; // Added React for useState if needed, but react-hook-form handles isSubmitting
import { auth } from "@/lib/firebase/config"; // Import auth
import { sendPasswordResetEmail } from "firebase/auth"; // Import sendPasswordResetEmail

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  // react-hook-form's form.formState.isSubmitting can be used directly
  // const [isSubmitting, setIsSubmitting] = React.useState(false); 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // form.formState.isSubmitting is handled by react-hook-form automatically for async functions
    console.log("Submitting password reset request for:", values.email);

    try {
      await sendPasswordResetEmail(auth, values.email);
      
      // Show generic success toast regardless of whether email exists for security
      toast({
          title: "Password Reset Request Sent",
          description: "If an account with that email exists, a password reset link has been sent.",
          variant: "default",
      });
      form.reset(); // Reset form on submission

    } catch (error: any) {
      console.error("Password reset error:", error);
      // Show generic failure toast for any unexpected errors
      toast({
          title: "Password Reset Failed",
          description: "An error occurred while trying to send the reset email. Please try again.",
          variant: "destructive",
      });
    }
    // form.formState.isSubmitting is automatically set to false by react-hook-form after async function completes
  }

  return (
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your account email and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your account email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          className="pl-10"
                          aria-describedby="email-message"
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                    </div>
                    <FormMessage id="email-message" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {form.formState.isSubmitting ? "Sending..." : "Send Password Reset Link"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/auth/sign-in" className="text-sm text-primary hover:underline flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Remember your password? Sign In
          </Link>
        </CardFooter>
      </Card>
  );
}
