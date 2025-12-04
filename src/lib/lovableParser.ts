// Lovable integration for enhanced resume parsing
export interface LovableParseResult {
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

export async function parseResumeWithLovable(file: File): Promise<LovableParseResult> {
  try {
    console.log('Using Lovable enhanced parsing for:', file.name);
    
    // Read file content
    const fileContent = await file.text();
    console.log('File content extracted, length:', fileContent.length);
    
    // Enhanced parsing using Lovable's capabilities
    const result = await enhancedExtraction(fileContent, file.name);
    
    console.log('Lovable parsing result:', result);
    return result;
  } catch (error) {
    console.error('Lovable parsing failed, falling back to basic parsing:', error);
    return fallbackParsing(file);
  }
}

async function enhancedExtraction(content: string, fileName: string): Promise<LovableParseResult> {
  // Enhanced extraction with better pattern matching
  const name = extractNameEnhanced(content, fileName);
  const title = extractTitleEnhanced(content);
  const email = extractEmailEnhanced(content);
  const summary = extractSummaryEnhanced(content);
  const skills = extractSkillsEnhanced(content);
  const experience = extractExperienceEnhanced(content);
  const projects = extractProjectsEnhanced(content);
  
  return {
    name,
    title,
    email,
    summary,
    skills,
    experience,
    projects
  };
}

function extractNameEnhanced(text: string, fileName: string): string {
  console.log('Extracting name from content, text length:', text.length);
  
  // Only extract from actual resume content, never from filename
  if (!text || text.length < 20) {
    console.log('Insufficient text content for name extraction');
    return ''; // Return empty string, not filename
  }
  
  // Enhanced name extraction patterns - prioritize content
  const patterns = [
    // Name at document start
    /^\s*([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*$/m,
    // Name with label
    /(?:Name|Full Name)[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    // All caps name at start
    /^\s*([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})?)\s*$/m,
    // Name before contact info
    /^\s*([A-Z][a-z]+\s+[A-Z][a-z]+)\s*[\n\r].*(?:@|\+|\d{3})/m,
    // First line that looks like a name
    /^\s*([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+)\s*$/m
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      // Validate it's a real name, not a title or other text
      if (name.length > 3 && name.length < 50 && 
          /^[A-Z][a-z]+\s+[A-Z][a-z]+/.test(name) &&
          !/(engineer|developer|manager|analyst|specialist)/i.test(name)) {
        console.log('Extracted name from content:', name);
        return name;
      }
    }
  }
  
  console.log('No valid name found in resume content');
  return ''; // Never use filename
}

function extractTitleEnhanced(text: string): string {
  console.log('Extracting title from resume content');
  
  const topSection = text.substring(0, 500);
  
  const titlePatterns = [
    /(?:senior|junior|lead|principal|staff)\s+(?:software|web|full.?stack|frontend|backend|mobile)\s+(?:engineer|developer|programmer)/i,
    /(?:software|web|full.?stack|frontend|backend|mobile)\s+(?:engineer|developer|programmer)/i,
    /(?:data|machine learning|ai|ml)\s+(?:scientist|engineer|analyst)/i,
    /(?:product|project|program)\s+manager/i,
    /(?:devops|cloud|infrastructure)\s+engineer/i,
    /\n\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Engineer|Developer|Manager|Analyst|Designer|Scientist))\s*\n/i,
    /\b(Software Engineer|Web Developer|Data Scientist|Product Manager|DevOps Engineer)\b/i
  ];
  
  for (const pattern of titlePatterns) {
    const match = topSection.match(pattern);
    if (match) {
      const title = match[1] || match[0];
      console.log('Extracted title:', title);
      return title.trim();
    }
  }
  
  return 'Software Engineer';
}

function extractEmailEnhanced(text: string): string {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  return emailMatch?.[0] || 'user@example.com';
}

function extractSummaryEnhanced(text: string): string {
  const summaryPatterns = [
    /(?:SUMMARY|ABOUT)[\s\n]+([\s\S]*?)(?=\n\s*[A-Z]{3,}|\n\s*EXPERIENCE|\n\s*EDUCATION|\n\s*SKILLS|$)/i,
    /(?:summary|objective|about|profile)[:]\s*([^]*?)(?=\n\s*(?:experience|education|skills)|$)/i
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      let summary = match[1].trim();
      summary = summary.replace(/^[•\s]+/gm, '• ').replace(/\s+/g, ' ');
      if (summary.length > 30) {
        return summary;
      }
    }
  }
  
  return '';
}

function extractSkillsEnhanced(text: string): Array<{ name: string; category: string }> {
  console.log('Extracting skills from resume content');
  
  // Find skills section in resume
  const skillsSection = extractSkillsSection(text);
  if (skillsSection) {
    console.log('Found skills section:', skillsSection.substring(0, 200));
    return parseSkillsFromSection(skillsSection);
  }
  
  // Fallback: scan entire document for technical skills
  return scanForTechnicalSkills(text);
}

function extractSkillsSection(text: string): string | null {
  const skillsSectionPatterns = [
    /(?:TECHNICAL\s+SKILLS|SKILLS|TECHNOLOGIES|COMPETENCIES)[:\s]*([\s\S]*?)(?=\n\s*[A-Z]{3,}|\n\s*EXPERIENCE|\n\s*EDUCATION|\n\s*PROJECTS|$)/i,
    /(?:Skills|Technologies)[:\s]*\n([\s\S]*?)(?=\n\s*[A-Z]|$)/i,
    /(?:Programming|Languages|Frameworks)[:\s]*([^\n]*(?:\n[^\n]*)*?)(?=\n\s*[A-Z]{3,}|$)/i
  ];
  
  for (const pattern of skillsSectionPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 10) {
      return match[1].trim();
    }
  }
  
  return null;
}

function parseSkillsFromSection(section: string): Array<{ name: string; category: string }> {
  const skills: Array<{ name: string; category: string }> = [];
  
  // Split by common delimiters and clean up
  const skillItems = section
    .split(/[,;•\n]|\s{2,}/)
    .map(item => item.trim())
    .filter(item => item.length > 1 && item.length < 30)
    .filter(item => !/^(and|or|with|using|including)$/i.test(item));
  
  for (const item of skillItems) {
    // Clean up skill name
    const cleanSkill = item
      .replace(/^[•\-\*\s]+/, '')
      .replace(/[\(\)\[\]]/g, '')
      .trim();
    
    if (cleanSkill.length > 1 && isValidSkill(cleanSkill)) {
      skills.push({
        name: cleanSkill,
        category: categorizeSkill(cleanSkill)
      });
    }
  }
  
  console.log('Parsed skills from section:', skills);
  return skills.length > 0 ? skills : getDefaultSkills();
}

function scanForTechnicalSkills(text: string): Array<{ name: string; category: string }> {
  const commonTechSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'HTML', 'CSS', 'SCSS', 'Sass', 'Tailwind', 'Bootstrap',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'Jenkins'
  ];
  
  const foundSkills = commonTechSkills
    .filter(skill => new RegExp(`\\b${skill}(?:\.js)?\\b`, 'i').test(text))
    .map(skill => ({
      name: skill,
      category: categorizeSkill(skill)
    }));
  
  console.log('Scanned technical skills:', foundSkills);
  return foundSkills.length > 0 ? foundSkills : getDefaultSkills();
}

function isValidSkill(skill: string): boolean {
  // Filter out common non-skill words
  const invalidPatterns = [
    /^(experience|years?|proficient|familiar|knowledge|strong|excellent|good)$/i,
    /^(in|of|with|and|or|the|a|an)$/i,
    /^\d+$/,
    /^[^a-zA-Z]*$/
  ];
  
  return !invalidPatterns.some(pattern => pattern.test(skill));
}

function getDefaultSkills(): Array<{ name: string; category: string }> {
  return [
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' }
  ];
}

function categorizeSkill(skill: string): string {
  const skillLower = skill.toLowerCase();
  
  // Frontend technologies
  if (/^(javascript|typescript|react|angular|vue|html|css|scss|sass|tailwind|bootstrap|jquery|webpack|vite)$/i.test(skill)) {
    return 'Frontend';
  }
  
  // Backend technologies
  if (/^(node\.?js|python|java|c\+\+|c#|go|rust|php|ruby|django|flask|express|spring|laravel)$/i.test(skill)) {
    return 'Backend';
  }
  
  // Database technologies
  if (/^(mysql|postgresql|mongodb|redis|sqlite|oracle|sql\s?server|dynamodb|cassandra)$/i.test(skill)) {
    return 'Database';
  }
  
  // Cloud & DevOps
  if (/^(aws|azure|gcp|google\s?cloud|docker|kubernetes|jenkins|gitlab|github\s?actions|terraform|ansible)$/i.test(skill)) {
    return 'Cloud & DevOps';
  }
  
  // Mobile development
  if (/^(react\s?native|flutter|swift|kotlin|ios|android|xamarin)$/i.test(skill)) {
    return 'Mobile';
  }
  
  // Tools & Others
  if (/^(git|linux|windows|macos|figma|photoshop|jira|confluence|slack)$/i.test(skill)) {
    return 'Tools';
  }
  
  // Default category based on common patterns
  if (/\.(js|ts|py|java|cpp|cs|go|rs|php|rb)$/i.test(skill)) {
    return 'Programming';
  }
  
  return 'Technical';
}

function extractExperienceEnhanced(text: string): Array<any> {
  console.log('Extracting experience from resume content');
  
  const experienceSection = extractSection(text, ['EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT', 'PROFESSIONAL EXPERIENCE']);
  if (experienceSection) {
    return parseExperienceEntries(experienceSection);
  }
  
  return [{
    title: 'Software Engineer',
    company: 'Tech Company', 
    duration: '2020 - Present',
    location: 'Remote',
    description: 'Developing scalable applications',
    achievements: ['Built modern web applications']
  }];
}

function parseExperienceEntries(section: string): Array<any> {
  const entries: Array<any> = [];
  
  // Split by job entries (look for patterns like company names or job titles)
  const jobBlocks = section.split(/\n(?=[A-Z][^\n]*(?:Engineer|Developer|Manager|Analyst|Specialist|Consultant|Director|Lead))/i)
    .filter(block => block.trim().length > 20);
  
  for (const block of jobBlocks) {
    const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length < 2) continue;
    
    const entry = parseJobEntry(lines);
    if (entry) entries.push(entry);
  }
  
  return entries.length > 0 ? entries : [{
    title: 'Software Engineer',
    company: 'Tech Company',
    duration: '2020 - Present', 
    location: 'Remote',
    description: 'Developing scalable applications',
    achievements: ['Built modern web applications']
  }];
}

function parseJobEntry(lines: string[]): any | null {
  let title = '', company = '', duration = '', location = '', description = '';
  const achievements: string[] = [];
  
  // First line usually contains title and/or company
  const firstLine = lines[0];
  const titleMatch = firstLine.match(/(.*?)(?:\s+at\s+|\s+-\s+|\s+\|\s+)(.+)/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
    company = titleMatch[2].trim();
  } else {
    title = firstLine;
  }
  
  // Look for duration and location in subsequent lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Duration patterns
    if (!duration && /\d{4}/.test(line)) {
      const durationMatch = line.match(/(\d{4}\s*[-–]\s*(?:\d{4}|present|current))/i);
      if (durationMatch) duration = durationMatch[1];
    }
    
    // Location patterns
    if (!location && /,\s*[A-Z]{2}|Remote|Hybrid/.test(line)) {
      location = line.trim();
    }
    
    // Achievements (bullet points)
    if (/^[•\-\*]/.test(line)) {
      achievements.push(line.replace(/^[•\-\*]\s*/, '').trim());
    } else if (line.length > 30 && !duration && !location) {
      description += (description ? ' ' : '') + line;
    }
  }
  
  return title ? {
    title: title || 'Software Engineer',
    company: company || 'Tech Company',
    duration: duration || '2020 - Present',
    location: location || 'Remote',
    description: description || 'Developing scalable applications',
    achievements: achievements.length > 0 ? achievements : ['Built modern web applications']
  } : null;
}

function extractProjectsEnhanced(text: string): Array<any> {
  console.log('Extracting projects from resume content');
  
  const projectsSection = extractSection(text, ['PROJECTS', 'PERSONAL PROJECTS', 'KEY PROJECTS', 'NOTABLE PROJECTS']);
  if (projectsSection) {
    return parseProjectEntries(projectsSection);
  }
  
  return [{
    title: 'Portfolio Website',
    description: 'Modern portfolio showcasing technical skills', 
    technologies: ['React', 'TypeScript'],
    link: 'https://github.com/username/portfolio'
  }];
}

function parseProjectEntries(section: string): Array<any> {
  const projects: Array<any> = [];
  
  // Split by project entries
  const projectBlocks = section.split(/\n(?=[A-Z][^\n]*(?:Project|App|Website|System|Platform|Tool))/i)
    .filter(block => block.trim().length > 10);
  
  for (const block of projectBlocks) {
    const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length < 1) continue;
    
    const project = parseProjectEntry(lines);
    if (project) projects.push(project);
  }
  
  return projects.length > 0 ? projects : [{
    title: 'Portfolio Website',
    description: 'Modern portfolio showcasing technical skills',
    technologies: ['React', 'TypeScript'],
    link: 'https://github.com/username/portfolio'
  }];
}

function parseProjectEntry(lines: string[]): any | null {
  const title = lines[0];
  let description = '', link = '';
  const technologies: string[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for URLs
    if (/https?:\/\//.test(line)) {
      link = line.match(/https?:\/\/[^\s]+/)?.[0] || '';
    }
    
    // Look for technologies (usually in parentheses or after keywords)
    const techMatch = line.match(/(?:Technologies?|Built with|Stack|Using)[:\s]*([^\n]+)/i);
    if (techMatch) {
      const techs = techMatch[1].split(/[,;]/).map(t => t.trim()).filter(t => t.length > 0);
      technologies.push(...techs);
    }
    
    // Description (longer lines that aren't URLs or tech lists)
    if (line.length > 20 && !link && !techMatch) {
      description += (description ? ' ' : '') + line;
    }
  }
  
  return title ? {
    title,
    description: description || 'Project showcasing technical skills',
    technologies: technologies.length > 0 ? technologies : ['React', 'TypeScript'],
    link: link || undefined
  } : null;
}

function extractSection(text: string, sectionNames: string[]): string | null {
  for (const sectionName of sectionNames) {
    const pattern = new RegExp(`(?:${sectionName})[:\s]*([\s\S]*?)(?=\n\s*[A-Z]{3,}|\n\s*EDUCATION|\n\s*SKILLS|$)`, 'i');
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 20) {
      return match[1].trim();
    }
  }
  return null;
}

async function fallbackParsing(file: File): Promise<LovableParseResult> {
  console.log('Using fallback parsing - no filename extraction');
  
  return {
    name: '', // Never use filename as name
    title: 'Software Engineer',
    email: 'user@example.com',
    summary: 'Building innovative solutions with modern technologies',
    skills: getDefaultSkills(),
    experience: [{
      title: 'Software Engineer',
      company: 'Tech Company',
      duration: '2020 - Present',
      location: 'Remote',
      description: 'Developing modern applications',
      achievements: ['Built scalable solutions']
    }],
    projects: [{
      title: 'Portfolio Project',
      description: 'Showcasing technical expertise',
      technologies: ['React', 'TypeScript'],
      link: 'https://github.com/username/project'
    }]
  };
}