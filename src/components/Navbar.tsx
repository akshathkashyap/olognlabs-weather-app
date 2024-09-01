import Link from "next/link";
import Search from "./Search";

export default function Navbar() {
	return (
		<nav className='fixed top-0 left-0 w-full h-30 md:h-16 py-2 bg-gray-100 shadow-md outline outline-1 outline-gray-300 z-10'>
			<div className='container flex flex-col md:flex-row justify-start md:justify-center items-center md:items-start gap-4 md:gap-8 mx-auto h-full'>
				<h1 className='text-4xl text-nowrap'>
					<Link href={"/"}>
						Weather
						<span className='material-symbols-outlined !text-4xl'>
							partly_cloudy_day
						</span>
					</Link>
				</h1>
				<span>
					<Search></Search>
				</span>
			</div>
		</nav>
	);
}
