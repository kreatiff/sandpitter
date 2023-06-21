import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Card, CardContent, Typography } from "@mui/material";

const TaskTable = ({ onRowClick }) => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedTasks, setSortedTasks] = useState([]);
  const pageSizeOptions = [5, 15, 30];
  useEffect(() => {
    fetch("/api/clickupTasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  useEffect(() => {
    const filteredTasks = tasks.filter((task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSortedTasks(filteredTasks);
  }, [tasks, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const columns = [
    { field: "name", headerName: "Name", width: 200, sortable: true },
    { field: "contact", headerName: "Contact", width: 200, sortable: true },
    { field: "email", headerName: "Email", width: 200, sortable: true },
  ];

  const rows = sortedTasks.map((task) => ({
    id: task.id,
    name: task.name,
    contact:
      task.custom_fields.find((field) => field.name === "Contact")?.value || "",
    email:
      task.custom_fields.find((field) => field.name === "Email")?.value || "",
  }));

  return (
    <Card sx={{ padding: "40px" }}>
      <Typography variant="h5" component="div" gutterBottom>
        ClickUp CRM Tasks
      </Typography>
      <CardContent>
        <TextField
          label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div style={{ flex: 1 }}>
            <DataGrid
              columns={columns}
              rows={rows}
              pageSizeOptions={pageSizeOptions}
              onRowClick={(params) =>
                onRowClick(tasks.find((task) => task.id === params.id))
              }
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 15, page: 0 },
                },
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskTable;
