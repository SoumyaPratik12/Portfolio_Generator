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
      // For PDF, try to read as text (limited without pdf-parse library)
      text = file.name + ' ' + await tryReadFileAsText(file);
    } else {
      // For text-based files, read content
      text = await file.text();
    }

    console.log('Parsing resume text:', text.substring(0, 500));

    // Extract name - try multiple methods
    const extractedName = extractName(text, file.name);
    const extractedEmail = extractEmail(text);
    const extractedPhone = extractPhone(text);
    const extractedSkills = extractSkills(text);
    const extractedExperience = extractExperience(text);
    const extractedProjects = extractProjects(text);
    const extractedEducation = extractEducation(text);
    const extractedSummary = extractSummary(text);

    const parsed = {
      name: extractedName,
      title: extractTitle(text),
      email: extractedEmail,
      phone: extractedPhone,
      summary: extractedSummary,
      skills: extractedSkills,
      experience: extractedExperience,
      projects: extractedProjects,
      education: extractedEducation
    };

    console.log('Parsed resume data:', parsed);
    return parsed;
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw new Error('Failed to parse resume');
  }
}

async function tryReadFileAsText(file: File): Promise<string> {
  try {
    return await file.text();
  } catch {
    return '';
  }
}

function extractName(text: string, fileName: string): string {
  // Try to find name in text first
  const namePatterns = [
    /^([A-Z][a-z]+ [A-Z][a-z]+)/m,
    /Name[:\s]+([A-Z][a-z]+ [A-Z][a-z]+)/i,
    /([A-Z][A-Z\s]+)\n/
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 3) {
      return match[1].trim();
    }
  }

  // Fallback to filename
  const fileName2 = fileName.replace(/\.[^/.]+$/, "");
  return fileName2.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || 'Your Name';
}

function extractEmail(text: string): string {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  return emailMatch?.[0] || 'your.email@example.com';
}

function extractPhone(text: string): string {
  const phonePatterns = [
    /\+?1?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/,
    /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/
  ];

  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return '+1 (555) 000-0000';
}

function extractSkills(text: string): ParsedResume['skills'] {
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express',
    'Python', 'Django', 'Flask', 'Java', 'Spring', 'C++', 'C#', '.NET',
    'HTML', 'CSS', 'SCSS', 'Tailwind', 'Bootstrap',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'Jenkins',
    'PHP', 'Laravel', 'Ruby', 'Rails', 'Go', 'Rust', 'Swift', 'Kotlin'
  ];
  
  const foundSkills = skillKeywords
    .filter(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(text);
    })
    .map(skill => ({
      name: skill,
      category: categorizeSkill(skill)
    }));

  return foundSkills.length > 0 ? foundSkills : getDefaultSkills();
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
  const summaryPatterns = [
    /(?:summary|objective|about|profile)[:\s]+([\s\S]*?)(?:\n\n|\nexperience|\neducation|\nskills)/i,
    /(?:summary|objective|about|profile)[:\s]+([^\n]*)/i
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 20) {
      return match[1].trim().substring(0, 300);
    }
  }
  
  // Extract first meaningful paragraph
  const paragraphs = text.split('\n').filter(p => p.trim().length > 50);
  if (paragraphs.length > 0) {
    return paragraphs[0].trim().substring(0, 300);
  }
  
  return 'Passionate professional with experience in software development and technology solutions.';
}

function extractExperience(text: string): ParsedResume['experience'] {
  const experiences: ParsedResume['experience'] = [];
  
  // Look for experience sections
  const experienceSection = text.match(/(?:experience|work history|employment)[\s\S]*?(?=\n\n|education|skills|projects|$)/i);
  const workText = experienceSection ? experienceSection[0] : text;
  
  // Extract job titles and companies
  const jobPatterns = [
    /([A-Z][\w\s]+(?:Engineer|Developer|Manager|Analyst|Specialist|Consultant))\s*[\n\r]?\s*(?:at\s+)?([A-Z][\w\s&.,]+)\s*[\n\r]?\s*(\d{4}\s*[-–]\s*(?:\d{4}|Present))/gi,
    /([A-Z][\w\s]+)\s*\|\s*([A-Z][\w\s&.,]+)\s*\|\s*(\d{4}\s*[-–]\s*(?:\d{4}|Present))/gi
  ];
  
  for (const pattern of jobPatterns) {
    let match;
    while ((match = pattern.exec(workText)) !== null) {
      experiences.push({
        title: match[1].trim(),
        company: match[2].trim(),
        duration: match[3].trim(),
        location: 'Location not specified',
        description: `${match[1]} role at ${match[2]}`,
        achievements: ['Contributed to team success', 'Delivered quality results']
      });
    }
  }
  
  // Fallback if no experience found
  if (experiences.length === 0) {
    const title = extractTitle(text);
    experiences.push({
      title: title,
      company: 'Previous Company',
      duration: '2020 - Present',
      location: 'Location',
      description: `${title} with experience in software development.`,
      achievements: ['Developed software solutions', 'Collaborated with team members']
    });
  }
  
  return experiences;
}

function extractProjects(text: string): ParsedResume['projects'] {
  const projects: ParsedResume['projects'] = [];
  
  // Look for project sections
  const projectSection = text.match(/(?:projects|portfolio)[\s\S]*?(?=\n\n|experience|education|skills|$)/i);
  const projectText = projectSection ? projectSection[0] : '';
  
  // Extract project names
  const projectPatterns = [
    /(?:Project|Built|Developed)[:\s]*([A-Z][\w\s]+)/gi,
    /•\s*([A-Z][\w\s]+):/gi,
    /-\s*([A-Z][\w\s]+):/gi
  ];
  
  for (const pattern of projectPatterns) {
    let match;
    while ((match = pattern.exec(projectText)) !== null && projects.length < 3) {
      const title = match[1].trim();
      if (title.length > 3 && title.length < 50) {
        projects.push({
          title: title,
          description: `${title} - A software project demonstrating technical skills and problem-solving abilities.`,
          technologies: extractSkills(text).slice(0, 4).map(s => s.name),
          link: 'https://github.com/username/' + title.toLowerCase().replace(/\s+/g, '-')
        });
      }
    }
  }
  
  // Fallback projects if none found
  if (projects.length === 0) {
    projects.push({
      title: 'Software Project',
      description: 'A comprehensive software project showcasing technical expertise.',
      technologies: extractSkills(text).slice(0, 3).map(s => s.name),
      link: 'https://github.com/username/project'
    });
  }
  
  return projects;
}

function extractEducation(text: string): ParsedResume['education'] {
  const education: ParsedResume['education'] = [];
  
  // Look for education section
  const educationSection = text.match(/(?:education|academic)[\s\S]*?(?=\n\n|experience|skills|projects|$)/i);
  const eduText = educationSection ? educationSection[0] : text;
  
  // Extract degrees and schools
  const degreePatterns = [
    /(Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?)\s*(?:of|in)?\s*([\w\s]+)\s*[\n\r]?\s*([A-Z][\w\s&.,]+)\s*[\n\r]?\s*(\d{4})/gi,
    /([A-Z][\w\s]+(?:University|College|Institute))\s*[\n\r]?\s*(\d{4})/gi
  ];
  
  for (const pattern of degreePatterns) {
    let match;
    while ((match = pattern.exec(eduText)) !== null) {
      if (pattern === degreePatterns[0]) {
        education.push({
          degree: `${match[1]} ${match[2]}`.trim(),
          school: match[3].trim(),
          year: match[4]
        });
      } else {
        education.push({
          degree: 'Degree',
          school: match[1].trim(),
          year: match[2]
        });
      }
    }
  }
  
  // Fallback if no education found
  if (education.length === 0) {
    education.push({
      degree: 'Bachelor of Science in Computer Science',
      school: 'University',
      year: '2020'
    });
  }
  
  return education;
}

function getDefaultSkills(): ParsedResume['skills'] {
  return [
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' }
  ];
}