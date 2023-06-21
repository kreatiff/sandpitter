import { signIn, useSession, SessionProvider } from "next-auth/react";

const Login = () => {
  const [session, loading] = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (session) {
    // User is already authenticated, redirect or show authenticated content
    return <div>Authenticated as {session.user.email}</div>;
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
};

const LoginPage = () => {
  return (
    <SessionProvider>
      <Login />
    </SessionProvider>
  );
};

export default LoginPage;
