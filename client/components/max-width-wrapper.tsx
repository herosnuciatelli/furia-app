import type { ReactNode } from "react";

export const MaxWidthWrapper = ({ children }: { children: ReactNode }) => (
    <div className="max-w-3xl mx-auto">{ children }</div>
)