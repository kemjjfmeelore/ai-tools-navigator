import { getSortedToolsData } from '@/lib/tools';
import Link from 'next/link';

export default function Home() {
  const allToolsData = getSortedToolsData();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="container mx-auto p-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">AI音视频工具导航</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allToolsData.map((tool) => (
            <div key={tool.slug} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group relative">
              {/* Internal link to detail page - covers the main card area */}
              <Link href={`/tool/${tool.slug}`} className="absolute inset-0 z-10" aria-label={`查看 ${tool.name} 详情`}></Link>
              
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-500 transition-colors">{tool.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                分类: <span className="font-medium text-blue-600 dark:text-blue-400">{tool.category}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{tool.one_liner}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.tags && tool.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              {/* External link to official website - remains clickable on top */}
              <Link href={tool.website_url} target="_blank" rel="noopener noreferrer" className="relative z-20 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
                前往官网
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
