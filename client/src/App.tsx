import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import PixelBlast from './components/PixelBlast';
import GlareHover from './components/GlareHover';
import LogoLoop from './components/LogoLoop'; // Import LogoLoop
import MobileMenu from './components/MobileMenu'; // Import MobileMenu
// import AnimatedNavLink from './components/AnimatedNavLink'; // Removed AnimatedNavLink import
import { // Import react-icons
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiPostgresql,
  SiDocker,
  SiGithub,
  SiAmazon, // Corrected from SiAmazonaws
  SiTerraform,
  SiAnsible,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiPython,
  SiGo,
  SiMongodb,
  SiGraphql,
  SiAngular,
  SiVuedotjs, // Corrected from SiVueDotJs
  SiMysql,
  SiJenkins
} from 'react-icons/si';

// --- (1) KONEKSI KE BACKEND ---
const API_URL = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

const socket = io(SOCKET_URL);

// --- (2) DEFINISI TIPE DATA ---
interface IProject {
  id: number;
  title: string;
  description: string;
  tech_stack: string;
  github_url: string;
  live_url: string;
}

interface IContactForm {
  name: string;
  email: string;
  message: string;
}

// --- (3) KOMPONEN APLIKASI UTAMA ---
const App = () => {
  // Fix 1: Menghapus FC, menggunakan generic useState<T>
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [contactForm, setContactForm] = useState<IContactForm>({
    name: '',
    email: '',
    message: '',
  });
  const [isScrolled, setIsScrolled] = useState<boolean>(false); // New state for scroll effect
  const [activeSection, setActiveSection] = useState<string>('#hero'); // New state for active section

  // Define navigation links
  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
    { href: '#resume', label: 'Resume' },
  ];

  // Define tech logos for LogoLoop
  const techLogos = [
    { node: <SiTypescript />, title: "TypeScript" },
    { node: <SiReact />, title: "React" },
    { node: <SiNodedotjs />, title: "Node.js" },
    { node: <SiPostgresql />, title: "PostgreSQL" },
    { node: <SiDocker />, title: "Docker" },
    { node: <SiGithub />, title: "GitHub" },
    { node: <SiAmazon />, title: "AWS" },
    { node: <SiTerraform />, title: "Terraform" },
    { node: <SiAnsible />, title: "Ansible" },
    { node: <SiTailwindcss />, title: "Tailwind CSS" },
    { node: <SiHtml5 />, title: "HTML5" },
    { node: <SiCss3 />, title: "CSS3" },
    { node: <SiJavascript />, title: "JavaScript" },
    { node: <SiPython />, title: "Python" },
    { node: <SiGo />, title: "Go" },
    { node: <SiMongodb />, title: "MongoDB" },
    { node: <SiGraphql />, title: "GraphQL" },
    { node: <SiAngular />, title: "Angular" },
    { node: <SiVuedotjs />, title: "Vue.js" },
    { node: <SiMysql />, title: "MySQL" },
    { node: <SiJenkins />, title: "Jenkins" },
  ];

  // --- (4) LOGIC (JANTUNG APLIKASI) ---
  useEffect(() => {
    // A. Dengerin event 'userCount'
    socket.on('userCount', (count: number) => {
      setOnlineCount(count);
    });

    // B. Ambil data project dari API Backend (Perbaikan bug 'unused function')
    const fetchProjects = async () => {
      try {
        const response = await axios.get<IProject[]>(`${API_URL}/projects`); 
        setProjects(response.data);
      } catch (error) {
        console.error("Gagal fetch projects (Backend mungkin belum nyala):", error);
      }
    };
    
    fetchProjects(); 

    // Handle scroll for navbar shrink effect
    const handleScroll = () => {
      if (window.scrollY > 50) { // Adjust scroll threshold as needed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for active section highlighting
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle 50% of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    }, observerOptions);

    // Observe all sections
    navLinks.forEach((link) => {
      const section = document.querySelector(link.href);
      if (section) {
        observer.observe(section);
      }
    });
    // Also observe the hero section
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
      observer.observe(heroSection);
    }


    // Cleanup listener and observer
    return () => { 
      socket.off('userCount'); 
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []); 

  // C. Fungsi buat ngirim form kontak
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/contact`, contactForm);
      alert("Pesan terkirim ke Database!");
      setContactForm({ name: '', email: '', message: '' }); // Reset form
    } catch (error) {
      console.error("Gagal kirim pesan:", error);
      alert("Gagal mengirim pesan.");
    }
  };

  // D. Fungsi buat ngubah input form
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.id]: e.target.value,
    });
  };

  // --- (5) TAMPILAN (VIEW) ---
  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans relative">
      <PixelBlast
        variant="circle"
        pixelSize={6}
        color="#B19EEF"
        patternScale={3}
        patternDensity={1.2}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={0.6}
        edgeFade={0.25}
        transparent
        className="fixed inset-0 z-0"
        style={{ opacity: 0.5 }} // Added opacity here
      />
      <div className="relative z-10">
        {/* --- HEADER --- */}
        <header className={`sticky top-0 z-50 w-full bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-800 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
          <nav className="max-w-6xl mx-auto flex justify-between items-center px-4">
            <a href="#" className={`font-bold text-gray-100 hover:text-gray-300 transition-colors ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
              Nat.dev
            </a>
            {/* Desktop Navigation */}
            <div className={`hidden md:flex space-x-6 text-lg transition-all duration-300`}>
              {navLinks.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className={`text-gray-400 hover:text-white transition-all duration-300 ease-out transform hover:scale-110 ${activeSection === link.href ? 'text-blue-400 font-bold' : ''}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <MobileMenu navLinks={navLinks} activeSection={activeSection} />
            </div>
          </nav>
        </header>

        {/* --- KONTEN UTAMA (DIBUNGKUS 'max-w-6xl' BIAR RAPI) --- */}
        <main className="max-w-6xl mx-auto p-4 pt-12">

          {/* --- HERO SECTION --- */}
          <section id="hero" className="text-center py-24 md:py-32">
            
            <div className="inline-block bg-green-800 bg-opacity-50 text-green-300 font-medium py-2 px-5 rounded-full shadow-lg border border-green-700 mb-8">
              🟢 {onlineCount} Visitors Online Now (Real-Time Proof)
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
              Nathanael Ignacio Janis
            </h1>

            {/* INI DIA ANIMASI DARI REACTBITS.DEV */}
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="animate-text bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Fullstack & DevOps Engineer
              </span>
            </h2>

            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10">
              Saya membangun arsitektur web yang skalabel, high-performance, dan Real-Time. 
              Kombinasi dari Fullstack (Node.js/TypeScript) dan DevOps (AWS/Terraform/Ansible) membuat saya siap mengelola aplikasi mission-critical.
            </p>

            {/* Logo Loop for Tech Stack */}
            <div className="my-12 py-8 bg-gray-900 bg-opacity-70 rounded-2xl shadow-2xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-center text-white">My Tech Stack</h3>
              <LogoLoop
                logos={techLogos}
                speed={80}
                direction="left"
                logoHeight={48}
                gap={40}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutColor="#000000" // Match background
                ariaLabel="Technology stack logos"
                className="h-24" // Control height of the loop
              />
            </div>
          </section>

          {/* --- ABOUT SECTION --- */}
          <section id="about" className="py-20 border-t border-gray-800">
            <h2 className="text-4xl font-bold mb-12 text-center">About <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Me</span></h2>
            <div className="max-w-3xl mx-auto text-lg text-gray-300 text-center">
              <p className="mb-4">
                Halo! Saya Nathanael Ignacio Janis, seorang Fullstack & DevOps Engineer yang bersemangat membangun solusi web yang skalabel dan berkinerja tinggi. Dengan pengalaman dalam pengembangan frontend dan backend, serta keahlian dalam otomatisasi infrastruktur, saya siap menghadapi tantangan teknis yang kompleks.
              </p>
              <p className="mb-4">
                Saya percaya pada pendekatan T-Shaped, menggabungkan kedalaman keahlian di bidang DevOps dan Fullstack dengan luasnya pengetahuan di berbagai teknologi. Tujuan saya adalah menciptakan aplikasi yang tidak hanya fungsional tetapi juga efisien, aman, dan mudah dikelola.
              </p>
              <p>
                Jelajahi portofolio saya untuk melihat proyek-proyek yang telah saya bangun dan teknologi yang saya kuasai.
              </p>
            </div>
          </section>

          {/* --- RESUME SECTION --- */}
          <section id="resume" className="py-20 border-t border-gray-800">
            <h2 className="text-4xl font-bold mb-12 text-center">My <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400">Resume</span></h2>
            <div className="max-w-3xl mx-auto text-lg text-gray-300 text-center">
              <p className="mb-4">
                Untuk informasi lebih detail mengenai pengalaman kerja, pendidikan, dan daftar lengkap keahlian saya, silakan unduh resume saya.
              </p>
              <a href="/path/to/your/resume.pdf" download className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-500 transition-all duration-300 text-xl shadow-lg">
                Download Resume (Placeholder)
              </a>
              <p className="mt-4 text-sm text-gray-500">
                (Ganti "/path/to/your/resume.pdf" dengan tautan resume Anda yang sebenarnya)
              </p>
            </div>
          </section>

          {/* --- SKILLS SECTION (T-SHAPED) --- */}
          <section id="skills" className="py-20 border-t border-gray-800">
            <h2 className="text-4xl font-bold mb-12 text-center">My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">T-Shaped</span> Expertise</h2>
            
            {/* Pake "glassmorphism" style: bg-opacity + border */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlareHover className="bg-gray-900 bg-opacity-70 p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
                <h3 className="text-3xl font-bold mb-6 text-orange-400">Platform & DevOps (My Edge)</h3>
                <ul className="space-y-3 text-lg text-gray-300">
                  <li><span className="font-bold text-white">Cloud:</span> AWS (EC2, S3, RDS), GCP</li>
                  <li><span className="font-bold text-white">IaaC:</span> Terraform, Ansible</li>
                  <li><span className="font-bold text-white">CI/CD:</span> GitHub Actions, Jenkins</li>
                  <li><span className="font-bold text-white">Container:</span> Docker, Docker Compose</li>
                </ul>
              </GlareHover>
              
              <GlareHover className="bg-gray-900 bg-opacity-70 p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
                <h3 className="text-3xl font-bold mb-6 text-teal-400">Fullstack Development</h3>
                <ul className="space-y-3 text-lg text-gray-300">
                  <li><span className="font-bold text-white">Frontend:</span> React, Angular, Vue.js, TypeScript</li>
                  <li><span className="font-bold text-white">Backend:</span> Node.js (TS), Python, Go</li>
                  <li><span className="font-bold text-white">Database:</span> PostgreSQL, MySQL, MongoDB</li>
                  <li><span className="font-bold text-white">API:</span> RESTful APIs, GraphQL (Basic)</li>
                </ul>
              </GlareHover>
            </div>
          </section>

          {/* --- PROJECTS SECTION (DARI DATABASE) --- */}
          <section id="projects" className="py-20 border-t border-gray-800">
            <h2 className="text-4xl font-bold mb-12 text-center">Mission-Critical <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Projects</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {projects.length > 0 ? (
                // Looping data dari state projects
                projects.map((project) => (
                  <GlareHover key={project.id} className="bg-gray-900 bg-opacity-70 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 group transition-all duration-300 hover:border-blue-500 hover:shadow-blue-500/20">
                    <img src="https://placehold.co/600x400/0A0A0A/7DD3FC?text=Project+Screenshot" alt={project.title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"/>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                      <p className="text-gray-400 mb-5">{project.description}</p>
                      <p className="font-semibold text-sm text-blue-300 mb-6">Tech: {project.tech_stack}</p>
                      <div className="flex space-x-4">
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="bg-gray-700 text-white py-2 px-5 rounded-lg hover:bg-gray-600 transition-colors font-medium">Source Code</a>
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-500 transition-colors font-medium">Live Demo</a>
                      </div>
                    </div>
                  </GlareHover>
                ))
              ) : (
                // Ini kalau data project belom ke-load dari backend
                <p className="text-center md:col-span-2 text-gray-500">Backend sedang mengambil data projects...</p>
              )}

              {/* CARD PROYEK INVENTORY MANUAL (Sebagai fallback) */}
              <GlareHover className="bg-gray-900 bg-opacity-70 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 group transition-all duration-300 hover:border-teal-500 hover:shadow-teal-500/20">
                <img src="https://placehold.co/600x400/0A0A0A/34D399?text=Inventory+App" alt="Project 2" className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"/>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">Sistem Inventaris & Order Picking</h3>
                  <p className="text-gray-400 mb-5">
                    Aplikasi mission-critical dengan fokus pada Integritas Transaksi (Prisma) dan RBAC untuk manajemen stok.
                  </p>
                  <p className="font-semibold text-sm text-teal-300 mb-6">Tech: React | Node.js | Prisma | MySQL | JWT</p>
                  <div className="flex space-x-4">
                    <a href="[LINK_GITHUB_INVENTORY]" target="_blank" rel="noopener noreferrer" className="bg-gray-700 text-white py-2 px-5 rounded-lg hover:bg-gray-600 transition-colors font-medium">Source Code</a>
                  </div>
                </div>
              </GlareHover>

            </div>
          </section>

          {/* --- CONTACT SECTION (FUNGSIOAL) --- */}
          <section id="contact" className="py-20 border-t border-gray-800">
            <h2 className="text-4xl font-bold mb-12 text-center">Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Touch</span></h2>
            <form onSubmit={handleContactSubmit} className="max-w-xl mx-auto bg-gray-900 bg-opacity-70 p-8 rounded-2xl shadow-2xl border border-gray-700">
              <div className="mb-5">
                <label htmlFor="name" className="block text-lg font-medium mb-2 text-gray-300">Full Name</label>
                <input 
                  type="text" id="name" required
                  className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactForm.name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="block text-lg font-medium mb-2 text-gray-300">Email</label>
                <input 
                  type="email" id="email" required
                  className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactForm.email}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-8">
                <label htmlFor="message" className="block text-lg font-medium mb-2 text-gray-300">Message</label>
                <textarea 
                  id="message" rows={5} required
                  className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactForm.message}
                  onChange={handleFormChange}
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-500 transition-all duration-300 text-xl shadow-lg">
                Send Message (Backend Aktif)
              </button>
            </form>
          </section>
        </main>

        {/* --- FOOTER --- */}
        <footer className="text-center py-10 border-t border-gray-800 text-gray-500">
          <p>Built by Natte with React(TS), Node.js(TS), PostgreSQL, Socket.io, and deployed with Docker & CI/CD.</p>
          <p>&copy; 2025</p>
        </footer>
      </div>
    </div>
  );
}

export default App;