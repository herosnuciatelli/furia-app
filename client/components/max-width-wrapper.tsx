import { cn } from "@/lib/utils"

export const MaxWidthWrapper = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("max-w-6xl mx-auto", className)} {...props}>{ children }</div>
)