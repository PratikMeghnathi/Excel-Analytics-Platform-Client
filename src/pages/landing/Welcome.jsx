import { PATHS } from '@/utils';
import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <main className="bg-gradient-to-r from-teal-500 to-blue-600 dark:from-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto text-center text-white py-20 px-4 animate-fadeIn">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-md">
          Empower Your Business with MyApp
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Unlock data-driven decisions with next-gen analytics and smarter insights. Join us and elevate your success today!
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to={PATHS.SIGNIN}>
            <button className="bg-teal-600 text-white py-3 px-8 rounded-full hover:bg-teal-700 transition-all transform hover:scale-105 cursor-pointer">
              Sign In
            </button>
          </Link>
          <Link to={PATHS.SIGNUP}>
            <button className="bg-white text-teal-600 py-3 px-8 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 cursor-pointer dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
              Sign Up
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background text-foreground py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-12 animate-slideInDown">Features You'll Love</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Powerful Analytics', desc: 'Gain real-time insights with customizable dashboards.' },
              { title: 'Enterprise Security', desc: 'Top-grade security protocols safeguard your data 24/7.' },
              { title: 'Expert Support', desc: 'Get 24/7 expert technical guidance and assistance.' },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 animate-fadeInUp cursor-pointer"
              >
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-100 dark:bg-gray-900 text-foreground py-20">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
          <div className="flex-1 animate-slideInLeft">
            <img
              src="https://img.freepik.com/free-photo/data-analytics-tablet_23-2151957101.jpg"
              alt="Analytics"
              className="rounded-xl shadow-2xl hover:scale-105 transition-transform duration-500 w-full object-cover cursor-pointer"
            />
          </div>
          <div className="flex-1 animate-slideInRight text-center md:text-left">
            <h2 className="text-4xl font-bold mb-6">Why Choose MyApp?</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-400">
              With MyApp, empower your business through intuitive, scalable, and next-gen analytics tools built for growth.
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-400">
              Whether you're a budding startup or a thriving enterprise, our tailored solutions are crafted to drive your success story.
            </p>
            <Link to={PATHS.SIGNUP}>
              <button className="bg-teal-600 text-white py-3 px-8 rounded-full hover:bg-teal-700 transition-all transform hover:scale-105 cursor-pointer">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-background text-foreground py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-12 animate-slideInDown">What Our Users Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                text: "MyApp transformed our analytics approach. It's intuitive and incredibly powerful!",
                author: "Sarah Lee, CTO at TechNova",
              },
              {
                text: "The dashboards and insights gave us clarity like never before. Highly recommend!",
                author: "Mark Wilson, Founder at StartLaunch",
              },
              {
                text: "Exceptional support and seamless integration. MyApp made scaling so much easier!",
                author: "Emily Davis, CEO at GrowthHub",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 animate-fadeInUp flex flex-col justify-between h-full cursor-pointer"
              >
                <p className="mb-6 italic text-gray-700 dark:text-gray-400">"{testimonial.text}"</p>
                <h4 className="font-semibold text-gray-800 dark:text-gray-300">{testimonial.author}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="relative bg-gradient-to-r from-blue-600 to-teal-500 dark:from-gray-800 dark:to-gray-900 text-white text-center py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png')] bg-repeat"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-6 animate-pulse">Ready to Get Started?</h2>
          <Link to={PATHS.SIGNUP}>
            <button className="bg-white text-blue-600 py-3 px-8 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-110 cursor-pointer dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
              Create Your Free Account
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Welcome;