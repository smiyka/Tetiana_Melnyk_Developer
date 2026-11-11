export const PROFILE = {
  name: 'Tetiana Melnyk',
  role: 'Software Developer',
  location: 'Milan, Italy',
  email: 'TetianaMelnyk89@gmail.com',
  github: 'https://github.com/smiyka',
  linkedin: 'https://www.linkedin.com/in/89-tetiana-melnyk',
  skillGroups: [
    {
      title: 'Frontend & accessibility',
      skills: ['Angular 18', 'TypeScript', 'JavaScript', 'RxJS', 'HTML5', 'CSS3', 'SCSS', 'Accessibility'],
    },
    { title: 'Backend & data', skills: ['.NET', 'REST APIs', 'SQL', 'PostgreSQL'] },
    {
      title: 'Testing & delivery',
      skills: ['Unit testing', 'Integration testing', 'E2E testing', 'Cypress', 'Jasmine/Karma', 'Git', 'Docker', 'Linux', 'Redis', 'RabbitMQ'],
    },
    {
      title: 'Collaboration & design',
      skills: ['Jira', 'Agile', 'Scrum', 'Figma', 'Adobe Illustrator', 'Claude Code', 'GitHub Copilot', 'Codex'],
    },
    { title: 'Earlier projects & training', skills: ['Java', 'Spring Boot', 'React', 'Redux'] },
  ],
  engagements: [
    {
      client: 'Namirial',
      sector: 'Digital signatures · Current engagement',
      description: 'Full-stack development with Angular 18, TypeScript and .NET: frontend features, REST API endpoints, business logic, database operations and automated tests.',
      detail: 'Since early 2026, I also analyze the codebase and requirements, plan changes and write Jira tasks for other developers. I work daily in English with an Agile/Scrum team across Italy and Austria.',
      stack: ['Angular 18', 'TypeScript', '.NET', 'REST APIs', 'SQL', 'PostgreSQL'],
    },
    {
      client: 'Siemens',
      sector: 'Energy · Earlier engagement',
      description: 'Full-stack development with Angular and Java/Spring Boot in an enterprise energy project.',
      detail: 'Worked with Docker, Linux, Redis and RabbitMQ.',
      stack: ['Angular', 'Java', 'Spring Boot', 'Docker', 'Redis', 'RabbitMQ'],
    },
    {
      client: 'RGI',
      sector: 'Insurance · Earlier engagement',
      description: 'Frontend development of Angular and TypeScript UI components for an insurance project.',
      detail: 'Developed and maintained end-to-end tests.',
      stack: ['Angular', 'TypeScript', 'E2E testing'],
    },
  ],
  learningProjects: [
    { title: 'MyBiKE', type: 'Landing page', description: 'A website built during frontend training, working from product requirements.' },
    { title: 'Eco-cosmetics shop', type: 'Landing page', description: 'A storefront landing page developed during the Mate Academy program.' },
    { title: '2048', type: 'Browser game', description: 'A game project exploring interactive behavior during frontend training.' },
    { title: 'React to-do app', type: 'Web application', description: 'A task management app built while learning React and reusable components.' },
  ],
  education: [
    { school: 'National Pedagogical Drahomanov University', degree: 'Bachelor’s Degree, Teacher of Mathematics and Computer Science', dates: '2012–2014' },
    { school: 'Bohdan Khmelnytskyi Cherkasy State University', degree: 'Bachelor’s Degree in Computer Software Engineering', dates: '2006–2011' },
  ],
  certifications: [
    { title: 'Certified Junior Angular Developer', issuer: 'Certificates.dev · January 2026', url: 'https://certificates.dev/angular/certificates/a0ed03af-c593-456d-8442-604351a7048c' },
    { title: 'DevOps Essentials', issuer: 'Coursera · August 2026', url: 'https://www.credly.com/badges/fdd4201e-64b2-4a15-b098-d1b98a13b7b3' },
  ],
  languages: ['Ukrainian · Native', 'Russian · Fluent', 'Italian · C1, self-assessed', 'English · B2, used daily at work'],
} as const;
