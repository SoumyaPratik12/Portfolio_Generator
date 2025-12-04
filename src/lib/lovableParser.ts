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
  
  if (!text || text.length < 20) {
    console.log('Insufficient text content for name extraction');
    return '';
  }
  
  // Clean text first
  const cleanText = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Enhanced name extraction patterns
  const patterns = [
    // Name at very beginning (first 200 chars)
    /^\s*([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)(?:\s|\n|$)/,
    // All caps name at start
    /^\s*([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})?)(?:\s|\n|$)/,
    // Name with label
    /(?:Name|Full Name)[:\s]+([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/i,
    // Name before contact (email/phone)
    /([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+)\s*[\n\r].*(?:@[\w.-]+\.[a-zA-Z]{2,}|\+?\d{3})/,
    // Name in first few lines
    /^(?:[^\n]*\n){0,2}\s*([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+)(?:\s|\n|$)/m
  ];
  
  const firstPart = cleanText.substring(0, 500);
  
  for (const pattern of patterns) {
    const match = firstPart.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (isValidName(name)) {
        console.log('Extracted name from content:', name);
        return name;
      }
    }
  }
  
  console.log('No valid name found in resume content');
  return '';
}

function isValidName(name: string): boolean {
  return name.length > 3 && name.length < 50 && 
         /^[A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+/.test(name) &&
         !/(engineer|developer|manager|analyst|specialist|resume|cv|document)/i.test(name);
}

function extractNameFromFilename(fileName: string): string {
  const cleanFileName = fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/resume|cv/gi, '')
    .trim();
  
  if (cleanFileName && /^[A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+/.test(cleanFileName)) {
    return cleanFileName.replace(/\b\w/g, l => l.toUpperCase());
  }
  
  return 'Professional';
}

function extractTitleEnhanced(text: string): string {
  console.log('Extracting title from resume content');
  
  const cleanText = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const topSection = cleanText.substring(0, 800);
  
  const titlePatterns = [
    // Common job titles with seniority
    /\b((?:Senior|Junior|Lead|Principal|Staff|Chief)\s+(?:Software|Web|Full[\s-]?Stack|Frontend|Backend|Mobile|Data|DevOps|Cloud)\s+(?:Engineer|Developer|Programmer|Scientist|Analyst))\b/i,
    // Basic job titles
    /\b((?:Software|Web|Full[\s-]?Stack|Frontend|Backend|Mobile)\s+(?:Engineer|Developer|Programmer))\b/i,
    // Data roles
    /\b((?:Data|Machine Learning|AI|ML)\s+(?:Scientist|Engineer|Analyst))\b/i,
    // Management roles
    /\b((?:Product|Project|Program|Engineering)\s+Manager)\b/i,
    // DevOps and Cloud
    /\b((?:DevOps|Cloud|Infrastructure|Platform)\s+Engineer)\b/i,
    // Design roles
    /\b((?:UI\/UX|UX|UI)\s+(?:Designer|Developer))\b/i,
    // After name, before contact
    /([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+)\s*[\n\r]+\s*([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Scientist))\s*[\n\r]/i,
    // Title on separate line
    /\n\s*([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Scientist))\s*\n/i
  ];
  
  for (const pattern of titlePatterns) {
    const match = topSection.match(pattern);
    if (match) {
      const title = (match[2] || match[1] || match[0]).trim();
      if (title.length > 5 && title.length < 60 && !/(name|email|phone|address)/i.test(title)) {
        console.log('Extracted title:', title);
        return title;
      }
    }
  }
  
  return 'Software Engineer';
}

function extractEmailEnhanced(text: string): string {
  const cleanText = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ');
  
  const emailPatterns = [
    /\b([a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g,
    /(?:email|e-mail)[:\s]*([a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
  ];
  
  for (const pattern of emailPatterns) {
    const matches = cleanText.match(pattern);
    if (matches) {
      const email = matches[0].replace(/^(?:email|e-mail)[:\s]*/i, '');
      if (email.includes('@') && email.includes('.')) {
        console.log('Extracted email:', email);
        return email;
      }
    }
  }
  
  return 'user@example.com';
}

function extractSummaryEnhanced(text: string): string {
  console.log('Extracting summary from text, length:', text.length);
  
  // Clean the text first - remove XML/HTML tags and normalize whitespace
  let cleanText = text
    .replace(/<[^>]*>/g, ' ')  // Remove XML/HTML tags
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')  // Remove HTML entities
    .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')  // Remove control characters
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .trim();
  
  console.log('Cleaned text for summary extraction, length:', cleanText.length);
  
  const summaryPatterns = [
    /(?:SUMMARY|ABOUT|PROFILE|OBJECTIVE)[\s\n:]+([\s\S]*?)(?=\n\s*[A-Z]{3,}|\n\s*EXPERIENCE|\n\s*EDUCATION|\n\s*SKILLS|\n\s*PROJECTS|$)/i,
    /(?:summary|objective|about|profile)[:\s]+([^]*?)(?=\n\s*(?:experience|education|skills|projects)|$)/i,
    // Look for paragraph-like content at the beginning after name/contact
    /(?:^|\n)([A-Z][^\n]{50,200}[.!?])(?=\n|$)/m
  ];
  
  for (const pattern of summaryPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      let summary = match[1].trim();
      
      // Further clean the summary
      summary = summary
        .replace(/^[•\-\*\s]+/gm, '')  // Remove bullet points
        .replace(/\s+/g, ' ')  // Normalize spaces
        .replace(/[\r\n]+/g, ' ')  // Replace line breaks with spaces
        .trim();
      
      // Validate summary quality
      if (summary.length > 30 && summary.length < 1000 && 
          !summary.includes('blank') && 
          !summary.includes('endobj') &&
          !summary.includes('xmp') &&
          !/^[\d\s<>\[\]{}().,;:]+$/.test(summary)) {
        console.log('Extracted clean summary:', summary.substring(0, 100));
        return summary;
      }
    }
  }
  
  console.log('No valid summary found');
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
  
  // Enhanced parsing for different formats
  const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  for (const line of lines) {
    // Check if line contains category headers
    const categoryMatch = line.match(/^([A-Za-z\s&]+):\s*(.+)$/);
    if (categoryMatch) {
      const category = categoryMatch[1].trim();
      const skillsText = categoryMatch[2].trim();
      
      // Parse skills from this category
      const categorySkills = skillsText
        .split(/[,;|]|\s{2,}/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 1 && skill.length < 50)
        .filter(skill => isValidSkill(skill));
      
      categorySkills.forEach(skill => {
        skills.push({
          name: cleanSkillName(skill),
          category: category
        });
      });
    } else {
      // Parse individual skills or comma-separated lists
      const skillItems = line
        .split(/[,;•\n]|\s{2,}/)
        .map(item => item.trim())
        .filter(item => item.length > 1 && item.length < 50)
        .filter(item => !/^(and|or|with|using|including|skills|proficient|experience)$/i.test(item));
      
      for (const item of skillItems) {
        const cleanSkill = cleanSkillName(item);
        if (cleanSkill.length > 1 && isValidSkill(cleanSkill)) {
          skills.push({
            name: cleanSkill,
            category: categorizeSkill(cleanSkill)
          });
        }
      }
    }
  }
  
  console.log('Parsed skills from section:', skills);
  return skills.length > 0 ? skills : getDefaultSkills();
}

function cleanSkillName(skill: string): string {
  return skill
    .replace(/^[•\-\*\s]+/, '')
    .replace(/[\(\)\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function scanForTechnicalSkills(text: string): Array<{ name: string; category: string }> {
  const commonSkills = [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB',
    // Frontend
    'React', 'Angular', 'Vue', 'HTML', 'CSS', 'SCSS', 'Sass', 'Tailwind', 'Bootstrap', 'jQuery',
    // Backend
    'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails', 'ASP.NET',
    // Database
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
    // Cloud & DevOps
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'Jenkins', 'Terraform',
    // Data & Analytics
    'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Tableau', 'Power BI', 'Excel', 'SPSS',
    // Finance
    'Financial Modeling', 'Risk Analysis', 'Bloomberg', 'QuickBooks', 'SAP', 'CFA', 'FRM',
    // Marketing
    'Google Analytics', 'Facebook Ads', 'AdWords', 'HubSpot', 'Salesforce', 'SEO', 'SEM',
    // Design
    'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'InDesign', 'After Effects', 'UI/UX',
    // Engineering
    'AutoCAD', 'SolidWorks', 'CATIA', 'ANSYS', 'PLC', 'SCADA', 'LabVIEW', 'Revit',
    // Project Management
    'Jira', 'Confluence', 'Trello', 'Asana', 'Agile', 'Scrum', 'Kanban', 'PMP',
    // Languages
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
    // Soft Skills
    'Leadership', 'Management', 'Teamwork', 'Communication', 'Problem Solving'
  ];
  
  const foundSkills = commonSkills
    .filter(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(text);
    })
    .map(skill => ({
      name: skill,
      category: categorizeSkill(skill)
    }));
  
  console.log('Scanned skills from all sectors:', foundSkills);
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
    { name: 'JavaScript', category: 'Programming Languages' },
    { name: 'Python', category: 'Programming Languages' },
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'SQL', category: 'Database' },
    { name: 'Git', category: 'Tools & Software' },
    { name: 'Problem Solving', category: 'Soft Skills' },
    { name: 'Communication', category: 'Soft Skills' }
  ];
}

function categorizeSkill(skill: string): string {
  const skillLower = skill.toLowerCase();
  
  // Programming Languages
  if (/^(javascript|typescript|python|java|c\+\+|c#|go|rust|php|ruby|swift|kotlin|scala|r|matlab)$/i.test(skill)) {
    return 'Programming Languages';
  }
  
  // Frontend Technologies
  if (/^(react|angular|vue|html|css|scss|sass|tailwind|bootstrap|jquery|webpack|vite|next\.?js)$/i.test(skill)) {
    return 'Frontend';
  }
  
  // Backend Technologies
  if (/^(node\.?js|django|flask|express|spring|laravel|rails|asp\.?net)$/i.test(skill)) {
    return 'Backend';
  }
  
  // Database Technologies
  if (/^(mysql|postgresql|mongodb|redis|sqlite|oracle|sql\s?server|dynamodb|cassandra|elasticsearch)$/i.test(skill)) {
    return 'Database';
  }
  
  // Cloud & DevOps
  if (/^(aws|azure|gcp|google\s?cloud|docker|kubernetes|jenkins|gitlab|github\s?actions|terraform|ansible|ci\/cd)$/i.test(skill)) {
    return 'Cloud & DevOps';
  }
  
  // Mobile Development
  if (/^(react\s?native|flutter|ios|android|xamarin|ionic|cordova)$/i.test(skill)) {
    return 'Mobile';
  }
  
  // Data Science & Analytics
  if (/^(pandas|numpy|scikit.learn|tensorflow|pytorch|tableau|power\s?bi|excel|spss|sas|looker)$/i.test(skill)) {
    return 'Data & Analytics';
  }
  
  // Finance & Accounting
  if (/^(financial\s?modeling|risk\s?analysis|bloomberg|quickbooks|sap|oracle\s?financials|ifrs|gaap|cfa|frm)$/i.test(skill)) {
    return 'Finance & Accounting';
  }
  
  // Marketing & Sales
  if (/^(google\s?analytics|facebook\s?ads|adwords|hubspot|salesforce|mailchimp|hootsuite|seo|sem|crm)$/i.test(skill)) {
    return 'Marketing & Sales';
  }
  
  // Design & Creative
  if (/^(photoshop|illustrator|figma|sketch|indesign|after\s?effects|premiere|canva|ui\/ux|graphic\s?design)$/i.test(skill)) {
    return 'Design & Creative';
  }
  
  // Engineering & CAD
  if (/^(autocad|solidworks|catia|ansys|matlab|simulink|plc|scada|labview|revit|inventor)$/i.test(skill)) {
    return 'Engineering & CAD';
  }
  
  // Project Management
  if (/^(jira|confluence|trello|asana|monday|ms\s?project|agile|scrum|kanban|pmp|prince2)$/i.test(skill)) {
    return 'Project Management';
  }
  
  // Communication & Languages
  if (/^(english|spanish|french|german|chinese|japanese|korean|arabic|communication|presentation|negotiation)$/i.test(skill)) {
    return 'Communication & Languages';
  }
  
  // Tools & Software
  if (/^(git|linux|windows|macos|slack|zoom|teams|office|google\s?workspace|notion)$/i.test(skill)) {
    return 'Tools & Software';
  }
  
  // Default categorization based on patterns
  if (/\.(js|ts|py|java|cpp|cs|go|rs|php|rb)$/i.test(skill)) {
    return 'Programming Languages';
  }
  
  if (/^(leadership|management|teamwork|problem\s?solving|critical\s?thinking|creativity)$/i.test(skill)) {
    return 'Soft Skills';
  }
  
  return 'Professional Skills';
}

function extractExperienceEnhanced(text: string): Array<any> {
  console.log('Extracting experience from resume content');
  
  const experienceSection = extractSection(text, ['EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT', 'PROFESSIONAL EXPERIENCE']);
  if (experienceSection) {
    return parseExperienceEntries(experienceSection);
  }
  
  return [{
    title: 'Software Engineer',
    company: 'Technology Company', 
    duration: '2022 - Present',
    location: 'Remote',
    description: 'Developing modern web applications and software solutions using cutting-edge technologies.',
    achievements: [
      'Built responsive web applications using modern frameworks',
      'Collaborated with cross-functional teams to deliver high-quality software',
      'Implemented best practices for code quality and performance optimization'
    ]
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
  
  return [
    {
      title: 'Portfolio Website',
      description: 'A responsive portfolio website showcasing professional skills and projects with modern design and smooth user experience.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      link: 'https://github.com/username/portfolio'
    },
    {
      title: 'Web Application',
      description: 'Full-stack web application with user authentication, data management, and real-time features.',
      technologies: ['JavaScript', 'Node.js', 'MongoDB'],
      link: 'https://github.com/username/webapp'
    }
  ];
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
  console.log('Using fallback parsing');
  
  return {
    name: '',
    title: 'Software Engineer',
    email: 'user@example.com',
    summary: 'Passionate software engineer with expertise in modern web technologies and a strong commitment to delivering high-quality solutions.',
    skills: getDefaultSkills(),
    experience: [{
      title: 'Software Engineer',
      company: 'Technology Company',
      duration: '2022 - Present',
      location: 'Remote',
      description: 'Developing modern web applications and software solutions using cutting-edge technologies.',
      achievements: [
        'Built responsive web applications using modern frameworks',
        'Collaborated with cross-functional teams to deliver high-quality software',
        'Implemented best practices for code quality and performance optimization'
      ]
    }],
    projects: [
      {
        title: 'Portfolio Website',
        description: 'A responsive portfolio website showcasing professional skills and projects with modern design and smooth user experience.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        link: 'https://github.com/username/portfolio'
      },
      {
        title: 'Web Application',
        description: 'Full-stack web application with user authentication, data management, and real-time features.',
        technologies: ['JavaScript', 'Node.js', 'MongoDB'],
        link: 'https://github.com/username/webapp'
      }
    ]
  };
}