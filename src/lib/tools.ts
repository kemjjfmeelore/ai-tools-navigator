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
    .map((fileName) => {
      // --- DEBUGGING LOGS START ---
      console.log('[DEBUG] Processing file:', fileName);
      // --- DEBUGGING LOGS END ---

      if (!fileName.endsWith('.mdx')) {
        return null; // 明确跳过非 .mdx 文件
      }
      
      // 从文件名中获取 slug，这是 slug 的唯一可靠来源
      const slug = fileName.replace(/\.mdx$/, '');

      // --- DEBUGGING LOGS START ---
      console.log('[DEBUG] Generated slug:', slug);
      if (!slug) {
        console.error('[ERROR] Slug is empty or undefined for file:', fileName);
      }
      // --- DEBUGGING LOGS END ---

      // 读取 markdown 文件内容
      const fullPath = path.join(toolsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // 使用 gray-matter 解析 frontmatter
      const matterResult = matter(fileContents);

      // 将 frontmatter 数据与从文件名派生的 slug 结合
      // 确保 filename-derived slug 总是覆盖 frontmatter 中的 slug（如果存在）
      return {
        ...matterResult.data, // 展开 frontmatter 中的所有数据
        slug,                 // 用文件名派生的 slug 覆盖或添加 slug 属性
      } as ToolData;
    })
    .filter(Boolean as any as (value: ToolData | null) => value is ToolData); // 过滤掉 null 值


  return allToolsData;
}

export async function getToolData(
  slug: string
): Promise<ToolData & { content: string }> {
  // Add a guard clause to catch invalid slug calls immediately
  if (typeof slug !== 'string' || !slug) {
    throw new Error(`CRITICAL: getToolData was called with an invalid slug: ${slug}`);
  }

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