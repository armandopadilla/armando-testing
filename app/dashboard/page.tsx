import { BookDashboard } from './BookDashboard';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Book Collection
        </h1>
        <BookDashboard />
      </div>
    </main>
  );
}
