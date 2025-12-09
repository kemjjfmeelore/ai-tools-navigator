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
  // Get file names under /src/tools
  const fileNames = fs.readdirSync(toolsDirectory);
  const allToolsData = fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get slug
    const slug = fileName.replace(/\.mdx$/, '');

    // Read markdown file as string
    const fullPath = path.join(toolsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the slug and assert the type
    return {
      slug,
      ...matterResult.data,
    } as ToolData;
  });

  // Sort tools by name
  return allToolsData.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
}

export async function getToolData(slug: string): Promise<ToolData & { content: string }> {
  const fullPath = path.join(toolsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Combine the data with the slug and content
  return {
    slug,
    content: matterResult.content,
    ...matterResult.data,
  } as ToolData & { content: string };
}
