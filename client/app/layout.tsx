import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
	title: "FuryClub | FURIA",
};

const geistSans = Geist({
	display: "swap",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" className={geistSans.className} suppressHydrationWarning>
			<body className="bg-background dark antialiased h-screen overflow-hidden">
        {children}
				<Toaster />
			</body>
		</html>
	);
}
