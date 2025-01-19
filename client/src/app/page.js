"use client";

import React from "react";
import Link from "next/link";
import {
  FaStickyNote,
  FaBell,
  FaRegFolderOpen,
  FaRobot,
  FaClipboardCheck,
  FaCheckCircle,
  FaClipboardList,
  FaTasks,
  FaLightbulb,
  FaRegCheckCircle,
  FaFrown,
  FaSmile,
  FaCalendarAlt,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { GrMagic } from "react-icons/gr";
import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";

export default function HomePage() {
  return (
    <div className="container mx-auto font-sans">
      {/* HERO SECTION */}
      <header className="relative text-center min-h-[92vh] flex items-center justify-center overflow-hidden">
        <img
          src="/assets/images/hero.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover "
        />
        <div className="relative z-10 flex flex-col items-center justify-center bg-black bg-opacity-65 rounded-lg p-8 w-[80%] max-w-[900px] ">
          <h1 className="text-3xl font-extrabold mb-4 text-white">
            Revision Master - Your Study Buddy{" "}
          </h1>
          <p className="text-base text-center sm:text-lg text-white mb-6 leading-relaxed">
            Struggling to manage your study notes, todo, and revision schedules?{" "}
            <br /> Try our AI-driven platform with a proven revision technique
            to stay organized and stress-free{" "}
          </p>

          <Link href="/pages/create">
            <ButtonCommon icon={<GrMagic />} label="Get Started For Free" />
          </Link>
        </div>
      </header>

      {/* WHY NOTESMASTER SECTION */}
      <section className="bg-background py-20 px-4 text-center">
        <h2 className="text-3xl text-center  font-extrabold text-primary-700 mb-8 leading-tight">
          Why NotesMaster
          <span className="text-primary-500 ml-3 ">is Perfect for You!</span>
        </h2>

        <p className="max-w-4xl mx-auto text-lg text-neutral-700 leading-relaxed mb-16">
          We make studying simple and stress-free with smart features designed
          to help you stay organized and focused.
        </p>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="p-4 bg-white rounded-2xl shadow-lg text-center relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-400 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-md">
              <FaBell className="text-3xl" />
            </div>
            <h3 className="text-2xl font-semibold mt-8 mb-4">
              Never Forget What You Learn
            </h3>
            <p className="text-neutral-700">
              Set reminders and revise on time without any last-minute rush.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-lg text-center relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-400 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-md">
              <FaLightbulb className="text-3xl" />
            </div>
            <h3 className="text-2xl font-semibold mt-8 mb-4">
              AI That Helps You Learn Better
            </h3>
            <p className="text-neutral-700">
              Get smart summaries that make revising quick and effective.
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-lg text-center relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-400 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-md">
              <FaTasks className="text-3xl" />
            </div>
            <h3 className="text-2xl font-semibold mt-8 mb-4">
              Make Study Simple
            </h3>
            <p className="text-neutral-700">
              Easy-to-use tools to take notes, plan tasks, and manage your study
              schedule.
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-lg text-center relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-400 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-md">
              <FaClipboardList className="text-3xl" />
            </div>
            <h3 className="text-2xl font-semibold mt-8 mb-4">
              Stay Organized Effortlessly
            </h3>
            <p className="text-neutral-700">
              Keep all your notes and tasks in one place, so you always know
              what to do next.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-lg text-center relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-400 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-md">
              <FaCheckCircle className="text-3xl" />
            </div>
            <h3 className="text-2xl font-semibold mt-8 mb-4">
              Focus on What Matters
            </h3>
            <p className="text-neutral-700">
              Let us handle the planning while you focus on learning with
              confidence.
            </p>
          </div>
        </div>
      </section>

      {/* 5-TIME REVISE TECHNIQUE SECTION */}
      <section className="max-w-7xl mx-auto py-20 px-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl text-center md:text-left font-extrabold text-primary-700 mb-8 leading-tight">
              Master Your Studies with <br />
              <span className="text-primary-500">Our 5-Time Revision Plan</span>
            </h2>

            <p className="text-neutral-700 text-lg leading-relaxed mb-6">
              Our platform follows a scientifically proven 5-time revision
              technique to help you retain what you learn for the long term.
              With our intelligent reminders and daily dashboard, you’ll always
              know when it’s time to revise without feeling overwhelmed.
            </p>
            <p className="text-xl font-semibold text-primary-700 mb-4 text-center md:text-left">
              Your Personalized Study Revision Plan
            </p>
            <div className="flex gap-3 flex-wrap justify-center md:justify-start mb-6">
              {["Day 1", "Day 7", "Day 14", "Day 30", "Day 45"].map(
                (day, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 bg-primary-100 text-primary-700 font-medium rounded-full shadow-sm hover:bg-primary-200 transition duration-300"
                  >
                    {day}
                  </div>
                )
              )}
            </div>
            <p className="text-neutral-600 text-base text-center md:text-left">
              Follow our recommended schedule or customize revision days to fit
              your study routine.
            </p>
            <div className="text-center md:text-left">
              <button className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-3 rounded-lg shadow-md transition-all duration-300">
                Try for Free
              </button>
            </div>
          </div>
          <div className="flex justify-center md:justify-center">
            <img
              src="http://res.cloudinary.com/dfrhy6m3m/image/upload/v1737322723/vmmxtz3oyt6usptktkj9.gif"
              alt="Dashboard Preview"
              className="w-full max-w-[500px] h-auto "
            />
          </div>
        </div>
      </section>

      {/* WITH VS WITHOUT NOTESMASTER SECTION */}
      <section className="bg-background py-20 px-4 text-center">
        <h2 className="text-3xl text-center  font-extrabold text-primary-700 mb-8 leading-tight">
          <span className="text-primary-500 mr-3 "> Why NotesMaster</span>
          Makes a Difference
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* With NotesMaster */}
          <div className="p-12 bg-white rounded-xl shadow-xl border-b-8 border-success-500">
            <div className="text-success-500 text-4xl flex justify-center gap-4 items-center mb-6  ">
              <h3 className="text-2xl font-bold text-success-600">
                {" "}
                With NotesMaster
              </h3>
              <FaSmile />
            </div>
            <ul className="text-neutral-700 space-y-4 text-lg text-left leading-relaxed">
              <li>✅ Timely reminders and stress-free planning</li>
              <li>✅ Organized notes in one place</li>
              <li>✅ Effective revision with AI summaries</li>
              <li>✅ Increased productivity and focus</li>
            </ul>
          </div>

          {/* Without NotesMaster */}
          <div className="p-12 bg-white rounded-xl shadow-xl border-b-8 border-danger-500">
            <div className="text-danger-500 text-4xl flex justify-center gap-4 items-center mb-6">
              <h3 className="text-2xl font-bold text-danger-600">
                Without NotesMaster
              </h3>
              <FaFrown />
            </div>
            <ul className="text-neutral-700 space-y-4 text-lg text-left leading-relaxed">
              <li>❌ Missed deadlines and last-minute rush</li>
              <li>❌ Scattered notes and lost information</li>
              <li>❌ No proper revision schedule</li>
              <li>❌ Overwhelmed and disorganized</li>
            </ul>
          </div>
        </div>
        <div className="mt-12">
          <Link href="/pages/create">
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-10 rounded-lg shadow-md text-lg transition-all">
              Try for Free
            </button>
          </Link>
        </div>
      </section>

      {/* UPCOMING FEATURES SECTION */}
       <section className="bg-gray-50 py-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-8 text-primary-600">
          Coming Soon
        </h2>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center mb-12">
            <div className="w-full md:w-1/2 px-8 flex flex-col justify-center items-start text-left">
              <div className="bg-primary-100 p-4 rounded-full mb-4">
                <FaRobot className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">AI Note Summaries</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Let AI condense your detailed notes into concise highlights,
                giving you an instant refresher without re-reading everything.
              </p>
            </div>
            <img
              src="/assets/images/d.png"
              alt="AI Summary"
              className="w-full md:w-1/2 max-h-[300px] object-cover rounded-lg mt-4 md:mt-0"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <img
              src="/assets/images/b.png"
              alt="AI Tests"
              className="w-full md:w-1/2 max-h-[300px] object-cover rounded-lg mb-4 md:mb-0"
            />
            <div className="w-full md:w-1/2 px-8 flex flex-col justify-center items-end text-right">
              <div className="bg-primary-100 p-4 rounded-full mb-4">
                <FaClipboardCheck className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                AI-Generated Quizzes
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Review your notes and instantly generate customized quizzes to
                test your understanding. A fun way to reinforce what you’ve
                learned.
              </p>
            </div>
          </div>
        </div>
      </section> 
    </div>
  );
}
