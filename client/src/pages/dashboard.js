import React, { useState, useContext, useEffect, useRef } from "react";

import { Box, Paper, Typography } from "@material-ui/core";
import { Tabs, Tab } from "@material-ui/core";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import MaterialTable from "material-table";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { useNavigate } from "@reach/router";
import axios from "axios";
import Swal from "sweetalert2";

import { UserContext, userStatus } from "../App";
import { emccServerUrl } from "../config";
import { SHeading } from "../styled_components";

const tableIcons = {
  Add: (props) => (
    <div>
      <Button variant="contained" color="primary" style={{ marginRight: 8 }}>
        + Add
      </Button>
    </div>
  ),
  Check: (props) => (
    <Button variant="contained" color="primary">
      <Check /> Save
    </Button>
  ),
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: ArrowDownward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

const isEmpty = (str) => str === undefined || str.length === 0;

const validateTeam = (numTeams, student1, student2, student3, student4) => {
  // if (numTeams > coachInfo.teamLimit) {
  //   setError(
  //     "Team limit reached. Please contact the Exeter Math Club email to request more teams. Requests will be evaluated on a case-by-case basis."
  //   );
  //   setStatus(dashboardStatus.InvalidCompetitor);
  //   return false;
  // }
  if (
    (isEmpty(student1) && !isEmpty(student2)) ||
    (isEmpty(student2) && !isEmpty(student3)) ||
    (isEmpty(student3) && !isEmpty(student4))
  ) {
    Swal.fire("Error", "Students must be added from left to right.", "error");
    return false;
  }
  if (isEmpty(student2)) {
    Swal.fire("Error", "Each team must have at least 2 students", "error");
    return false;
  }
  const validStudents = [];
  for (let student of [student1, student2, student3, student4]) {
    if (!isEmpty(student)) validStudents.push(student);
  }
  for (let i = 0; i < validStudents.length; i++) {
    for (let j = 0; j < validStudents.length; j++) {
      if (i !== j && validStudents[i] === validStudents[j]) {
        Swal.fire(
          "Error",
          "Students on the same team must have different names, to avoid problems during grading.",
          "error"
        );
        return false;
      }
    }
  }
  return true;
};

const validateIndividual = (numIndivs, studentName) => {
  // if (numIndivs > coachInfo.indivLimit) {
  //   setError(
  //     "Individual limit reached. Please contact the Exeter Math Club email to request more individuals. Requests will be evaluated on a case-by-case basis."
  //   );
  //   setStatus(dashboardStatus.InvalidCompetitor);
  //   return false;
  // }
  if (isEmpty(studentName)) {
    Swal.fire("Error", "The name of the individual is missing.", "error");
    return false;
  }
  return true;
};

const CompetitorsTab = ({
  teams,
  individuals,
  setTeams,
  setIndividuals,
  loading
}) => {
  return (
    <Box>
      <MaterialTable
        title="Teams"
        options={{
          search: false,
          sorting: false,
          draggable: false
        }}
        icons={tableIcons}
        columns={[
          { title: "Team Name", field: "name" },
          { title: "Student 1", field: "student1" },
          { title: "Student 2", field: "student2" },
          { title: "Student 3", field: "student3" },
          { title: "Student 4", field: "student4" }
        ]}
        isLoading={loading}
        data={teams}
        localization={{
          body: {
            emptyDataSourceMessage:
              'No teams added. Click "+ Add" in the upper right.',
            editRow: {
              deleteText: "Are you sure you want to remove this team?"
            }
          }
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              if (
                validateTeam(
                  teams.length + 1,
                  newData.student1,
                  newData.student2,
                  newData.student3,
                  newData.student4
                )
              ) {
                // fields: name, student1, student2, student3, student4
                // an error response should tell us why it is not possible
                // (such as "another team with the same name already exists")
                axios
                  .post(emccServerUrl + "/registration/update-team", newData, {
                    timeout: 5000
                  })
                  .then((response) => {
                    setTeams(response.data.teams);
                    Swal.fire(
                      "Success",
                      `Team "${newData.name}" was added.`,
                      "success"
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                    Swal.fire("Error", error?.response?.data, "error");
                    reject();
                  });
                resolve();
              } else reject();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              if (
                validateTeam(
                  teams.length,
                  newData.student1,
                  newData.student2,
                  newData.student3,
                  newData.student4
                )
              ) {
                axios
                  .post(emccServerUrl + "/registration/update-team", newData, {
                    timeout: 5000
                  })
                  .then((response) => {
                    setTeams(response.data.teams);
                    Swal.fire(
                      "Success",
                      `Team "${newData.name}" was updated.`,
                      "success"
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                    Swal.fire("Error", error?.response?.data, "error");
                    reject();
                  });
                resolve();
              } else reject();
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              axios
                .post(
                  emccServerUrl + "/registration/delete-competitor",
                  oldData
                )
                .then((response) => {
                  setTeams(response.data.teams);
                  Swal.fire(
                    "Success",
                    `Team "${oldData.name}" was removed.`,
                    "success"
                  );
                })
                .catch((error) => {
                  console.log(error);
                  Swal.fire("Error", error?.response?.data, "error");
                  reject();
                });
              resolve();
            })
        }}
      />
      <br />
      <br />
      <MaterialTable
        title="Individuals"
        options={{
          search: false,
          sorting: false,
          draggable: false
        }}
        icons={tableIcons}
        columns={[{ title: "Student Name", field: "student" }]}
        data={individuals}
        isLoading={loading}
        localization={{
          body: {
            emptyDataSourceMessage:
              'No individuals added. Click "+ Add" in the upper right. Do not add students who are already on a team.',
            editRow: {
              deleteText: "Are you sure you want to remove this individual?"
            }
          }
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              if (validateIndividual(individuals.length - 1, newData.student)) {
                // fields: student
                // an error response should tell us why it is not possible
                // (such as "another individual with the same name already exists")
                console.log("got to onRowAdd");
                axios
                  .post(emccServerUrl + "/registration/update-indiv", newData, {
                    timeout: 5000
                  })
                  .then((response) => {
                    setIndividuals(response.data.individuals);
                    Swal.fire(
                      "Success",
                      `Individual "${newData.student}" was added.`,
                      "success"
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                    Swal.fire("Error", error?.response?.data, "error");
                    reject();
                  });
                resolve();
              } else reject();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              if (validateIndividual(individuals.length, newData.student)) {
                axios
                  .post(emccServerUrl + "/registration/update-indiv", newData)
                  .then((response) => {
                    setIndividuals(response.data.individuals);
                    Swal.fire(
                      "Success",
                      `Individual "${newData.student}" was updated.`,
                      "success"
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                    Swal.fire("Error", error?.response?.data, "error");
                    reject();
                  });
                resolve();
              } else reject();
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              axios
                .post(
                  emccServerUrl + "/registration/delete-competitor",
                  oldData
                )
                .then((response) => {
                  setIndividuals(response.data.individuals);
                  Swal.fire(
                    "Success",
                    `Individual "${oldData.student}" was removed.`,
                    "success"
                  );
                })
                .catch((error) => {
                  console.log(error);
                  Swal.fire("Error", error?.response?.data, "error");
                  reject();
                });
              resolve();
            })
        }}
      />
      <br />
      <br />
    </Box>
  );
};

const CoachInfoTab = ({
  coachInfo,
  setCoachInfo,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  newPasswordConfirm,
  setNewPasswordConfirm,
  handleUpdateCoachInfo,
  handleChangePassword,
  handleLogout,
  loading,
  logoutLoading
}) => {
  return (
    <Box>
      <TextField
        id="coach-email"
        label="Email Address"
        value={coachInfo.email}
        variant="outlined"
        disabled
      />
      <br />
      <br />
      <TextField
        required
        id="coach-name"
        label="Name"
        value={coachInfo.name}
        onChange={(event) =>
          setCoachInfo({ ...coachInfo, name: event.target.value })
        }
        variant="outlined"
      />
      <br />
      <br />
      <TextField
        required
        id="coach-phone"
        label="Phone Number"
        value={coachInfo.phone}
        onChange={(event) =>
          setCoachInfo({ ...coachInfo, phone: event.target.value })
        }
        type="tel"
        variant="outlined"
      />
      <br />
      <br />
      <TextField
        required
        id="coach-mail"
        label="Mailing Address"
        value={coachInfo.mail}
        onChange={(event) =>
          setCoachInfo({ ...coachInfo, mail: event.target.value })
        }
        variant="outlined"
      />
      <br />
      <br />

      <Button variant="outlined" onClick={() => handleUpdateCoachInfo()}>
        Update Info
      </Button>
      <br />
      <br />
      <TextField
        required
        label="Old Password"
        value={oldPassword}
        onChange={(event) => setOldPassword(event.target.value)}
        variant="outlined"
        type="password"
      />
      <br />
      <br />

      <TextField
        required
        label="New Password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        variant="outlined"
        type="password"
      />
      <br />
      <br />
      <TextField
        required
        label="New Password (confirm)"
        value={newPasswordConfirm}
        onChange={(event) => setNewPasswordConfirm(event.target.value)}
        variant="outlined"
        type="password"
      />
      <br />
      <br />

      <Button variant="outlined" onClick={handleChangePassword}>
        Change Password
      </Button>
      <br />
      <br />
      <Button onClick={handleLogout} variant="outlined" disabled={loading}>
        {logoutLoading ? <CircularProgress size={20} /> : "Log Out"}
      </Button>
    </Box>
  );
};

const ResultsTab = ({ indivResults, teamResults, loading }) => {
  return (
    <Box>
      <Typography variant="body1">
        After the competition, results can be viewed here.
      </Typography>
      <br />
      <br />
      <Typography variant="h3" align="center">
        Individual Results
      </Typography>
      <br />
      <MaterialTable
        title="Speed Round"
        options={{ search: false, sorting: false, draggable: false }}
        icons={tableIcons}
        columns={[
          { title: "Name", field: "name" },
          { title: "#/20", field: "speedScore" },
          { title: "Rank", field: "speedRank" },
          { title: "Distribution", field: "speedDistribution" }
        ]}
        isLoading={loading}
        data={indivResults}
        localization={{
          body: { emptyDataSourceMessage: "No results to see here!" }
        }}
      />
      <br />
      <br />
      <MaterialTable
        title="Accuracy Round"
        options={{ search: false, sorting: false, draggable: false }}
        icons={tableIcons}
        columns={[
          { title: "Name", field: "name" },
          { title: "#/10", field: "accuracyScore" },
          { title: "Rank", field: "accuracyRank" },
          { title: "Distribution", field: "accuracyDistribution" }
        ]}
        isLoading={loading}
        data={indivResults}
        localization={{
          body: { emptyDataSourceMessage: "No results to see here!" }
        }}
      />
      <br />
      <br />
      <MaterialTable
        title="Overall"
        options={{ search: false, sorting: false, draggable: false }}
        icons={tableIcons}
        columns={[
          { title: "Name", field: "name" },
          { title: "#/150", field: "overallScore" },
          { title: "Rank", field: "overallRank" }
        ]}
        isLoading={loading}
        data={indivResults}
        localization={{
          body: { emptyDataSourceMessage: "No results to see here!" }
        }}
      />
      <br />
      <br />
      <Typography variant="h3" align="center">
        Team Results
      </Typography>
      <br />
      <MaterialTable
        title="Team Round"
        options={{ search: false, sorting: false, draggable: false }}
        icons={tableIcons}
        columns={[
          { title: "Team", field: "name" },
          { title: "#/15", field: "teamScore" },
          { title: "Rank", field: "teamRank" },
          { title: "Distribution", field: "teamDistribution" }
        ]}
        isLoading={loading}
        data={teamResults}
        localization={{
          body: { emptyDataSourceMessage: "No results to see here!" }
        }}
      />
      <br />
      <br />
      <MaterialTable
        title="Guts Round"
        options={{ search: false, sorting: false, draggable: false }}
        icons={tableIcons}
        columns={[
          { title: "Team", field: "name" },
          { title: "#/300", field: "gutsScore" },
          { title: "Rank", field: "gutsRank" },
          { title: "Distribution", field: "gutsDistribution" },
          {
            title: "Estimation Scores (out of 10)",
            field: "gutsEstimation"
          }
        ]}
        isLoading={loading}
        data={teamResults}
        localization={{
          body: { emptyDataSourceMessage: "No results to see here!" }
        }}
      />
      <br />
      <br />
      <MaterialTable
        title="Overall"
        options={{ search: false, sorting: false, draggable: false }}
        icons={tableIcons}
        columns={[
          { title: "Team", field: "name" },
          {
            title: "Cumulative Individual (out of 600)",
            field: "individualsCumulative"
          },
          { title: "Sweepstakes (out of 1200)", field: "sweepsScore" },
          { title: "Rank", field: "sweepsRank" }
        ]}
        isLoading={loading}
        data={teamResults}
        localization={{
          body: { emptyDataSourceMessage: "No results to see here!" }
        }}
      />
    </Box>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const {
    coachInfo,
    teams,
    individuals,
    indivResults,
    teamResults,
    setCoachInfo,
    setTeams,
    setIndividuals,
    setIndivResults,
    setTeamResults,
    authStatus,
    setAuthStatus
  } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const skipUserFetch = useRef(false);

  useEffect(() => {
    if (skipUserFetch.current) {
      skipUserFetch.current = false;
      return;
    }
    if (authStatus === userStatus.UserLoaded) return;
    setLoading(true);
    axios
      .post(emccServerUrl + "/auth/user", {}, { timeout: 10000 })
      .then((response) => {
        setAuthStatus(userStatus.UserLoaded);
        setCoachInfo(response.data.coachInfo);
        setTeams(response.data.teams);
        setIndividuals(response.data.individuals);
        setIndivResults(response.data.indivResults);
        setTeamResults(response.data.teamResults);
        setLoading(false);
      })
      .catch((error) => {
        Swal.fire(
          "Error",
          "There was an error fetching your data. Please try again later.",
          "error"
        ).then(() => {
          navigate("/"); // change this to your target route
        });
        setLoading(false);
        console.log(error);
      });
  }, [
    navigate,
    authStatus,
    setAuthStatus,
    setCoachInfo,
    setTeams,
    setIndividuals,
    setIndivResults,
    setTeamResults
  ]);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [activeTab, setActiveTab] = useState("view-competitors");

  const handleTabClicked = (newValue) => {
    switch (newValue) {
      case "view-competitors":
        setActiveTab("view-competitors");
        break;
      case "view-coach-info":
        setActiveTab("view-coach-info");
        break;
      case "view-results":
        setActiveTab("view-results");
        break;
      default:
        break;
    }
  };

  const handleUpdateCoachInfo = () => {
    // validate form
    if (
      coachInfo.name.length === 0 ||
      coachInfo.phone.length === 0 ||
      coachInfo.mail.length === 0
    ) {
      Swal.fire("Error", "All fields are required.", "error");
      return;
    }
    // submit form
    axios
      .post(emccServerUrl + "/registration/update-coach-info", coachInfo)
      .then((response) => {
        setCoachInfo(response.data.coachInfo);
        Swal.fire("Success", "Coach info was updated.", "success");
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", error?.response?.data, "error");
      });
    return;
  };

  const handleLogout = () => {
    skipUserFetch.current = true;

    setLogoutLoading(true);

    axios
      .post(emccServerUrl + "/auth/logout", {}, { timeout: 5000 })
      .then((response) => {
        setAuthStatus(userStatus.NoUser);
        setCoachInfo({});
        setTeams([]);
        setIndividuals([]);
        setIndivResults([]);
        setTeamResults([]);
        Swal.fire("Successfully logged out.", "", "success");
        navigate("/");
        window.scrollTo(0, 0);
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 10);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLogoutLoading(false); // stop spinner no matter what
      });
  };

  const handleChangePassword = () => {
    if (!oldPassword) {
      Swal.fire("Error", "Old password is missing", "error");
      return;
    }
    if (!newPassword) {
      Swal.fire("Error", "New password is missing", "error");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      Swal.fire("Error", "New passwords do not match", "error");
      return;
    }
    axios
      .post(
        emccServerUrl + "/auth/change-password",
        { oldPassword, newPassword },
        { timeout: 5000 }
      )
      .then((_response) => {
        Swal.fire("Success", "Password successfully changed.", "success");
      })
      .catch((error) => {
        Swal.fire("Error", error?.response?.data, "error");
        console.log(error);
      });
  };

  const renderTab = () => {
    switch (activeTab) {
      case "view-competitors":
        return (
          <CompetitorsTab
            teams={teams}
            individuals={individuals}
            setTeams={setTeams}
            setIndividuals={setIndividuals}
            loading={loading}
          />
        );
      case "view-coach-info":
        return (
          <CoachInfoTab
            coachInfo={coachInfo}
            setCoachInfo={setCoachInfo}
            oldPassword={oldPassword}
            setOldPassword={setOldPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            newPasswordConfirm={newPasswordConfirm}
            setNewPasswordConfirm={setNewPasswordConfirm}
            handleUpdateCoachInfo={handleUpdateCoachInfo}
            handleChangePassword={handleChangePassword}
            handleLogout={handleLogout}
            loading={loading}
            logoutLoading={logoutLoading}
          />
        );
      case "view-results":
        return (
          <ResultsTab
            indivResults={indivResults}
            teamResults={teamResults}
            loading={loading}
          />
        );
      default:
        return;
    }
  };

  function firstNamify(name) {
    if (!name) return "";
    return (
      name.trim().split(/\s+/)[0][0].toUpperCase() +
      name.trim().split(/\s+/)[0].slice(1)
    );
  }

  return (
    <Box
      style={{
        paddingLeft: 30,
        paddingRight: 30
      }}
    >
      <SHeading variant="h2">Dashboard</SHeading>
      <Typography variant="body1">
        {coachInfo.name
          ? `Welcome to the dashboard, ${firstNamify(coachInfo.name)}! `
          : "Welcome to the dashboard! "}
        Here, you can register teams and individuals. See the contest page for
        information about the distinction between teams and individuals.
      </Typography>{" "}
      <br /> <br />
      <Paper elevation={3}>
        <Tabs
          value={activeTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(_event, value) => handleTabClicked(value)}
        >
          <Tab value="view-competitors" label="Edit Competitors" />

          <Tab value="view-coach-info" label="Edit Coach Info" />

          <Tab value="view-results" label="View Results" />
        </Tabs>
      </Paper>
      <br />
      {renderTab()}
    </Box>
  );
};

export default Dashboard;
