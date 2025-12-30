import { Client, Account, Databases } from 'node-appwrite';
import { type RequestCookies } from 'next/dist/server/web/spec-extension/cookies';

const AppwriteServerClient = async (cookies: RequestCookies) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const session = cookies.get('appwrite-session');
  if (session) {
    client.setSession(session.value);
  } else {
    // If no session, the client is unauthenticated.
    // The call to account.get() in the middleware will fail as expected.
  }

  const account = new Account(client);
  const databases = new Databases(client);

  return { account, databases };
};

export { AppwriteServerClient };
