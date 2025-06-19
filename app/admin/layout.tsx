import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const adminAuth = (await cookieStore).get('admin-auth');
  
  // If no admin session exists, redirect to login
  if (!adminAuth) {
    redirect('/login?from=/admin');
  }

  try {
    // Verify the session
    const sessionData = JSON.parse(adminAuth.value);
    if (sessionData.username !== 'CromuAdmin') {
      redirect('/login?from=/admin&error=unauthorized');
    }
  } catch {
    // Error parsing session, redirect to login
    redirect('/login?from=/admin&error=session_error');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Optional: Add admin header/navigation here */}
      <main className="w-full min-h-screen bg-gray-900">
        {children}
      </main>
    </div>
  );
}
