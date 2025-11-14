import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// --- (1) KONEKSI KE BACKEND ---
const API_URL = 'http://localhost:3001/api';
const SOCKET_URL = 'http://localhost:3001';

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

    // Cleanup listener
    return () => { socket.off('userCount'); };
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
    <div className="min-h-screen bg-black text-gray-100 font-sans">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 w-full bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-800">
        <nav className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <a href="#" className="text-2xl font-bold text-gray-100 hover:text-gray-300 transition-colors">
            Nat.dev
          </a>
          <div className="flex space-x-6 text-lg">
            <a href="#skills" className="text-gray-400 hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projects</a>
            <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
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

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Saya membangun arsitektur web yang skalabel, high-performance, dan Real-Time. 
            Kombinasi dari Fullstack (Node.js/TypeScript) dan DevOps (AWS/Terraform/Ansible) membuat saya siap mengelola aplikasi mission-critical.
          </p>
        </section>

        {/* --- SKILLS SECTION (T-SHAPED) --- */}
        <section id="skills" className="py-20 border-t border-gray-800">
          <h2 className="text-4xl font-bold mb-12 text-center">My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">T-Shaped</span> Expertise</h2>
          
          {/* Pake "glassmorphism" style: bg-opacity + border */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 bg-opacity-70 p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
              <h3 className="text-3xl font-bold mb-6 text-orange-400">Platform & DevOps (My Edge)</h3>
              <ul className="space-y-3 text-lg text-gray-300">
                <li><span className="font-bold text-white">Cloud:</span> AWS (EC2, S3, RDS), GCP</li>
                <li><span className="font-bold text-white">IaaC:</span> Terraform, Ansible</li>
                <li><span className="font-bold text-white">CI/CD:</span> GitHub Actions, Jenkins</li>
                <li><span className="font-bold text-white">Container:</span> Docker, Docker Compose</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 bg-opacity-70 p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
              <h3 className="text-3xl font-bold mb-6 text-teal-400">Fullstack Development</h3>
              <ul className="space-y-3 text-lg text-gray-300">
                <li><span className="font-bold text-white">Frontend:</span> React, Angular, Vue.js, TypeScript</li>
                <li><span className="font-bold text-white">Backend:</span> Node.js (TS), Python, Go</li>
                <li><span className="font-bold text-white">Database:</span> PostgreSQL, MySQL, MongoDB, Redis</li>
                <li><span className="font-bold text-white">API:</span> RESTful APIs, GraphQL (Basic)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- PROJECTS SECTION (DARI DATABASE) --- */}
        <section id="projects" className="py-20 border-t border-gray-800">
          <h2 className="text-4xl font-bold mb-12 text-center">Mission-Critical <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Projects</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {projects.length > 0 ? (
              // Looping data dari state projects
              projects.map((project) => (
                <div key={project.id} className="bg-gray-900 bg-opacity-70 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 group transition-all duration-300 hover:border-blue-500 hover:shadow-blue-500/20">
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
                </div>
              ))
            ) : (
              // Ini kalau data project belom ke-load dari backend
              <p className="text-center md:col-span-2 text-gray-500">Backend sedang mengambil data projects...</p>
            )}

            {/* CARD PROYEK INVENTORY MANUAL (Sebagai fallback) */}
            <div className="bg-gray-900 bg-opacity-70 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 group transition-all duration-300 hover:border-teal-500 hover:shadow-teal-500/20">
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
            </div>

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
  );
}

export default App;