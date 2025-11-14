import { makeQueries } from './src/database/queries';
import { Project } from './src/database/types'; // Import Project type
import { getConfig } from './src/config'; // Import getConfig

async function addProjectData() {
  try {
    const config = getConfig(); // Get configuration, including databaseUrl
    const queries = makeQueries(config.databaseUrl);

    const projectData: Omit<Project, 'id'> = {
      name: 'Inventory App & Order Picking',
      description: 'Sistem Inventaris & Order Picking adalah aplikasi full-stack berbasis peran (Role-Based Access Control / RBAC) yang dirancang untuk mendigitalkan dan mengefisienkan seluruh alur kerja gudang, mulai dari pembuatan pesanan hingga pengurangan stok secara otomatis. Proyek ini bertujuan untuk menghilangkan error manual dan menyediakan sumber data tunggal yang aman dan andal.',
      image_url: '/halaman Dashboard admin panel website inventory.png',
      project_url: '#',
      source_code_url: '#',
      tech_used: 'Node.js, Express, MySQL, Prisma, React, Vite, React-Bootstrap, JWT, bcryptjs',
    };

    const newProject = await queries.addProject(projectData);
    console.log('Project added successfully:', newProject);
  } catch (error) {
    console.error('Failed to add project:', error);
    process.exit(1);
  } finally {
    // It's good practice to close the pool if it's not managed globally
    // For this temporary script, we can let the process exit.
  }
}

addProjectData();
