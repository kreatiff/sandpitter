import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CachedIcon from "@mui/icons-material/Cached";

export default function Form({ preFilledData }) {
  const [parentAccount, setParentAccount] = useState("");
  const [parentAccounts, setParentAccounts] = useState([]);
  const [subAccountName, setSubAccountName] = useState("");
  const [taskId, setTaskId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [users, setUsers] = useState([]);
  const [generatedPasswords, setGeneratedPasswords] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const generatePassword = async (index) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generatePassword");
      const { password } = await response.json();

      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers];
        updatedUsers[index].userPassword = password;
        return updatedUsers;
      });

      setGeneratedPasswords((prevPasswords) => {
        const updatedPasswords = [...prevPasswords];
        updatedPasswords[index] = password;
        return updatedPasswords;
      });
    } catch (error) {
      console.error("Error generating password:", error);
    }
    setLoading(false);
  };

  const handleAddUser = () => {
    setUsers((prevUsers) => [
      ...prevUsers,
      {
        userName: "",
        userEmail: "",
        userPassword: "",
        userRole: "",
      },
    ]);
    setGeneratedPasswords((prevPasswords) => [
      ...prevPasswords,
      "", // Add an empty string for the generated password of the new user
    ]);
  };

  const handleUserChange = (index, event) => {
    const { name, value } = event.target;
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers[index][name] = value;
      return updatedUsers;
    });
  };

  const handleRemoveUser = (index) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers.splice(index, 1);
      return updatedUsers;
    });
    setGeneratedPasswords((prevPasswords) => {
      const updatedPasswords = [...prevPasswords];
      updatedPasswords.splice(index, 1);
      return updatedPasswords;
    });
  };

  const handleRowClick = (taskData) => {
    setSubAccountName(taskData.subAccountName);
    setTaskId(taskData.id);
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      if (updatedUsers.length > 0) {
        updatedUsers[0].userName = taskData.userName;
        updatedUsers[0].userEmail = taskData.userEmail;
      }
      return updatedUsers;
    });
  };

  useEffect(() => {
    fetch("/api/getParentAccounts")
      .then((response) => response.json())
      .then((data) => {
        setParentAccounts(data);
      })
      .catch((error) => {
        console.error("Error fetching parent accounts:", error);
      });
  }, []);

  useEffect(() => {
    if (preFilledData) {
      const { subAccountName, userName, userEmail, taskId } = preFilledData;

      setSubAccountName(subAccountName);
      setTaskId(taskId);

      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers];
        if (updatedUsers.length > 0) {
          updatedUsers[0].userName = userName || "";
          updatedUsers[0].userEmail = userEmail || "";
        }
        return updatedUsers;
      });
    } else {
      // Reset the form fields if no pre-filled data is provided
      setSubAccountName("");
      setTaskId("");
      setUsers([
        {
          userName: "",
          userEmail: "",
          userPassword: "",
          userRole: "",
        },
      ]);
    }
  }, [preFilledData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Create a new subaccount
      const subAccountRes = await fetch("/api/createSubAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subAccountName,
          parentAccountID: parentAccount,
        }), // Include parentAccount in the request body
      });
      if (!subAccountRes.ok) throw new Error("Error creating subaccount");
      const subAccountData = await subAccountRes.json();

      // 2. Create a course within the subaccount
      const createCourseRes = await fetch("/api/createCourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subAccountID: subAccountData.id, courseName }),
      });
      if (!createCourseRes.ok) throw new Error("Error creating course");
      const courseData = await createCourseRes.json();

      // 3. Create and enroll each user
      for (let user of users) {
        const createUserRes = await fetch("/api/createUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountId: subAccountData.id,
            name: user.userName,
            shortName: user.userName,
            email: user.userEmail,
            password: user.userPassword,
          }),
        });
        if (!createUserRes.ok) throw new Error("Error creating user");
        const userData = await createUserRes.json();

        const enrollUserRes = await fetch("/api/enrollUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: courseData.id,
            userId: userData.id,
            type: user.userRole,
          }),
        });
        if (!enrollUserRes.ok) throw new Error("Error enrolling user");
        const enrollmentData = await enrollUserRes.json();

        console.log("Enrollment response:", enrollmentData);
      }

      // 4. Post comment to ClickUp task
      const courseUrl = `https://stackle.instructure.com/courses/${courseData.id}`; // Replace with the actual course URL
      let comment = `Course URL: ${courseUrl}`;
      users.forEach((user) => {
        comment += `\n${
          user.userRole === "TeacherEnrollment" ? "Teacher" : "Student"
        } User Details`;
        comment += `\nEmail: ${user.userEmail} \nPassword: ${user.userPassword}`;
      });
      const postCommentRes = await fetch("/api/postClickupComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, comment }),
      });
      if (!postCommentRes.ok)
        throw new Error("Error posting comment to ClickUp task");
      const commentResponse = await postCommentRes.json();

      console.log("Comment response:", commentResponse);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 2, p: 4 }}>
      <Typography variant="h5" component="div" gutterBottom>
        Course and User Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="taskId" value={taskId} />
        <FormControl variant="outlined" margin="normal" fullWidth required>
          <InputLabel>Parent Account</InputLabel>
          <Select
            value={parentAccount}
            onChange={(e) => setParentAccount(e.target.value)}
            label="Parent Account"
          >
            <MenuItem key="1" value="1">
              Root
            </MenuItem>
            {parentAccounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Subaccount Name"
          value={subAccountName}
          onChange={(e) => setSubAccountName(e.target.value)}
          variant="outlined"
          margin="normal"
          fullWidth
          required
        />
        <TextField
          label="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          variant="outlined"
          margin="normal"
          fullWidth
          required
        />

        {users.map((user, index) => (
          <Box key={index} sx={{ mt: 3 }}>
            <Typography variant="h6" component="div" gutterBottom>
              User {index + 1}
              {index !== 0 && (
                <IconButton
                  onClick={() => handleRemoveUser(index)}
                  color="secondary"
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
            </Typography>
            <TextField
              label="User Name"
              name="userName"
              value={user.userName}
              onChange={(e) => handleUserChange(index, e)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="User Email"
              name="userEmail"
              value={user.userEmail}
              onChange={(e) => handleUserChange(index, e)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />

            <TextField
              label="User Password"
              name="userPassword"
              value={user.userPassword}
              onChange={(e) => handleUserChange(index, e)}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => generatePassword(index)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <CachedIcon
                          style={{ animation: "spin 2s infinite linear" }}
                        />
                      ) : (
                        <CachedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {generatedPasswords[index] && (
              <Typography variant="body2" color="textSecondary">
                Generated Password: {generatedPasswords[index]}
              </Typography>
            )}
            <FormControl variant="outlined" margin="normal" fullWidth required>
              <InputLabel>User Role</InputLabel>
              <Select
                name="userRole"
                value={user.userRole}
                onChange={(e) => handleUserChange(index, e)}
                label="User Role"
              >
                <MenuItem value="TeacherEnrollment">Teacher</MenuItem>
                <MenuItem value="StudentEnrollment">Student</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ))}

        <Button
          onClick={handleAddUser}
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          style={{ border: "1px solid", borderColor: "currentColor" }}
          fullWidth
        >
          Add User
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          fullWidth
        >
          Submit
        </Button>
      </form>
    </Card>
  );
}
