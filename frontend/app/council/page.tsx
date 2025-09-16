import Image from "next/image";
import Navbar from "@/components/Navbar";

// JSON data structure for council members
const councilData = {
  houseLeadership: [
    {
      id: 1,
      name: "Devansh Malhotra",
      position: "Secretary",
      image: "/devansh.jpeg",
      department: "Computer Science",
      year: "Final Year"
    },
    {
      id: 2,
      name: "Devansh Malhotra",
      position: "Secretary",
      image: "/devansh.jpeg",
      department: "Computer Science", 
      year: "Final Year"
    },
    {
      id: 3,
      name: "Devansh Malhotra",
      position: "Secretary",
      image: "/devansh.jpeg",
      department: "Computer Science",
      year: "Final Year"
    }
  ],
  regionalCoordinators: [
    {
      id: 4,
      name: "John Doe",
      position: "North Region",
      image: "/devansh.jpeg",
      department: "Electronics",
      year: "Third Year"
    },
    {
      id: 5,
      name: "Jane Smith", 
      position: "South Region",
      image: "/devansh.jpeg",
      department: "Mechanical",
      year: "Third Year"
    },
    {
      id: 6,
      name: "Mike Johnson",
      position: "East Region", 
      image: "/devansh.jpeg",
      department: "Civil",
      year: "Third Year"
    },
    {
      id: 7,
      name: "Sarah Williams",
      position: "West Region",
      image: "/devansh.jpeg", 
      department: "Chemical",
      year: "Third Year"
    },
    {
      id: 8,
      name: "Alex Taylor",
      position: "Central Region",
      image: "/devansh.jpeg",
      department: "Information Technology",
      year: "Second Year"
    },
    {
      id: 9,
      name: "Priya Kumar",
      position: "Northeast Region",
      image: "/devansh.jpeg",
      department: "Computer Engineering",
      year: "Third Year"
    },
    {
      id: 10,
      name: "Liu Wei",
      position: "Southeast Region",
      image: "/devansh.jpeg",
      department: "Electrical",
      year: "Third Year"
    },
    {
      id: 11,
      name: "Carlos Mendez",
      position: "Southwest Region",
      image: "/devansh.jpeg",
      department: "Mechanical",
      year: "Second Year"
    },
    {
      id: 12,
      name: "Sara Lopez",
      position: "Upper North Region",
      image: "/devansh.jpeg",
      department: "Information Systems",
      year: "Third Year"
    },
    {
      id: 13,
      name: "Arjun Patel",
      position: "Lower South Region",
      image: "/devansh.jpeg",
      department: "Computer Science",
      year: "Second Year"
    }
  ]
};

export default function CouncilPage(){
  return (
    <div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
      {/* Background SVG*/}
      <div className="absolute left-1/2 top-0 w-[2842px] h-[566px] max-w-none -translate-x-1/2 overflow-hidden">
        <Image
          src="/councilbg.svg"
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

      {/* Hero Section - large centered heading over bg */}
      <main className="relative z-10">
        <section className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[566px] flex items-center justify-center px-6">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Decorative element positioned above the heading (moved closer to center) */}
            <div className="absolute -top-6 md:-top-10 lg:-top-14 flex items-center justify-center pointer-events-none">
              <Image
                src="/councilelement.avif"
                alt="Decorative element"
                width={1600}
                height={900}
                className="w-[520px] md:w-[920px] lg:w-[1280px] h-auto object-contain"
                priority
              />
            </div>

            {/* Text content - reduced top padding so it sits closer under the element */}
            <div className="text-center pt-12 md:pt-20 lg:pt-24 px-4">
              <h1 className="font-title font-extrabold text-[3rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem] xl:text-[6.5rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent leading-[0.99] tracking-tight mb-4">
                Council 2025-26
              </h1>

              {/* <p className="mt-6 text-[13px] md:text-[15px] lg:text-[18px] text-gray-300 max-w-3xl mx-auto">Empower your engineers to build cross-platform apps with Flutter and React Native. Reduce development time, get products to market faster.</p> */}

            </div>
          </div>
        </section>

         {/* Council Members Section */}
         <section className="relative z-10 pt-[566px] pb-16 px-6">
           <div className="max-w-7xl mx-auto">
             {/* House Leadership Section */}
             <div className="mb-16">
              <div className="relative mb-12">
                {/* Left side decorative pattern: placed specifically for House Leadership */}
                <div className="hidden lg:block absolute left-0 top-[141%] -translate-y-1/2 opacity-100 transform -translate-x-[220px] scale-105 pointer-events-none z-0">
                  <Image
                    src="/bg2.svg"
                    alt="Pattern"
                    width={358}
                    height={1702}
                    className="w-[358px] h-auto object-contain"
                  />
                </div>

                {/* Right side decorative pattern (mirrored) */}
                <div className="hidden lg:block absolute right-0 top-[250%] -translate-y-1/2 opacity-100 transform translate-x-[220px] scale-105 pointer-events-none z-0">
                  <Image
                    src="/bg2.svg"
                    alt="Pattern"
                    width={358}
                    height={1702}
                    className="w-[358px] h-auto object-contain transform scale-x-[-1]"
                  />
                </div>
 
                 {/* Centered content wrapper */}
                 <div className="max-w-4xl mx-auto text-center px-4">
                     <h2 className="fs-48 text-center font-title font-medium text-gray-8">House Leadership</h2>

                   <p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">We understand the challenges developers face. That’s why we build products that streamline workflows, eliminate friction, and empower developers to focus on what they do best: making great products.</p>

                   {/* Cards Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mt-8">
                     {councilData.houseLeadership.map((member) => (
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
                             {/* Profile Image (expanded — fills most of the card width & height) */}
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
 
              {/* Regional Coordinator Section */}
              <div className="mb-16">
               <div className="relative">
                 {/* no left-side pattern here so decorative svg appears only for House Leadership */}
 
                 {/* Centered content wrapper */}
                 <div className="max-w-5xl mx-auto text-center px-4">
                  <h2 className="fs-48 text-center font-title font-medium text-gray-8">Regional Coordinators</h2>
                   
                    <p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">We understand the challenges developers face. That’s why we build products that streamline workflows, eliminate friction, and empower developers to focus on what they do best: making great products.</p>

                  {/* Cards Grid - 4 columns for regional coordinators */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center mt-8">
                    {councilData.regionalCoordinators.map((member, idx) => {
                      // For the last row with two items (when total % 4 === 2), place them in cols 2 and 3 to center
                      const lgPositionClass = (idx >= 8 && idx % 4 === 0) ? 'lg:col-start-2' : (idx >= 8 && idx % 4 === 1 ? 'lg:col-start-3' : '');
                      return (
                        <div key={member.id} className={`relative group ${lgPositionClass}`}>
                          <div className="relative w-[240px] h-[380px] rounded-[20px] overflow-hidden">
                          {/* Background SVG */}
                          <div className="absolute inset-0">
                            <Image
                              src="/council-rc-bg.svg"
                              alt="RC card background"
                              width={340}
                              height={328}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Card Content */}
                          <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                             {/* Profile Image (expanded to fill more vertical space in RC card) */}
                             <div className="w-full h-[84%] mx-auto mb-1 rounded-[12px] overflow-hidden mt-1">
                               <Image
                                 src={member.image}
                                 alt={member.name}
                                 width={360}
                                 height={420}
                                 className="w-full h-full object-cover"
                               />
                             </div>

                             {/* Name and Position */}
                             <div className="text-center">
                               <h3 className="text-[14px] font-semibold text-white mb-1">
                                 {member.name}
                               </h3>
                               <p className="text-[12px] font-medium text-[#9AE634]">
                                 {member.position}
                               </p>
                             </div>
                           </div>
                         </div>
                        </div>
                      );
                    })}
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
