import { getSortedToolsData, getToolData } from '@/lib/tools';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

// This function tells Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  const tools = getSortedToolsData();
  
  const validParams = tools
    .map((tool) => {
      if (tool && typeof tool.slug === 'string' && tool.slug) {
        return { slug: tool.slug };
      }
      // Explicitly return null for any invalid/unexpected entries
      return null;
    })
    .filter((param): param is { slug: string } => param !== null); // Strictly filter out all nulls

  return validParams;
}

// This function sets the page title
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const tool = await getToolData(params.slug);
    return {
        title: `${tool.name} - AI Tool`
    }
}

export default async function ToolPage({ params }: { params: { slug: string } }) {
  const tool = await getToolData(params.slug);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="container mx-auto p-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:p-8">
          
          <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">
            &larr; 返回首页
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{tool.name}</h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{tool.one_liner}</p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Link href={tool.website_url} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
                访问官网 &rarr;
            </Link>
            <div className="flex flex-wrap gap-2">
                {tool.tags && tool.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          <article className="prose dark:prose-invert lg:prose-lg max-w-none">
            <MDXRemote source={tool.content} />
          </article>
        </div>
      </main>
    </div>
  );
}