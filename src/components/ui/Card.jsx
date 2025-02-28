import React from "react";
import { cn } from "@/lib/utils";

// Crear una función generadora de componentes reutilizables con `forwardRef`
const createCardComponent = (Component, defaultClasses) => 
  React.forwardRef(({ className, ...props }, ref) => (
    <Component ref={ref} className={cn(defaultClasses, className)} {...props} />
  ));

const Card = createCardComponent("div", "rounded-lg border bg-card text-card-foreground shadow-sm");
const CardHeader = createCardComponent("div", "flex flex-col space-y-1.5 p-6");
const CardTitle = createCardComponent("h3", "text-2xl font-semibold leading-none tracking-tight");
const CardDescription = createCardComponent("p", "text-sm text-muted-foreground ");
const CardContent = createCardComponent("div", "p-6 pt-0",)
const CardFooter = createCardComponent("div", "flex items-center p-6 pt-0");

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
