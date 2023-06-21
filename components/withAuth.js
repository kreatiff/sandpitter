import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const session = await getSession();

        if (!session) {
          // If the user is not authenticated, redirect to the login page
          router.push("/login");
        }
      };

      checkAuth();
    }, []);

    if (typeof window !== "undefined" && !props.session) {
      // Render a loading state if the session information is not available yet
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
