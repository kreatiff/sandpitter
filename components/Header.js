import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box flexGrow={1}>
          <Typography variant="h6" component="div">
            Your App Name
          </Typography>
        </Box>
        {session ? (
          <>
            <Box display="flex" alignItems="center" marginRight={2}>
              <Avatar alt={session.user.name} src={session.user.image} />
              <Typography variant="body1" component="div" marginLeft={1}>
                {session.user.name}
              </Typography>
            </Box>
            <Button variant="contained" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={() => signIn("google")}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
