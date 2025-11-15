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
const API_URL = '/api';
const SOCKET_URL = '/';

const socket = io(SOCKET_URL);

// --- (2) DEFINISI TIPE DATA ---
interface IProject {
  id: number;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
  github_url: string;
  tech_stack: string;
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
  const navLinks = React.useMemo(() => [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
    { href: '#resume', label: 'Resume' },
  ], []);

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
      }, [navLinks]); // Added navLinks to dependency array
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
    <div className="relative min-h-screen font-sans text-gray-100 bg-black">
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
        style={{ opacity: 0.3 }} // Added opacity here
      />
      <div className="relative z-10">
        {/* --- HEADER --- */}
        <header className={`sticky top-0 z-50 w-full bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-800 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
          <nav className="flex items-center justify-between max-w-6xl px-4 mx-auto">
            <a href="#" className={`font-bold text-gray-100 hover:text-gray-300 transition-colors ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
              NATTE TECH
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
        <main className="max-w-6xl p-4 pt-12 mx-auto">

          {/* --- HERO SECTION --- */}
          <section id="hero" className="py-24 text-center md:py-32">

            <h1 className="mb-6 text-5xl font-extrabold md:text-7xl">
              Nathanael Ignacio Janis
            </h1>

            {/* INI DIA ANIMASI DARI REACTBITS.DEV */}
            <h2 className="mb-8 text-4xl font-bold md:text-6xl">
              <span className="text-transparent animate-text bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text">
                Fullstack & DevOps Engineer
              </span>
            </h2>

            <p className="max-w-3xl mx-auto mb-10 text-xl text-white">
              Saya membangun arsitektur web yang skalabel, high-performance, dan Real-Time. 
              Kombinasi dari Fullstack (Node.js/TypeScript) dan DevOps (AWS/Terraform/Ansible) membuat saya siap mengelola aplikasi mission-critical.
            </p>

            {/* Logo Loop for Tech Stack */}
            <div className="py-8 my-12 bg-gray-900 border border-gray-700 shadow-2xl bg-opacity-70 rounded-2xl">
              <h3 className="mb-6 text-2xl font-bold text-center text-white">My Tech Stack</h3>
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
            <h2 className="mb-12 text-4xl font-bold text-center">About <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Me</span></h2>
            <div className="max-w-3xl mx-auto text-lg text-center text-white">
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
            <h2 className="mb-12 text-4xl font-bold text-center">My <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400">Resume</span></h2>
            <div className="max-w-3xl mx-auto text-lg text-center text-white">
              <p className="mb-4">
                Untuk informasi lebih detail mengenai pengalaman kerja, pendidikan, dan daftar lengkap keahlian saya, silakan unduh resume saya.
              </p>
              <a href="/resumes/NJANIS Resume Jobstreet .pdf" download className="inline-block px-6 py-3 text-xl font-bold text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500">
                Download Resume
              </a>
            </div>
          </section>

          {/* --- SKILLS SECTION (T-SHAPED) --- */}
          <section id="skills" className="py-20 border-t border-gray-800">
            <h2 className="mb-12 text-4xl font-bold text-center">My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">T-Shaped</span> Expertise</h2>
            
            {/* Pake "glassmorphism" style: bg-opacity + border */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <GlareHover className="p-8 bg-gray-900 border border-gray-700 shadow-2xl bg-opacity-70 rounded-2xl backdrop-blur-sm">
                <h3 className="mb-6 text-3xl font-bold text-orange-400">Platform & DevOps (My Edge)</h3>
                <ul className="space-y-3 text-lg text-gray-300">
                  <li><span className="font-bold text-white">Cloud:</span> AWS (EC2, S3, RDS), GCP</li>
                  <li><span className="font-bold text-white">IaaC:</span> Terraform, Ansible</li>
                  <li><span className="font-bold text-white">CI/CD:</span> GitHub Actions, Jenkins</li>
                  <li><span className="font-bold text-white">Container:</span> Docker, Docker Compose</li>
                </ul>
              </GlareHover>
              
              <GlareHover className="p-8 bg-gray-900 border border-gray-700 shadow-2xl bg-opacity-70 rounded-2xl backdrop-blur-sm">
                <h3 className="mb-6 text-3xl font-bold text-teal-400">Fullstack Development</h3>
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
            <h2 className="mb-12 text-4xl font-bold text-center">Mission-Critical <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Projects</span></h2>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              
              {projects.length > 0 ? (
                // Looping data dari state projects
                projects.map((project) => (
                  <GlareHover key={project.id} className="overflow-hidden transition-all duration-300 bg-gray-900 border border-gray-700 shadow-2xl bg-opacity-70 rounded-2xl group hover:border-blue-500 hover:shadow-blue-500/20">
                    <img src={project.image_url} alt={project.title} className="object-cover w-full h-56 transition-transform duration-300 group-hover:scale-105"/>
                    <div className="p-8">
                      <h3 className="mb-3 text-2xl font-bold">{project.title}</h3>
                      <p className="mb-5 text-gray-400">{project.description}</p>
                      <p className="mb-6 text-sm font-semibold text-blue-300">Tech: {project.tech_stack}</p>
                      <div className="flex space-x-4">
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2 font-medium text-white transition-colors bg-gray-700 rounded-lg hover:bg-gray-600">Source Code</a>
                        {project.live_url && ( // Only show Live Demo if URL exists
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-500">Live Demo</a>
                        )}
                      </div>
                    </div>
                  </GlareHover>
                ))
              ) : (
                // Ini kalau data project belom ke-load dari backend
                <p className="text-center text-gray-500 md:col-span-2">Backend sedang mengambil data projects...</p>
              )}

            </div>
          </section>

          {/* --- CONTACT SECTION (FUNGSIOAL) --- */}
          <section id="contact" className="py-20 border-t border-gray-800">
            <h2 className="mb-12 text-4xl font-bold text-center">Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Touch</span></h2>
            <form onSubmit={handleContactSubmit} className="max-w-xl p-8 mx-auto bg-gray-900 border border-gray-700 shadow-2xl bg-opacity-70 rounded-2xl">
              <div className="mb-5">
                <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-300">Full Name</label>
                <input 
                  type="text" id="name" required
                  className="w-full p-4 text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactForm.name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-lg font-medium text-gray-300">Email</label>
                <input 
                  type="email" id="email" required
                  className="w-full p-4 text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactForm.email}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-8">
                <label htmlFor="message" className="block mb-2 text-lg font-medium text-gray-300">Message</label>
                <textarea 
                  id="message" rows={5} required
                  className="w-full p-4 text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactForm.message}
                  onChange={handleFormChange}
                ></textarea>
              </div>
              <button type="submit" className="w-full px-6 py-4 text-xl font-bold text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500">
                Send Me Message
              </button>
            </form>
          </section>
        </main>

        {/* --- FOOTER --- */}
        <footer className="py-10 text-center text-gray-500 border-t border-gray-800">
          <p>Built by Natte</p>
          <p>&copy; 2025</p>
        </footer>
      </div>
    </div>
  );
}

export default App;