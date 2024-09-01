import Navbar from "@/components/Navbar";

export default function WeatherLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main>
			<Navbar></Navbar>
			<div className="mt-32 md:mt-16 w-full">
            	{children}
			</div>
        </main>
	);
}
