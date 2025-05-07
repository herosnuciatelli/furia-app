import { MaxWidthWrapper } from "./max-width-wrapper"
import { Icons } from "./Icons"

export const Navbar = () => {
    return (
        <header className="border-b border-zinc-300 py-3">
            <MaxWidthWrapper>
                <div className="flex items-center gap-1.5">
                    <Icons.furiaLogo/>
                    <span>CLUB</span>
                </div>
            </MaxWidthWrapper>
        </header>
    )
}