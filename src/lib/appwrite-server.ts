import { Client, Account, Databases } from 'node-appwrite';
import { type RequestCookies } from 'next/dist/server/web/spec-extension/cookies';

const AppwriteServerClient = async (cookies: RequestCookies) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  // Appwrite uses a cookie with format: a_session_<projectId>
  const sessionCookieName = `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
  const session = cookies.get(sessionCookieName);

  if (session) {
    client.setSession(session.value);
  }

  const account = new Account(client);
  const databases = new Databases(client);

  return { account, databases };
};

export { AppwriteServerClient };
