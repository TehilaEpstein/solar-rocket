import { SyntheticEvent, useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import fetchGraphQL from "../graphql/GraphQL";
import { Mission } from "../graphql/schema";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Button,
  Grid,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Toolbar,
  Container,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";

import {
  Add as AddIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  SettingsOutlined,
} from "@mui/icons-material";
import {
  DateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ListMenu } from "../components/ListMenu";

type SortField = "Title" | "Date" | "Operator";

interface MissionsResponse {
  data: {
    Missions: Mission[];
  };
}

const getMissions = async (
  sortField: SortField,
  sortDesc?: Boolean
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
    query ($sortField: MissionSortFields!, $sortDesc: Boolean){
    Missions(
      sort: {
        field: $sortField,
        desc: $sortDesc
      }
    ) {
      id
      title
      operator
      launch {
        date
      }
    }
  }
  `,
    { sortField: sortField, sortDesc: sortDesc }
  );
};

const addMission = async (
  title: String,
  operator: String,
  date: Date
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
    mutation ($title: String!, $operator:String!, $date:DateTime!){
      createMission(mission: {
        title: $title,
        operator: $operator,
        launch: {
          date: $date,
          vehicle: "Epsilon IV",
          location: {
            name: "Vandenberg SLC-6",
            longitude: -120.6266,
            latitude: -34.5813
          }
        },
        orbit: {
          periapsis: 700,
          apoapsis: 422,
          inclination: 90
        },
        payload: {
          capacity: 28000,
          available: 0
        }
      }
        ){
        id
        title
        operator
        launch {
          date
        }
      }
    }
  `,
    {
      title: title,
      operator: operator,
      date: date.toISOString(),
    }
  );
};
//
const deleteMissionf = async (id: String): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
    mutation ($id: String!){
      deleteMission(id:$id
        ){
        id
      }
    }
  `,
    {
      id: id,
    }
  );
};
//

const changeMission = async (
  id: String,
  title: String,
  operator:String,
  date:Date
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
    mutation ($id: String!, $title:String!,$operator:String!,$date:DateTime!){
      editMission(id: $id,title: $title,operator: $operator,date: $date
        ){
        id
        title
        operator
        launch {
          date
        }
      }
    }
  `,
    {
      id: id,
      title: title,
      operator: operator,
      date: date
    }
  );
};

const Missions = (): JSX.Element => {
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [newMissionOpen, setNewMissionOpen] = useState(false);
  const [deleteMissionOpen, setDeleteMissionOpen] = useState(false);
  const [editMissionOpen, setEditMissionOpen] = useState(false);
  const [tempLaunchDate, setTempLaunchDate] = useState<Date | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("Title");
  const [errMessage, setErrMessage] = useState<String | null>(null);
  const [title, setTitle] = useState<String>("hi");
  const [operator, setOperator] = useState<String>("lololo");
  const [id, setId] = useState<String>("");
  const [mission, setMission] = useState<Mission | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());

  const newMission = async () => {
    if (date) {
      await addMission(title, operator, date);
    }
    try {
      setMissions((await getMissions(sortField, sortDesc)).data.Missions);
    } catch (error) {
      setErrMessage("Failed to load missions.");
      console.log(error);
    }
  };

  const editMission = async () => {
    if(date)
    await changeMission(id, title,operator,date);

    try {
      setMissions((await getMissions(sortField, sortDesc)).data.Missions);
    } catch (error) {
      setErrMessage("Failed to load missions.");
      console.log(error);
    }
  };

  const deleteMissionFromList = async (id: String) => {
    console.warn("delete id", id);

    await deleteMissionf(id);
    handleDeleteMissionClose();
    try {
      setMissions((await getMissions(sortField, sortDesc)).data.Missions);
    } catch (error) {
      setErrMessage("Failed to load missions.");
      console.log(error);
    }
  };

  const handleErrClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setErrMessage(null);
  };

  const handleEditMissionOpen = (id: String, title: String,operator:String,date:Date) => {
    setId(id);
    setTitle(title);
    setOperator(operator);
    setDate(date);
    setEditMissionOpen(true);

  };

  const handleEditMissionClose = () => {
    setEditMissionOpen(false);
  };

  const handleNewMissionEdit = () => {
    editMission();
    setEditMissionOpen(false);
  };

  const handleNewMissionOpen = () => {
    setNewMissionOpen(true);
  };

  const handleNewMissionClose = () => {
    setNewMissionOpen(false);
  };

  const handleDeleteMissionOpen = (id: String) => {
    setId(id);
    setDeleteMissionOpen(true);
  };

  const handleDeleteMissionClose = () => {
    setDeleteMissionOpen(false);
  };
  const handleNewMissionSave = () => {
    newMission();
    setNewMissionOpen(false);
  };

  const handleTempLaunchDateChange = (newValue: Date | null) => {
    setTempLaunchDate(newValue);
  };

  const handleLaunchDateChange = (newValue: Date | null) => {
    setDate(newValue);
  };

  const handleSortFieldChange = (event: SyntheticEvent, value: SortField) => {
    setSortField(value);
  };

  const handleSortDescClick = () => {
    setSortDesc(!sortDesc);
  };

  useEffect(() => {
    getMissions(sortField, sortDesc)
      .then((result: MissionsResponse) => {
        setMissions(result.data.Missions);
      })
      .catch((err) => {
        setErrMessage("Failed to load missions.");
        console.log(err);
      });
  }, [sortField, sortDesc]);

  return (
    <AppLayout title="Missions">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1">
          Solar Rocket Missions
        </Typography>

        <Toolbar disableGutters>
          <Grid justifyContent="flex-end" container>
            <IconButton>
              <FilterAltIcon />
            </IconButton>
            <ListMenu
              options={["Date", "Title", "Operator"]}
              endIcon={<SortIcon />}
              onSelectionChange={handleSortFieldChange}
            />
            <IconButton onClick={handleSortDescClick}>
              {sortDesc ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          </Grid>
        </Toolbar>

        {missions ? (
          <Grid container spacing={2}>
            {" "}
            {missions.map((missions: Mission, key: number) => (
              <Grid item key={key}>
                <Card sx={{ width: 275, height: 200 }}>
                  <CardHeader
                    title={missions.title}
                    subheader={new Date(missions.launch.date).toDateString()}
                  />
                  <CardContent>
                    <Typography noWrap>{missions.operator}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick={()=>handleEditMissionOpen(missions.id, missions.title,missions.operator,missions.launch.date)}>Edit</Button>
                    <Button onClick={() => handleDeleteMissionOpen(missions.id)}>Delete </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}

        <Tooltip title="New Mission">
          <Fab
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            color="primary"
            aria-label="add"
            onClick={handleNewMissionOpen}
          >
            <AddIcon />
          </Fab>
        </Tooltip>


        <Dialog
          open={newMissionOpen}
          onClose={handleNewMissionClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>New Mission</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  autoFocus
                  id="name"
                  label="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  label="Description"
                  onChange={(e) => setOperator(e.target.value)}
                  variant="standard"
                  fullWidth
                />
              </Grid>

              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    minDate={new Date()}
                    minTime={new Date()}
                    label="Launch Date"
                    value={tempLaunchDate}
                    onAccept={handleTempLaunchDateChange}
                    onChange={handleLaunchDateChange}
                    renderInput={(params) => (
                      <TextField variant="standard" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewMissionClose}>Cancel</Button>
            <Button onClick={handleNewMissionSave}>Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={editMissionOpen}
          onClose={handleEditMissionClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>edit Mission</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  autoFocus
                  id="name"
                  defaultValue={mission?.title}
                  //Value={mission?.title}
                  label="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  //defaultValue={mission?.operator}
                  value={operator}
                  label="Description"
                  onChange={(e) => setOperator(e.target.value)}
                  variant="standard"
                  fullWidth
                />
              </Grid>

              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    minDate={new Date()}
                    minTime={new Date()}
                    label="Launch Date"
                    value={date}
                    onAccept={handleTempLaunchDateChange}
                    onChange={handleLaunchDateChange}
                    renderInput={(params) => (
                      <TextField variant="standard" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditMissionClose}>Cancel</Button>
            <Button onClick={handleNewMissionEdit}>update</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={deleteMissionOpen}
          onClose={handleDeleteMissionClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>delete Mission</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={2}>
              <TextField value="Do you want to delete this mission????" />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteMissionClose}>Cancel</Button>
            <Button onClick={(e) => deleteMissionFromList(id)}>delete</Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Snackbar
        open={errMessage != null}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleErrClose}
      >
        <Alert onClose={handleErrClose} variant="filled" severity="error">
          {errMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export { Missions };
