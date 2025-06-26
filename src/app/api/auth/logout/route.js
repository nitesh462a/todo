import { cookies } from 'next/headers';

export async function POST() {
  cookies().set('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });

  return new Response(JSON.stringify({ message: 'Logged out' }), { status: 200 });
}
