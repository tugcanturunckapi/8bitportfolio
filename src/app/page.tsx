"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Download,
  Github,
  Linkedin,
  Volume2,
  VolumeX,
} from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import aboutData from "./about.json" assert { type: "json" };
import skillsData from "./skills.json" assert { type: "json" };
import projectsData from "./projects.json" assert { type: "json" };
import contactData from "./contact.json" assert { type: "json" };
import educationData from "./education.json" assert { type: "json" };
import experiencesData from "./experiences.json" assert { type: "json" };

export default function Home() {
  const [konamiCode, setKonamiCode] = useState<string[]>([]);
  const [showFireworks, setShowFireworks] = useState(false);
  const [mute, setMute] = useState(false);
  const [volume, setVolume] = useState(0.1);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const [showPixels, setShowPixels] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  // Ses efektleri için audio elementleri (public klasöründen)
  const clickAudio =
    typeof window !== "undefined"
      ? new Audio("/ui-button-click-8-341030.mp3")
      : null;

  const playClick = () => {
    if (!mute && clickAudio) {
      clickAudio.currentTime = 0;
      clickAudio.play();
    }
  };

  // Konami Code detection (case-insensitive, input odaklı değilse)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Eğer bir input, textarea veya contenteditable odaklıysa çalışmasın
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable)
      ) {
        return;
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const newCode = [...konamiCode, key];
      if (newCode.length > 10) {
        newCode.shift();
      }
      setKonamiCode(newCode);
      const konami = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "a",
      ];
      const normalized = newCode.map((k) =>
        k.length === 1 ? k.toLowerCase() : k
      );
      if (JSON.stringify(normalized) === JSON.stringify(konami)) {
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 3500);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konamiCode]);

  // Kullanıcı ilk etkileşimde müziği başlat
  useEffect(() => {
    if (musicStarted) return;
    const startMusic = () => {
      setMusicStarted(true);
    };
    window.addEventListener("pointerdown", startMusic, { once: true });
    return () => {
      window.removeEventListener("pointerdown", startMusic);
    };
  }, [musicStarted]);

  // Background music (kesintisiz ve volume güncellenebilir)
  useEffect(() => {
    if (typeof window === "undefined" || !musicStarted) return;
    if (!bgAudioRef.current) {
      bgAudioRef.current = new Audio("/game-8-bit-on-278083.mp3");
      bgAudioRef.current.loop = true;
      bgAudioRef.current.volume = volume;
      if (!mute) bgAudioRef.current.play().catch(() => {});
    } else {
      bgAudioRef.current.volume = volume;
      if (mute) {
        bgAudioRef.current.pause();
      } else {
        bgAudioRef.current.play().catch(() => {});
      }
    }
    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current.currentTime = 0;
        bgAudioRef.current = null;
      }
    };
  }, [mute, musicStarted]);

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    setShowPixels(true);
  }, []);

  const skills = skillsData as { name: string; level: number }[];
  const projects = projectsData as {
    title: string;
    description: string;
    tech: string[];
    link: string;
  }[];

  const about = aboutData as { bio: string; funFacts: string[] };
  const contact = contactData as {
    email: string;
    github: string;
    linkedin: string;
    phone: string;
    address: string;
  };

  const experiences = experiencesData as {
    title: string;
    company: string;
    period: string;
    location: string;
    description: string;
    tech: string[];
  }[];

  return (
    <>
      <Head>
        <title>8-Bit Portfolio | Frontend Developer</title>
        <meta
          name="description"
          content="A fun, interactive 8-bit retro style portfolio website showcasing frontend development skills and projects."
        />
        <meta
          property="og:title"
          content="8-Bit Portfolio | Frontend Developer"
        />
        <meta
          property="og:description"
          content="A fun, interactive 8-bit retro style portfolio website showcasing frontend development skills and projects."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/profile.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="8-Bit Portfolio | Frontend Developer"
        />
        <meta
          name="twitter:description"
          content="A fun, interactive 8-bit retro style portfolio website showcasing frontend development skills and projects."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        className={`min-h-screen transition-colors duration-500 bg-green-50 overflow-x-hidden`}
      >
        {/* Theme Toggle ve Mute/Volume */}
        <div className="theme-toggle flex flex-col items-end gap-2">
          <button
            onClick={() => setMute(!mute)}
            className="pixel-button flex items-center justify-center"
            aria-label={mute ? "Unmute music" : "Mute music"}
          >
            {mute ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 mt-1 pixel-slider"
            disabled={mute}
            aria-label="Music volume"
          />
        </div>

        {/* Floating Pixels */}
        {showPixels &&
          [...Array(20)].map((_, i) => (
            <div
              key={i}
              className="floating-pixel"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}

        {/* Fireworks Easter Egg */}
        {showFireworks && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(7)].map((_, fireworkIdx) => {
              // Her bir havai fişek için merkez ve renk seç
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;
              const color = randomColor();
              const count = 18;
              return (
                <React.Fragment key={fireworkIdx}>
                  {[...Array(count)].map((_, i) => {
                    const angle = (2 * Math.PI * i) / count;
                    const distance = 320 + Math.random() * 80;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    return (
                      <motion.div
                        key={fireworkIdx + "-" + i}
                        className="absolute"
                        style={{
                          left: centerX,
                          top: centerY,
                          width: 18 + Math.random() * 16,
                          height: 18 + Math.random() * 16,
                          borderRadius: "50%",
                          background: color,
                          boxShadow: `0 0 16px 4px ${color}`,
                        }}
                        initial={{
                          x: 0,
                          y: 0,
                          scale: 0.5,
                          opacity: 1,
                        }}
                        animate={{
                          x,
                          y,
                          scale: [0.5, 1.2, 0.8, 0],
                          opacity: [1, 1, 0],
                        }}
                        transition={{
                          duration: 2.2,
                          delay: fireworkIdx * 0.25 + Math.random() * 0.2,
                        }}
                      />
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div className="text-center z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="max-w-[220px] w-full aspect-square mx-auto bg-green-400 pixel-border rounded-lg flex items-center justify-center overflow-hidden inline-block">
                {/* Profil fotoğrafı */}
                <Image
                  src="/profile.png"
                  alt="Profile"
                  className="w-full h-full object-cover pixel-avatar"
                  style={{ imageRendering: "pixelated" }}
                  width={220}
                  height={220}
                  priority
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-green-800 mb-4"
            >
              HELLO WORLD!
            </motion.h1>

            {/* Ad Soyad */}
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-2xl text-green-900 mb-2 font-bold"
            >
              Tuğcan Turunçkapı
            </motion.p>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-green-700 mb-8"
            >
              I&apos;M A FRONTEND DEVELOPER
            </motion.p>

            <motion.button
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pixel-button text-lg"
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              START GAME
            </motion.button>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 scroll-mt-32">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-12"
            >
              ABOUT ME
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="text-center"
              >
                <div className="w-48 h-48 mx-auto bg-green-400 pixel-border rounded-lg flex items-center justify-center text-8xl mb-6">
                  🎮
                </div>
                <p className="text-green-700 text-sm leading-relaxed">
                  PASSIONATE FRONTEND DEVELOPER WHO LOVES CREATING INTERACTIVE
                  AND BEAUTIFUL WEB EXPERIENCES. I SPECIALIZE IN REACT,
                  TYPESCRIPT, AND MODERN WEB TECHNOLOGIES.
                </p>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="space-y-4"
              >
                <div className="pixel-card">
                  <h3 className="text-lg font-bold text-green-800 mb-2">
                    FUN FACTS
                  </h3>
                  <ul className="text-sm text-green-700 space-y-2">
                    {about.funFacts.map((fact, index) => (
                      <li key={index}>• {fact}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 px-4 bg-green-100 scroll-mt-32">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-12"
            >
              SKILLS & XP
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="pixel-card"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-green-800">
                      {skill.name}
                    </span>
                    <span className="text-xs text-green-600">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="skill-bar">
                    <motion.div
                      className="skill-progress"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="py-20 px-4 bg-green-50 scroll-mt-32">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-12">
              EDUCATION
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {(
                educationData as {
                  school: string;
                  degree: string;
                  field: string;
                  startYear: number;
                  endYear: number;
                  description: string;
                }[]
              ).map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="pixel-card"
                >
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    {edu.school}
                  </h3>
                  <p className="text-green-600 font-semibold mb-1">
                    {edu.degree} - {edu.field}
                  </p>
                  <p className="text-gray-600 mb-2">
                    {edu.startYear} - {edu.endYear}
                  </p>
                  <p className="text-gray-700">{edu.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experiences Section */}
        <section id="experiences" className="py-20 px-4 bg-white scroll-mt-32">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-12">
              EXPERIENCES
            </h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="pixel-card"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-green-800 mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-green-600 font-semibold">
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right mt-2 md:mt-0">
                      <p className="text-gray-600 font-medium">{exp.period}</p>
                      <p className="text-gray-500 text-sm">{exp.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4 scroll-mt-32">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-12"
            >
              PROJECTS
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 overflow-x-hidden">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="pixel-card cursor-pointer overflow-hidden break-words transition-all duration-200 hover:shadow-2xl hover:brightness-110 focus:shadow-2xl focus:brightness-110 focus:outline-none"
                  onClick={() => {
                    window.open(project.link, "_blank");
                    playClick();
                  }}
                  tabIndex={0}
                >
                  <h3 className="text-lg font-bold text-green-800 mb-2 break-words">
                    {project.title}
                  </h3>
                  <p className="text-sm text-green-700 mb-4 break-words">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-green-300 text-green-800 text-xs font-bold break-words"
                        onClick={playClick}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-green-100 scroll-mt-32">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-12"
            >
              CONTACT ME
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="space-y-6"
              >
                <div className="pixel-card">
                  <h3 className="text-lg font-bold text-green-800 mb-4">
                    GET IN TOUCH
                  </h3>
                  <div className="space-y-4">
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center space-x-3 hover:text-green-500 transition-colors cursor-pointer no-underline"
                      onClick={playClick}
                      style={{ color: "inherit" }}
                    >
                      <Mail className="text-green-600" size={20} />
                      <span className="text-sm text-green-700">
                        {contact.email}
                      </span>
                    </a>
                    <a
                      href={`https://${contact.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 hover:text-green-500 transition-colors cursor-pointer no-underline"
                      onClick={playClick}
                      style={{ color: "inherit" }}
                    >
                      <Github className="text-green-600" size={20} />
                      <span className="text-sm text-green-700">
                        {contact.github}
                      </span>
                    </a>
                    <a
                      href={`https://${contact.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 hover:text-green-500 transition-colors cursor-pointer no-underline"
                      onClick={playClick}
                      style={{ color: "inherit" }}
                    >
                      <Linkedin className="text-green-600" size={20} />
                      <span className="text-sm text-green-700">
                        {contact.linkedin}
                      </span>
                    </a>
                  </div>
                </div>

                <button className="pixel-button w-full flex items-center justify-center space-x-2">
                  <Download size={16} />
                  <span>DOWNLOAD RESUME</span>
                </button>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="pixel-card"
              >
                <h3 className="text-lg font-bold text-green-800 mb-4">
                  SEND MESSAGE
                </h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="YOUR NAME"
                    className="pixel-input"
                    onClick={playClick}
                  />
                  <input
                    type="email"
                    placeholder="YOUR EMAIL"
                    className="pixel-input"
                    onClick={playClick}
                  />
                  <textarea
                    placeholder="YOUR MESSAGE"
                    rows={4}
                    className="pixel-input resize-none"
                    onClick={playClick}
                  />
                  <button
                    type="submit"
                    className="pixel-button w-full"
                    onClick={playClick}
                  >
                    SEND MESSAGE
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 text-center">
          <p className="text-sm text-green-700">
            © 2025 8-BIT PORTFOLIO. MADE WITH ❤️ AND PIXELS.
          </p>
          <p className="text-xs text-green-600 mt-2">
            TRY THE KONAMI CODE FOR A SURPRISE! ↑↑↓↓←→←→BA
          </p>
        </footer>
      </div>
    </>
  );
}

function randomColor() {
  const colors = [
    "#FFD700", // gold
    "#FF69B4", // pink
    "#00FFFF", // cyan
    "#FF4500", // orange
    "#00FF00", // lime
    "#1E90FF", // blue
    "#FF6347", // tomato
    "#9400D3", // purple
    "#FFF", // white
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
