import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const toolsDirectory = path.join(process.cwd(), 'src/tools');

export interface ToolData {
  slug: string;
  name: string;
  category: string;
  one_liner: string;
  logo_url: string;
  website_url: string;
  pricing_model: string;
  tags: string[];
  [key: string]: any;
}

export function getSortedToolsData(): ToolData[] {
  const fileNames = fs.readdirSync(toolsDirectory);
  const allToolsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx')) // 1. Ensure we only process .mdx files
    .map((fileName) => {
      // 2. The slug is reliably derived from the filename
      const slug = fileName.replace(/\.mdx$/, '');

      const fullPath = path.join(toolsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      // 3. The slug from the filename is the single source of truth
      return {
        ...matterResult.data,
        slug,
      } as ToolData;
    });

  // Sort tools by name
  return allToolsData.sort((a, b) => {
    // A quick check to prevent error if name is missing in frontmatter
    if (!a.name || !b.name) return 0;
    
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
}

export async function getToolData(
  slug: string
): Promise<ToolData & { content: string }> {
  const fullPath = path.join(toolsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  // The slug from the URL parameter is the single source of truth
  return {
    ...matterResult.data,
    slug,
    content: matterResult.content,
  } as ToolData & { content: string };
}