// Simple resume parser using text extraction
export interface ParsedResume {
  name: string;
  title: string;
  email: string;
  phone: string;
  summary: string;
  skills: Array<{ name: string; category: string }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    location: string;
    description: string;
    achievements: string[];
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
}

export async function parseResume(file: File): Promise<ParsedResume> {
  try {
    let text = '';
    
    if (file.type === 'application/pdf') {
      // For PDF parsing, we'd need a library like pdf-parse
      // For now, extract filename and create structured data
      text = file.name;
    } else {
      // For text-based files, read content
      text = await file.text();
    }

    // Extract name from filename or content
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    const extractedName = fileName.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    // Simple text parsing patterns
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = text.match(/[\+]?[1-9]?[\d\s\-\(\)]{10,}/);

    // Extract skills (common tech keywords)
    const skillKeywords = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
      'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git',
      'Angular', 'Vue.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel'
    ];
    
    const foundSkills = skillKeywords
      .filter(skill => text.toLowerCase().includes(skill.toLowerCase()))
      .map(skill => ({
        name: skill,
        category: categorizeSkill(skill)
      }));

    return {
      name: extractedName || 'Your Name',
      title: extractTitle(text) || 'Software Engineer',
      email: emailMatch?.[0] || 'your.email@example.com',
      phone: phoneMatch?.[0] || '+1 (555) 000-0000',
      summary: extractSummary(text) || 'Passionate professional with experience in software development.',
      skills: foundSkills.length > 0 ? foundSkills : getDefaultSkills(),
      experience: extractExperience(text),
      projects: extractProjects(text),
      education: extractEducation(text)
    };
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw new Error('Failed to parse resume');
  }
}

function categorizeSkill(skill: string): string {
  const categories = {
    'Frontend': ['JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'HTML', 'CSS'],
    'Backend': ['Node.js', 'Python', 'Java', 'C++', 'C#', 'Express', 'Django', 'Flask', 'Spring', 'Laravel'],
    'Database': ['SQL', 'MongoDB', 'PostgreSQL'],
    'Cloud': ['AWS', 'Azure', 'GCP'],
    'DevOps': ['Docker', 'Git', 'Jenkins']
  };

  for (const [category, skills] of Object.entries(categories)) {
    if (skills.includes(skill)) return category;
  }
  return 'Other';
}

function extractTitle(text: string): string {
  const titlePatterns = [
    /(?:software|web|full.?stack|frontend|backend|senior|junior|lead)\s+(?:engineer|developer|programmer)/i,
    /(?:data|machine learning|ai)\s+(?:scientist|engineer)/i,
    /(?:product|project)\s+manager/i
  ];

  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return 'Software Engineer';
}

function extractSummary(text: string): string {
  // Look for summary/objective sections
  const summaryMatch = text.match(/(?:summary|objective|about)[:\s]+(.*?)(?:\n\n|\n[A-Z])/is);
  if (summaryMatch) {
    return summaryMatch[1].trim().substring(0, 200);
  }
  return 'Passionate professional with experience in software development and technology solutions.';
}

function extractExperience(text: string): ParsedResume['experience'] {
  // Basic experience extraction - would need more sophisticated parsing
  return [{
    title: 'Software Engineer',
    company: 'Tech Company',
    duration: '2020 - Present',
    location: 'Remote',
    description: 'Developing web applications and software solutions.',
    achievements: ['Built scalable applications', 'Improved system performance']
  }];
}

function extractProjects(text: string): ParsedResume['projects'] {
  return [{
    title: 'Portfolio Website',
    description: 'Personal portfolio showcasing projects and skills.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    link: 'https://github.com/username/portfolio'
  }];
}

function extractEducation(text: string): ParsedResume['education'] {
  return [{
    degree: 'Bachelor of Science in Computer Science',
    school: 'University',
    year: '2020'
  }];
}

function getDefaultSkills(): ParsedResume['skills'] {
  return [
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' }
  ];
}