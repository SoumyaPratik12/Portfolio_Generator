// Simple resume parser using text extraction
export interface ParsedResume {
  name: string;
  title: string;
  email: string;
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
}

export async function parseResume(file: File): Promise<ParsedResume> {
  try {
    console.log('Starting to parse file:', file.name, 'Type:', file.type);
    
    let text = '';
    
    // Enhanced file reading with better text extraction
    if (file.type === 'application/pdf') {
      console.log('PDF file detected - attempting text extraction');
      // For PDF files, try to read as text (works for text-based PDFs)
      try {
        text = await file.text();
        console.log('PDF text extraction successful, length:', text.length);
      } catch {
        console.log('PDF text extraction failed, using filename');
        text = file.name;
      }
    } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      console.log('Word document detected - attempting text extraction');
      try {
        text = await file.text();
        console.log('Word document text extraction, length:', text.length);
      } catch {
        console.log('Word document extraction failed, using filename');
        text = file.name;
      }
    } else {
      // For text-based files, read content
      text = await file.text();
      console.log('Text file content length:', text.length);
    }

    console.log('Available text for parsing (first 300 chars):', text.substring(0, 300));

    // Enhanced parsing with actual text content
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    
    const parsed = {
      name: extractName(text, fileName),
      title: extractTitle(text),
      email: extractEmail(text),
      summary: extractSummary(text) || `Building innovative solutions with modern technologies`,
      skills: extractSkills(text),
      experience: extractExperience(text),
      projects: extractProjects(text)
    };

    console.log('Final parsed data:', parsed);
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
  // Enhanced name extraction patterns - prioritize actual text content
  const namePatterns = [
    // Name at the beginning of resume
    /^\s*([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/m,
    // Name with label
    /(?:Name|Full Name)[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    // Name in all caps at start
    /^\s*([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})?)/m,
    // Name followed by contact info
    /^\s*([A-Z][a-z]+\s+[A-Z][a-z]+)\s*[\n\r].*(?:@|\+|\d{3})/m,
    // Name in header section
    /^([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+)(?:\s*\n|\s*$)/m
  ];

  // Only use text content if it's substantial (not just filename)
  if (text && text.length > 50) {
    const cleanText = text.replace(/[^\w\s@.\n\r-]/g, ' ').replace(/\s+/g, ' ');
    
    for (const pattern of namePatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim();
        // Validate it looks like a real name (2-3 words, proper case)
        if (name.length > 3 && name.length < 50 && /^[A-Z][a-z]+\s+[A-Z][a-z]+/.test(name)) {
          return name;
        }
      }
    }
  }

  // Only use filename as last resort if it clearly looks like a name (not just any filename)
  const cleanFileName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/resume|cv/gi, '').trim();
  if (cleanFileName && /^[A-Z][a-z]+\s+[A-Z][a-z]+/.test(cleanFileName)) {
    return cleanFileName.replace(/\b\w/g, l => l.toUpperCase());
  }
  
  // Return empty string instead of placeholder - let UI handle the fallback
  return '';
}

function extractEmail(text: string): string {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  return emailMatch?.[0] || 'your.email@example.com';
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
  // Enhanced summary extraction patterns
  const summaryPatterns = [
    // Labeled sections
    /(?:summary|objective|about|profile|overview)[:\s]+([\s\S]*?)(?:\n\s*(?:experience|education|skills|projects)|$)/i,
    // Professional summary
    /(?:professional\s+summary|career\s+summary)[:\s]+([\s\S]*?)(?:\n\s*(?:experience|education|skills)|$)/i,
    // First paragraph after name/contact
    /(?:@[\w.]+|\+?\d[\d\s\-()]+)[\s\n]+([A-Z][^\n]*(?:\n[^\n]*){0,3})(?:\n\s*(?:experience|skills|education)|$)/i
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const summary = match[1].trim().replace(/\s+/g, ' ');
      if (summary.length > 30 && summary.length < 500) {
        return summary;
      }
    }
  }
  
  // Look for descriptive paragraphs near the top
  const lines = text.split('\n');
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (line.length > 50 && line.length < 300 && 
        /^[A-Z]/.test(line) && 
        !/@/.test(line) && 
        !/\d{4}/.test(line)) {
      return line;
    }
  }
  
  return '';
}

function extractExperience(text: string): ParsedResume['experience'] {
  const experiences: ParsedResume['experience'] = [];
  
  // Look for experience sections with better patterns
  const experiencePatterns = [
    /(?:experience|work\s+history|employment|professional\s+experience)[\s\S]*?(?=\n\s*(?:education|skills|projects|certifications)|$)/i,
    /(?:work|employment)[\s\S]*?(?=\n\s*(?:education|skills|projects)|$)/i
  ];
  
  let workText = '';
  for (const pattern of experiencePatterns) {
    const match = text.match(pattern);
    if (match) {
      workText = match[0];
      break;
    }
  }
  
  if (!workText) workText = text;
  
  // Enhanced job extraction patterns
  const jobPatterns = [
    // Title, Company, Duration format
    /([A-Z][\w\s]+(?:Engineer|Developer|Manager|Analyst|Specialist|Consultant|Designer|Architect|Lead|Director|Coordinator))\s*[\n\r]+\s*([A-Z][\w\s&.,Inc]+)\s*[\n\r]+\s*((?:\d{1,2}\/)?\d{4}\s*[-–—]\s*(?:(?:\d{1,2}\/)?\d{4}|Present|Current))/gi,
    // Company | Title | Duration
    /([A-Z][\w\s&.,Inc]+)\s*[|\-]\s*([A-Z][\w\s]+(?:Engineer|Developer|Manager|Analyst))\s*[|\-]\s*(\d{4}\s*[-–]\s*(?:\d{4}|Present))/gi,
    // Title at Company (Duration)
    /([A-Z][\w\s]+(?:Engineer|Developer|Manager))\s+at\s+([A-Z][\w\s&.,]+)\s*\((\d{4}\s*[-–]\s*(?:\d{4}|Present))\)/gi
  ];
  
  for (const pattern of jobPatterns) {
    let match;
    while ((match = pattern.exec(workText)) !== null && experiences.length < 5) {
      let title, company, duration;
      
      if (pattern === jobPatterns[1]) {
        // Company | Title | Duration format
        company = match[1].trim();
        title = match[2].trim();
        duration = match[3].trim();
      } else {
        // Title, Company, Duration format
        title = match[1].trim();
        company = match[2].trim();
        duration = match[3].trim();
      }
      
      // Extract description from surrounding text
      const description = extractJobDescription(workText, title, company);
      
      experiences.push({
        title,
        company,
        duration,
        location: extractLocation(workText, company) || 'Remote',
        description: description || `${title} position at ${company}`,
        achievements: extractAchievements(workText, title, company)
      });
    }
  }
  
  return experiences;
}

function extractJobDescription(text: string, title: string, company: string): string {
  // Look for bullet points or descriptions near the job
  const jobSection = new RegExp(`${title}[\s\S]*?${company}[\s\S]*?(?=\n\s*[A-Z][\w\s]+(?:Engineer|Developer|Manager)|$)`, 'i');
  const match = text.match(jobSection);
  
  if (match) {
    const bullets = match[0].match(/[•\-\*]\s*([^\n]+)/g);
    if (bullets && bullets.length > 0) {
      return bullets[0].replace(/[•\-\*]\s*/, '').trim();
    }
  }
  
  return '';
}

function extractLocation(text: string, company: string): string | null {
  const locationPattern = new RegExp(`${company}[\s\S]*?([A-Z][a-z]+,\s*[A-Z]{2})`, 'i');
  const match = text.match(locationPattern);
  return match ? match[1] : null;
}

function extractAchievements(text: string, title: string, company: string): string[] {
  const achievements: string[] = [];
  const jobSection = new RegExp(`${title}[\s\S]*?${company}[\s\S]*?(?=\n\s*[A-Z][\w\s]+(?:Engineer|Developer|Manager)|$)`, 'i');
  const match = text.match(jobSection);
  
  if (match) {
    const bullets = match[0].match(/[•\-\*]\s*([^\n]+)/g);
    if (bullets) {
      bullets.forEach(bullet => {
        const achievement = bullet.replace(/[•\-\*]\s*/, '').trim();
        if (achievement.length > 10) {
          achievements.push(achievement);
        }
      });
    }
  }
  
  return achievements.length > 0 ? achievements : [];
}

function extractProjects(text: string): ParsedResume['projects'] {
  const projects: ParsedResume['projects'] = [];
  
  // Look for project sections with better patterns
  const projectPatterns = [
    /(?:projects|portfolio|personal\s+projects)[\s\S]*?(?=\n\s*(?:experience|education|skills|certifications)|$)/i,
    /(?:github|repositories)[\s\S]*?(?=\n\s*(?:experience|education|skills)|$)/i
  ];
  
  let projectText = '';
  for (const pattern of projectPatterns) {
    const match = text.match(pattern);
    if (match) {
      projectText = match[0];
      break;
    }
  }
  
  if (!projectText) {
    // Look for project mentions throughout the text
    projectText = text;
  }
  
  // Enhanced project extraction patterns
  const projectNamePatterns = [
    // Project: Name - Description
    /(?:Project|Built|Developed|Created)[:\s]*([A-Z][\w\s]+?)\s*[-–]\s*([^\n]+)/gi,
    // • Project Name: Description
    /[•\-\*]\s*([A-Z][\w\s]+?):\s*([^\n]+)/gi,
    // Project Name (Technologies)
    /([A-Z][\w\s]+?)\s*\(([^)]+)\)/gi,
    // GitHub links
    /github\.com\/[\w-]+\/([\w-]+)/gi
  ];
  
  for (const pattern of projectNamePatterns) {
    let match;
    while ((match = pattern.exec(projectText)) !== null && projects.length < 5) {
      const title = match[1].trim();
      const description = match[2] ? match[2].trim() : '';
      
      if (title.length > 2 && title.length < 60 && !title.toLowerCase().includes('experience')) {
        const technologies = extractProjectTechnologies(projectText, title);
        const link = extractProjectLink(projectText, title);
        
        projects.push({
          title,
          description: description || `${title} project showcasing technical skills`,
          technologies,
          link
        });
      }
    }
  }
  
  return projects;
}

function extractProjectTechnologies(text: string, projectTitle: string): string[] {
  const technologies: string[] = [];
  
  // Look for technologies mentioned near the project
  const projectSection = new RegExp(`${projectTitle}[\s\S]{0,200}`, 'i');
  const match = text.match(projectSection);
  
  if (match) {
    const techKeywords = [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Express',
      'Python', 'Django', 'Flask', 'Java', 'Spring', 'C++', 'C#',
      'HTML', 'CSS', 'SCSS', 'Tailwind', 'Bootstrap',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'AWS', 'Docker', 'Git'
    ];
    
    techKeywords.forEach(tech => {
      if (new RegExp(`\\b${tech}\\b`, 'i').test(match[0])) {
        technologies.push(tech);
      }
    });
  }
  
  return technologies.length > 0 ? technologies : ['Web Development'];
}

function extractProjectLink(text: string, projectTitle: string): string {
  // Look for GitHub or other links near the project
  const linkPattern = /(https?:\/\/[^\s]+)/g;
  const projectSection = new RegExp(`${projectTitle}[\s\S]{0,200}`, 'i');
  const match = text.match(projectSection);
  
  if (match) {
    const linkMatch = match[0].match(linkPattern);
    if (linkMatch) {
      return linkMatch[0];
    }
  }
  
  return `https://github.com/username/${projectTitle.toLowerCase().replace(/\s+/g, '-')}`;
}



function getDefaultSkills(): ParsedResume['skills'] {
  return [];
}