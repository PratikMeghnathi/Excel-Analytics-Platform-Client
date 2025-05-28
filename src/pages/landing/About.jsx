import React from 'react';
import { Link } from 'react-router'; // Updated import for react-router-dom
import { PATHS } from '@/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components';

function About() {
    const teamMembers = [
        {
            name: 'Pratik Meghnathi',
            role: 'Lead Developer',
            desc: 'Highly skilled full-stack developer passionate about impactful web applications.',
            img: 'https://randomuser.me/api/portraits/men/21.jpg',
        },
        {
            name: 'Swapnil Kanthiwar',
            role: 'UI/UX Designer',
            desc: 'Focused on intuitive and visually appealing interfaces that enhance user experience.',
            img: 'https://randomuser.me/api/portraits/men/11.jpg',
        },
        {
            name: 'Gopal Kute',
            role: 'Backend Developer',
            desc: 'Specializes in backend architecture and scalable application development.',
            img: 'https://randomuser.me/api/portraits/men/22.jpg',
        },
    ];
    const techStack = [
        { src: 'https://img.icons8.com/color/50/react-native.png', alt: 'React', url: 'https://reactjs.org/' },
        { src: 'https://img.icons8.com/color/50/nodejs.png', alt: 'NodeJS', url: 'https://nodejs.org/' },
        { src: 'https://img.icons8.com/color/50/mongodb.png', alt: 'MongoDB', url: 'https://www.mongodb.com/' },
        { src: 'https://www.vectorlogo.zone/logos/expressjs/expressjs-icon.svg', alt: 'Express.js', url: 'https://expressjs.com/' },
        { src: 'https://img.icons8.com/color/50/tailwind_css.png', alt: 'Tailwind CSS', url: 'https://tailwindcss.com/' },
        { src: 'https://img.icons8.com/color/50/javascript.png', alt: 'JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
        { src: 'https://img.icons8.com/color/50/html-5.png', alt: 'HTML5', url: 'https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5' },
        { src: 'https://img.icons8.com/color/50/css3.png', alt: 'CSS3', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
        { src: 'https://img.icons8.com/fluency/50/github.png', alt: 'GitHub', url: 'https://github.com/' },
        { src: 'https://img.icons8.com/color/50/figma.png', alt: 'Figma', url: 'https://www.figma.com/' },
        { src: 'https://ui.shadcn.com/favicon.ico', alt: 'shadcn/ui', url: 'https://ui.shadcn.com/' }, // Favicon as a fallback
    ];

    const coreValues = [
        { title: 'Innovation', text: 'We are driven by creativity and innovation to deliver cutting-edge solutions.' },
        { title: 'Collaboration', text: 'We believe in teamwork, shared knowledge, and mutual support.' },
        { title: 'Excellence', text: 'We strive for the highest quality in everything we do.' },
    ];

    return (
        <main className="bg-gradient-to-r from-teal-500 to-blue-600 dark:from-gray-900 dark:to-gray-800 text-white">
            {/* Hero */}
            <section className="container mx-auto text-center py-20 px-4">
                <h1 className="text-5xl font-bold mb-4">Meet Our Team</h1>
                <p className="text-lg max-w-2xl mx-auto">
                    A team of passionate individuals working together to deliver results.
                </p>
            </section>

            {/* Team Members */}
            <section className="bg-background text-foreground py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Our Dedicated Team</h2>
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition duration-300"
                            >
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="text-xl font-semibold text-center">{member.name}</h3>
                                <p className="text-center text-teal-600 dark:text-teal-400 mb-2">{member.role}</p>
                                <p className="text-sm text-center text-gray-600 dark:text-gray-400">{member.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="bg-gray-100 dark:bg-gray-900 text-foreground py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {coreValues.map((value, idx) => (
                            <div key={idx} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
                                <h3 className="text-2xl font-semibold mb-2">{value.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{value.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="bg-gradient-to-r from-blue-600 to-teal-500 dark:from-gray-900 dark:to-gray-800 text-white text-center py-20 px-4">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold mb-6">Our Mission & Vision</h2>
                    <p className="text-lg max-w-2xl mx-auto">
                        Our mission is to empower businesses with innovative solutions that foster growth and success.
                        We envision a world where technology bridges challenges and solutions.
                    </p>
                </div>
            </section>

            {/* Technologies */}
            <section className="bg-background text-foreground py-20 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-12">Technologies We Work With</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {techStack.map((tech, index) => (
                            <TooltipProvider key={index}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <a
                                            href={tech.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-24 h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-110"
                                        >
                                            <img
                                                src={tech.src}
                                                alt={tech.alt}
                                                className="w-10 h-10 object-contain"
                                            />
                                        </a>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        <p>{tech.alt}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-blue-600 to-teal-500 dark:from-gray-900 dark:to-gray-800 text-white text-center py-20 px-4">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold mb-6">Join Our Team</h2>
                    <Link to={PATHS.SIGNUP}>
                        <button className="bg-white dark:bg-gray-800 text-blue-600 dark:text-white font-bold py-3 px-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">
                            Apply Now
                        </button>
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default About;