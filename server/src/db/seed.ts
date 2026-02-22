import { db } from './index';
import { users, profiles, skills, experiences, projects, seoMeta, policyPages } from './schema';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // 1. Create Admin User
    console.log('Creating admin user...');
    const hashedPassword = await argon2.hash(process.env.ADMIN_PASSWORD || 'Admin@123456');

    await db.insert(users).values({
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    });
    console.log('✅ Admin user created');

    // 2. Create Profile
    console.log('Creating developer profile...');
    await db.insert(profiles).values({
      name: 'Rakibul Islam',
      title: 'Full-Stack Developer',
      bio: `I'm a Full-Stack Developer with 2+ years of professional experience building scalable web applications. I specialize in React, Next.js, Node.js, and Express, with expertise in REST APIs, real-time systems, DevOps, and performance-driven development.

I'm passionate about creating clean, maintainable code and delivering exceptional user experiences. My approach combines modern development practices with a deep understanding of both frontend and backend technologies.

When I'm not coding, I enjoy exploring new technologies, contributing to open source, and sharing knowledge with the developer community.`,
      email: 'irakibul026@gmail.com',
      phone: '+91 9101910265',
      location: 'Guwahati, Assam, India',
      photoUrl: '/images/profile.jpg',
      resumeUrl: '/downloads/rakibul_resume.pdf',
      githubUrl: 'https://github.com/Rakib7425',
      linkedinUrl: 'https://linkedin.com/in/rakibul-islam',
      twitterUrl: 'https://twitter.com/rakibulislam',
    });

    console.log('✅ Profile created');

    // 3. Create Skills
    console.log('Creating skills...');
    const skillsData = [
      // Frontend
      { name: 'React', category: 'Frontend', proficiency: 90, icon: 'react', order: 1 },
      { name: 'Next.js', category: 'Frontend', proficiency: 85, icon: 'nextjs', order: 2 },
      { name: 'TypeScript', category: 'Frontend', proficiency: 85, icon: 'typescript', order: 3 },
      { name: 'JavaScript', category: 'Frontend', proficiency: 90, icon: 'javascript', order: 4 },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 90, icon: 'tailwind', order: 5 },
      { name: 'Redux', category: 'Frontend', proficiency: 80, icon: 'redux', order: 6 },
      { name: 'Framer Motion', category: 'Frontend', proficiency: 75, icon: 'framer', order: 7 },

      // Backend
      { name: 'Node.js', category: 'Backend', proficiency: 90, icon: 'nodejs', order: 8 },
      { name: 'Express.js', category: 'Backend', proficiency: 90, icon: 'express', order: 9 },
      { name: 'NestJS', category: 'Backend', proficiency: 70, icon: 'nestjs', order: 10 },
      { name: 'PostgreSQL', category: 'Backend', proficiency: 85, icon: 'postgresql', order: 11 },
      { name: 'MongoDB', category: 'Backend', proficiency: 80, icon: 'mongodb', order: 12 },
      { name: 'Prisma', category: 'Backend', proficiency: 85, icon: 'prisma', order: 13 },
      { name: 'Drizzle ORM', category: 'Backend', proficiency: 75, icon: 'drizzle', order: 14 },
      { name: 'Redis', category: 'Backend', proficiency: 75, icon: 'redis', order: 15 },
      { name: 'GraphQL', category: 'Backend', proficiency: 70, icon: 'graphql', order: 16 },

      // DevOps & Tools
      { name: 'Docker', category: 'DevOps', proficiency: 80, icon: 'docker', order: 17 },
      { name: 'AWS', category: 'DevOps', proficiency: 75, icon: 'aws', order: 18 },
      { name: 'CI/CD', category: 'DevOps', proficiency: 75, icon: 'cicd', order: 19 },
      { name: 'Nginx', category: 'DevOps', proficiency: 70, icon: 'nginx', order: 20 },
      { name: 'Git', category: 'DevOps', proficiency: 90, icon: 'git', order: 21 },
      { name: 'Jest', category: 'DevOps', proficiency: 80, icon: 'jest', order: 22 },
    ];

    await db.insert(skills).values(skillsData);
    console.log('✅ Skills created');

    // 4. Create Experiences
    console.log('Creating work experiences...');
    const experiencesData = [
      {
        company: 'Maxlence Consultant.',
        position: 'Full-Stack Developer',
        location: 'Gurgaon, India',
        startDate: new Date('2024-03-03'),
        endDate: new Date('2025-03-20'),
        current: false,
        description: `Leading development of enterprise web applications using React, Next.js, and Node.js. 
        
• Architected and deployed scalable microservices handling 100K+ daily users
• Reduced API response time by 40% through Redis caching and query optimization
• Implemented CI/CD pipelines with GitHub Actions and AWS
• Mentored junior developers and conducted code reviews`,
        technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
        order: 2,
      },
      {
        company: 'Sthaniya Saathi',
        position: 'Senior Full-Stack Developer',
        location: 'Guwahati, Assam, India',
        startDate: new Date('2025-03-03'),
        endDate: new Date('2026-01-26'),
        current: false,
        description: `Developed and maintained multiple client-facing web applications.

• Built e-commerce platforms with payment gateway integration
• Created RESTful APIs serving mobile and web clients
• Implemented real-time features using Socket.io
• Collaborated with design team to deliver pixel-perfect UIs`,
        technologies: ['React', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Socket.io'],
        order: 1,
      },
    ];

    await db.insert(experiences).values(experiencesData);
    console.log('✅ Experiences created');

    // 5. Create Projects
    console.log('Creating projects...');
    const projectsData = [
      {
        title: 'Easy15 E-commerce Platform',
        description: 'Full-featured e-commerce platform with product management, cart, checkout, and payment integration',
        longDesc: `A comprehensive e-commerce solution built with the MERN stack, featuring:

• Product catalog with search, filtering, and sorting
• Shopping cart and wishlist functionality
• Secure checkout with Stripe payment integration
• Admin dashboard for inventory and order management
• User authentication and profile management
• Order tracking and email notifications
• Responsive design with Tailwind CSS`,
        imageUrl: '/images/projects/easy15.jpg',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe', 'Tailwind CSS'],
        liveUrl: 'https://easy15.example.com',
        repoUrl: 'https://github.com/Rakib7425/easy15',
        featured: true,
        order: 1,
      },
      {
        title: 'MERN Portfolio Website',
        description: 'Personal portfolio built with the MERN stack featuring blog, project showcase, and contact form',
        longDesc: `A full-stack portfolio website showcasing projects and blog posts:

• Dynamic content management through admin panel
• Blog system with markdown support
• Contact form with email notifications
• Analytics dashboard
• SEO optimized with meta tags
• Dark mode support`,
        imageUrl: '/images/projects/portfolio.jpg',
        technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'Redux', 'JWT'],
        liveUrl: 'https://portfolio.example.com',
        repoUrl: 'https://github.com/Rakib7425/mern-portfolio',
        featured: true,
        order: 2,
      },
      {
        title: 'CodePen Clone',
        description: 'Online code editor for HTML, CSS, and JavaScript with live preview',
        longDesc: `A web-based code editor inspired by CodePen:

• Real-time code compilation and preview
• Support for HTML, CSS, JavaScript
• Save and share code snippets
• Responsive split-pane editor
• Syntax highlighting with Monaco Editor
• Export code as files`,
        imageUrl: '/images/projects/codepen.jpg',
        technologies: ['React', 'Monaco Editor', 'Node.js', 'PostgreSQL', 'Express'],
        liveUrl: 'https://codepen-clone.example.com',
        repoUrl: 'https://github.com/Rakib7425/codepen-clone',
        featured: true,
        order: 3,
      },
      {
        title: 'Furni.Shop',
        description: 'Modern furniture e-commerce store with advanced filtering and 3D product previews',
        longDesc: `An elegant furniture shopping platform:

• 3D product visualization
• Advanced filtering by category, price, color
• Comparison feature
• User reviews and ratings
• Wishlist and favorites
• Responsive design optimized for mobile shopping`,
        imageUrl: '/images/projects/furni.jpg',
        technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Three.js', 'Stripe'],
        liveUrl: 'https://furni.shop',
        repoUrl: 'https://github.com/Rakib7425/furni-shop',
        featured: true,
        order: 4,
      },
      {
        title: 'Beyoung E-commerce',
        description: 'Fashion e-commerce platform with size recommendations and virtual try-on',
        longDesc: `A modern fashion retail platform:

• AI-powered size recommendations
• Virtual try-on feature
• Personalized product recommendations
• Multi-currency support
• Inventory management
• Order tracking system`,
        imageUrl: '/images/projects/beyoung.jpg',
        technologies: ['React', 'Node.js', 'MongoDB', 'Redis', 'AWS S3'],
        liveUrl: 'https://beyoung.example.com',
        repoUrl: 'https://github.com/Rakib7425/beyoung',
        featured: false,
        order: 5,
      },
      {
        title: 'API Gateway Service',
        description: 'Microservices API gateway with rate limiting, authentication, and load balancing',
        longDesc: `A robust API gateway for microservices architecture:

• Request routing and load balancing
• JWT-based authentication
• Rate limiting with Redis
• Request/response logging
• Health check monitoring
• Circuit breaker pattern implementation`,
        imageUrl: '/images/projects/gateway.jpg',
        technologies: ['Node.js', 'Express', 'Redis', 'PostgreSQL', 'Docker', 'Nginx'],
        liveUrl: null,
        repoUrl: 'https://github.com/Rakib7425/api-gateway',
        featured: false,
        order: 6,
      },
    ];

    await db.insert(projects).values(projectsData);
    console.log('✅ Projects created');

    // 6. Create SEO Metadata
    console.log('Creating SEO metadata...');
    const seoData = [
      {
        page: '/',
        title: 'Rakibul Islam - Full-Stack Developer | React, Next.js, Node.js',
        description: 'Full-Stack Developer with 2+ years of experience building scalable web applications using React, Next.js, Node.js, and modern web technologies.',
        keywords: ['Full-Stack Developer', 'React Developer', 'Next.js', 'Node.js', 'TypeScript', 'Web Development'],
        ogImage: '/images/og-home.jpg',
      },
      {
        page: '/about',
        title: 'About Me - Rakibul Islam',
        description: 'Learn more about my journey as a Full-Stack Developer, my skills, and what drives me to create exceptional web applications.',
        keywords: ['About', 'Developer Bio', 'Full-Stack Developer', 'Professional Experience'],
        ogImage: '/images/og-about.jpg',
      },
      {
        page: '/skills',
        title: 'Skills & Technologies - Rakibul Islam',
        description: 'Explore my technical skills across Frontend, Backend, and DevOps technologies including React, Node.js, PostgreSQL, AWS, and more.',
        keywords: ['Skills', 'Technologies', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
        ogImage: '/images/og-skills.jpg',
      },
      {
        page: '/experience',
        title: 'Work Experience - Rakibul Islam',
        description: 'My professional journey as a Full-Stack Developer, including roles, responsibilities, and achievements.',
        keywords: ['Work Experience', 'Career', 'Professional Experience', 'Full-Stack Developer'],
        ogImage: '/images/og-experience.jpg',
      },
      {
        page: '/projects',
        title: 'Projects & Portfolio - Rakibul Islam',
        description: 'Explore my portfolio of web applications including e-commerce platforms, SaaS products, and open-source projects.',
        keywords: ['Projects', 'Portfolio', 'Web Applications', 'E-commerce', 'MERN Stack'],
        ogImage: '/images/og-projects.jpg',
      },
      {
        page: '/contact',
        title: 'Contact Me - Rakibul Islam',
        description: 'Get in touch for collaboration, job opportunities, or just to say hello. I\'m always open to new opportunities.',
        keywords: ['Contact', 'Hire Developer', 'Collaboration', 'Get in Touch'],
        ogImage: '/images/og-contact.jpg',
      },
    ];

    await db.insert(seoMeta).values(seoData);
    console.log('✅ SEO metadata created');

    // 7. Create Policy Pages (Privacy Policy, Terms of Service)
    console.log('Creating policy pages...');
    const privacyContent = `<h2>Privacy Policy</h2>
<p>Last updated: ${new Date().toLocaleDateString()}</p>
<h3>1. Information We Collect</h3>
<p>We may collect personal information you provide when using this portfolio site, such as your name, email address, and any messages you send through the contact form.</p>
<h3>2. How We Use Your Information</h3>
<p>We use the information to respond to your inquiries, improve this site, and send occasional updates if you subscribe to our newsletter. We do not sell or share your data with third parties for marketing.</p>
<h3>3. Cookies and Analytics</h3>
<p>We may use cookies and similar technologies to understand how visitors use this site. You can disable cookies in your browser settings.</p>
<h3>4. Data Security</h3>
<p>We take reasonable measures to protect your personal information. However, no transmission over the internet is fully secure.</p>
<h3>5. Your Rights</h3>
<p>You may request access to, correction of, or deletion of your personal data by contacting us.</p>
<h3>6. Changes</h3>
<p>We may update this Privacy Policy from time to time. The updated version will be posted on this page.</p>`;

    const termsContent = `<h2>Terms of Service</h2>
<p>Last updated: ${new Date().toLocaleDateString()}</p>
<h3>1. Acceptance of Terms</h3>
<p>By accessing and using this portfolio website, you accept and agree to be bound by these Terms of Service.</p>
<h3>2. Use of the Site</h3>
<p>You may use this site for personal, non-commercial purposes. You agree not to misuse the site, attempt to gain unauthorized access, or use it for any illegal purpose.</p>
<h3>3. Intellectual Property</h3>
<p>Content on this site, including text, images, and code, is owned by the site owner and is protected by copyright. You may not copy or redistribute it without permission.</p>
<h3>4. Contact Form and Communications</h3>
<p>When you submit a message through the contact form, you grant us the right to use that information to respond to you. We will not use your contact details for unsolicited marketing.</p>
<h3>5. Disclaimer</h3>
<p>This site and its content are provided "as is." We do not warrant that the site will be uninterrupted or error-free.</p>
<h3>6. Changes</h3>
<p>We may modify these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms.</p>`;

    await db.insert(policyPages).values([
      { slug: 'privacy-policy', title: 'Privacy Policy', content: privacyContent },
      { slug: 'terms-of-service', title: 'Terms of Service', content: termsContent },
    ]).onConflictDoNothing({ target: policyPages.slug });
    console.log('✅ Policy pages created');

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  - 1 admin user');
    console.log('  - 1 developer profile');
    console.log('  - 22 skills');
    console.log('  - 2 work experiences');
    console.log('  - 6 projects');
    console.log('  - 6 SEO pages');
    console.log('  - 2 policy pages\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
