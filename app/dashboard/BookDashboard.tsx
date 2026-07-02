'use client';

import { useState, useMemo } from 'react';
import { z } from 'zod';

// Zod schema for runtime validation
const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  category: z.enum(['Sci-Fi', 'Romance', 'Adventure', 'Mystery']),
  year: z.number(),
  pages: z.number(),
});

type Book = z.infer<typeof BookSchema>;

// Mock data
const mockBooks: Book[] = [
  { id: '1', title: 'Dune', author: 'Frank Herbert', category: 'Sci-Fi', year: 1965, pages: 688 },
  { id: '2', title: 'Foundation', author: 'Isaac Asimov', category: 'Sci-Fi', year: 1951, pages: 255 },
  { id: '3', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', year: 1813, pages: 432 },
  { id: '4', title: 'The Notebook', author: 'Nicholas Sparks', category: 'Romance', year: 1996, pages: 214 },
  { id: '5', title: 'Outlander', author: 'Diana Gabaldon', category: 'Romance', year: 1991, pages: 850 },
  { id: '6', title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Adventure', year: 1937, pages: 310 },
  { id: '7', title: 'Treasure Island', author: 'Robert Louis Stevenson', category: 'Adventure', year: 1883, pages: 292 },
  { id: '8', title: 'Life of Pi', author: 'Yann Martel', category: 'Adventure', year: 2001, pages: 460 },
  { id: '9', title: 'The Da Vinci Code', author: 'Dan Brown', category: 'Mystery', year: 2003, pages: 689 },
  { id: '10', title: 'Murder on the Orient Express', author: 'Agatha Christie', category: 'Mystery', year: 1934, pages: 256 },
  { id: '11', title: 'Neuromancer', author: 'William Gibson', category: 'Sci-Fi', year: 1984, pages: 271 },
  { id: '12', title: 'The Martian', author: 'Andy Weir', category: 'Sci-Fi', year: 2011, pages: 369 },
];

interface CategoryStat {
  category: string;
  count: number;
  color: string;
}

export function BookDashboard() {
  const [books] = useState<Book[]>(() => {
    // Validate mock data at runtime
    return mockBooks.map(book => BookSchema.parse(book));
  });

  const stats: CategoryStat[] = useMemo(() => {
    const categoryCounts = books.reduce((acc, book) => {
      acc[book.category] = (acc[book.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryColors: Record<string, string> = {
      'Sci-Fi': 'bg-blue-100 text-blue-800 border-blue-200',
      'Romance': 'bg-pink-100 text-pink-800 border-pink-200',
      'Adventure': 'bg-green-100 text-green-800 border-green-200',
      'Mystery': 'bg-purple-100 text-purple-800 border-purple-200',
    };

    return [
      { category: 'Total Books', count: books.length, color: 'bg-gray-100 text-gray-800 border-gray-200' },
      { category: 'Sci-Fi', count: categoryCounts['Sci-Fi'] || 0, color: categoryColors['Sci-Fi'] },
      { category: 'Romance', count: categoryCounts['Romance'] || 0, color: categoryColors['Romance'] },
      { category: 'Adventure', count: categoryCounts['Adventure'] || 0, color: categoryColors['Adventure'] },
    ];
  }, [books]);

  return (
    <div className="space-y-6">
      {/* Pills */}
      <div className="flex flex-wrap gap-4">
        {stats.map((stat) => (
          <div
            key={stat.category}
            className={`px-6 py-3 rounded-full border-2 ${stat.color} font-semibold shadow-sm`}
          >
            <span className="text-sm uppercase tracking-wide">{stat.category}</span>
            <span className="ml-2 text-xl">{stat.count}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Pages
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {book.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {book.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      book.category === 'Sci-Fi'
                        ? 'bg-blue-100 text-blue-800'
                        : book.category === 'Romance'
                        ? 'bg-pink-100 text-pink-800'
                        : book.category === 'Adventure'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {book.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {book.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {book.pages}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
