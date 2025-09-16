import Image from "next/image";
import Navbar from "@/components/Navbar";

// Webops data (was houseLeadership)
const webops = [
	{
		id: 1,
		name: "Devansh Malhotra",
		position: "Secretary",
		image: "/devansh.jpeg",
		department: "Computer Science",
		year: "Final Year",
	},
	{
		id: 2,
		name: "Devansh Malhotra",
		position: "Secretary",
		image: "/devansh.jpeg",
		department: "Computer Science",
		year: "Final Year",
	},
	{
		id: 3,
		name: "Devansh Malhotra",
		position: "Secretary",
		image: "/devansh.jpeg",
		department: "Computer Science",
		year: "Final Year",
	},
  {
		id: 4,
		name: "Devansh Malhotra",
		position: "Secretary",
		image: "/devansh.jpeg",
		department: "Computer Science",
		year: "Final Year",
	},
  {
		id: 5,
		name: "Devansh Malhotra",
		position: "Secretary",
		image: "/devansh.jpeg",
		department: "Computer Science",
		year: "Final Year",
	},
];

// Multimedia data (5 members)
const multimedia = [
  { id: 6, name: 'Alex Turner', position: 'Multimedia Lead', image: '/devansh.jpeg' },
  { id: 7, name: 'Ria Patel', position: 'Video Editor', image: '/devansh.jpeg' },
  { id: 8, name: 'Samir Khan', position: 'Graphic Designer', image: '/devansh.jpeg' },
  { id: 9, name: 'Liam Wong', position: 'Photographer', image: '/devansh.jpeg' },
  { id: 10, name: 'Maya Roy', position: 'Animator', image: '/devansh.jpeg' }
];

// Out Reach data (single card)
const outreach = [
  { id: 11, name: 'Priya Nair', position: 'Outreach Coordinator', image: '/devansh.jpeg' }
];

export default function TeamsPage() {
	return (
		<div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
			{/* Background SVG - positioned like council page */}
			<div className="absolute left-1/2 top-0 w-[2842px] h-[566px] max-w-none -translate-x-1/2 overflow-hidden">
				<Image
					src="/teamsbg.svg"
					alt="Background pattern"
					width={2842}
					height={566}
					className="w-[2842px] h-[566px] max-w-none object-cover"
					priority
				/>
			</div>

			{/* Navbar */}
			<div className="relative z-20 text-white">
				<Navbar />
			</div>

			{/* Hero Section - mirror Council page hero */}
			<main className="relative z-10">
				<section className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[566px] flex items-center justify-center px-6">
					<div className="relative w-full h-full flex items-center justify-center">
						{/* Decorative element positioned above the heading */}
						<div className="absolute -top-6 md:-top-10 lg:-top-2 flex items-center justify-center pointer-events-none">
							  <Image
									src="/logo-namdapha.png"
									alt="NAMP Logo"
									width={420}
									height={420}
									className="object-contain rounded-full"
									priority
								  />
						</div>

						{/* Left side decorative pattern: placed specifically for House Leadership */}
						<div className="hidden lg:block absolute left-0 top-[250%] -translate-y-1/2 opacity-90 transform -translate-x-[220px] scale-105 pointer-events-none z-0">
							<Image
								src="/bg2.svg"
								alt="Pattern"
								width={358}
								height={1702}
								className="w-[358px] h-auto object-contain"
							/>
						</div>

						{/* Right side decorative pattern (mirrored) */}
						<div className="hidden lg:block absolute right-0 top-[250%] -translate-y-1/2 opacity-90 transform translate-x-[220px] scale-105 pointer-events-none z-0">
							<Image
								src="/bg2.svg"
								alt="Pattern"
								width={358}
								height={1702}
								className="w-[358px] h-auto object-contain transform scale-x-[-1]"
							/>
						</div>

						{/* Text content */}
						<div className="relative z-30 text-center pt-12 md:pt-20 lg:pt-24 px-4">
							<h1 className="font-title font-extrabold text-[3rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem] xl:text-[6.5rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent leading-[0.99] tracking-tight mb-4">
								Department Teams
							</h1>
						</div>
					</div>
				</section>

				{/* Keep an empty section below so page spacing aligns with other pages */}
				<section className="pt-[566px] pb-16 px-6">
					<div className="max-w-7xl mx-auto">
						{/* House Leadership Section (copied from Council page) */}
						<div className="mb-16">
							<div className="relative mb-12">
								<div className="max-w-4xl mx-auto text-center px-4">
									<h2 className="fs-48 text-center font-title font-medium text-gray-8">
										Web-Ops
									</h2>

									<p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">
										We understand the challenges developers face. That’s why we
										build products that streamline workflows, eliminate friction,
										and empower developers to focus on what they do best: making
										great products.
									</p>

									{/* Cards Grid */}
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mt-8">
										{webops.map((member) => (
											<div key={member.id} className="relative group">
												<div className="relative w-[280px] h-[400px] rounded-[20px] overflow-hidden">
													{/* Background SVG */}
													<div className="absolute inset-0">
														<Image
															src="/council-card-bg.svg"
															alt="Card background"
															width={340}
															height={328}
															className="w-full h-full object-cover"
														/>
													</div>

													{/* Card Content */}
													<div className="relative z-10 p-6 h-full flex flex-col justify-between">
														{/* Profile Image */}
														<div className="w-full h-[84%] mx-auto mb-2 rounded-[12px] overflow-hidden mt-0">
															<Image
																src={member.image}
																alt={member.name}
																width={320}
																height={336}
																className="w-full h-full object-cover"
															/>
														</div>

														{/* Name and Position */}
														<div className="text-center">
															<h3 className="text-[16px] font-semibold text-white mb-1">
																{member.name}
															</h3>
															<p className="text-[14px] font-medium text-[#9AE634]">
																{member.position}
															</p>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Multimedia Section (5 members) */}
						<div className="mb-16">
							<div className="relative mb-12">
								<div className="max-w-4xl mx-auto text-center px-4">
									<h2 className="fs-48 text-center font-title font-medium text-gray-8">Multimedia</h2>
									<p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">Creative team responsible for visuals, video and media across channels.</p>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mt-8">
										{multimedia.map((member) => (
											<div key={member.id} className="relative group">
												<div className="relative w-[280px] h-[400px] rounded-[20px] overflow-hidden">
													<div className="absolute inset-0">
														<Image src="/council-card-bg.svg" alt="Card background" width={340} height={328} className="w-full h-full object-cover" />
													</div>
													<div className="relative z-10 p-6 h-full flex flex-col justify-between">
														<div className="w-full h-[84%] mx-auto mb-2 rounded-[12px] overflow-hidden mt-0">
															<Image src={member.image} alt={member.name} width={320} height={336} className="w-full h-full object-cover" />
														</div>
														<div className="text-center">
															<h3 className="text-[16px] font-semibold text-white mb-1">{member.name}</h3>
															<p className="text-[14px] font-medium text-[#9AE634]">{member.position}</p>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Out Reach Section (single card) */}
						<div className="mb-16">
							<div className="relative mb-12">
								<div className="max-w-4xl mx-auto text-center px-4">
									<h2 className="fs-48 text-center font-title font-medium text-gray-8">Out Reach</h2>
									<p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">Team focused on events, partnerships and community engagement.</p>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mt-8">
										{outreach.map((member) => (
											<div key={member.id} className="relative group">
												<div className="relative w-[280px] h-[400px] rounded-[20px] overflow-hidden">
													<div className="absolute inset-0">
														<Image src="/council-card-bg.svg" alt="Card background" width={340} height={328} className="w-full h-full object-cover" />
													</div>
													<div className="relative z-10 p-6 h-full flex flex-col justify-between">
														<div className="w-full h-[84%] mx-auto mb-2 rounded-[12px] overflow-hidden mt-0">
															<Image src={member.image} alt={member.name} width={320} height={336} className="w-full h-full object-cover" />
														</div>
														<div className="text-center">
															<h3 className="text-[16px] font-semibold text-white mb-1">{member.name}</h3>
															<p className="text-[14px] font-medium text-[#9AE634]">{member.position}</p>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
