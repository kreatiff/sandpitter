import { useState } from "react";
import Form from "../components/Form";
import TaskTable from "../components/TaskTable";
import { Grid, Box } from "@mui/material";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import Header from "../components/Header";

export default function Home() {
  const { data: session } = useSession();
  const [preFilledData, setPreFilledData] = useState(null);
  const [data, setData] = useState(null);
  const router = useRouter();

  const onSubmit = async (values) => {
    const res = await fetch("/api/createSubAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setData(data);
  };

  const handleRowClick = (task) => {
    const data = {
      subAccountName: task.name,
      userName:
        task.custom_fields.find((field) => field.name === "Contact")?.value ||
        "",
      userEmail:
        task.custom_fields.find((field) => field.name === "Email")?.value || "",
    };
    setPreFilledData(data);
  };
  if (session) {
    return (
      <div>
        <Header />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="stretch" // Set to stretch the TaskTable component's height
          width="1600px"
          margin="0 auto"
          padding="40px"
        >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TaskTable onRowClick={handleRowClick} />
            </Grid>
            <Grid item xs={4}>
              <Form onSubmit={onSubmit} preFilledData={preFilledData} />
            </Grid>
            {data && (
              <Grid item xs={12}>
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </Grid>
            )}
          </Grid>
        </Box>
      </div>
    );
  }
  return (
    <div>
      <h2> You are not signed in!!</h2>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
