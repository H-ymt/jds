import * as React from "react";

import { cn } from "@/lib/utils";

function Card({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "premium" }) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      className={cn(
        "bg-card text-card-foreground flex flex-col overflow-hidden transition-all duration-300",
        variant === "default" && "rounded-2xl border border-border shadow-sm",
        variant === "premium" &&
          "sm:rounded-[3rem] rounded-4xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white dark:bg-zinc-900",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex gap-1.5 sm:px-10 px-6 sm:pt-10 pt-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-2xl font-black leading-tight tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-xs font-bold uppercase tracking-widest", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("sm:px-10 px-6 pb-6 sm:pb-10 pt-0", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center sm:px-10 px-6 pb-6 sm:pb-10 pt-0", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("ml-auto", className)} {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
