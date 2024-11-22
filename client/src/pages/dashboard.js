import React, { useState, useContext, useEffect } from "react";

import { Container, Box, Paper, Typography } from "@material-ui/core";
import { Tabs, Tab } from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";
import MaterialTable, { MTableActions } from "material-table";
import AddBox from "@material-ui/icons/AddBox";
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
import { Link, useNavigate } from "@reach/router";
import axios from "axios";
import Swal from "sweetalert2";

import { UserContext, userStatus } from "../App";
import { emccServerUrl } from "../config";
import { SHeading, SContent } from "../styled_components";

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

const Dashboard = () => {
  const {
    coachInfo,
    teams,
    individuals,
    setCoachInfo,
    setTeams,
    setIndividuals,
    authStatus,
    setAuthStatus
  } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authStatus === userStatus.UserLoaded) return;
    setLoading(true);
    axios
      .post(emccServerUrl + "/auth/user", {}, { timeout: 10000 })
      .then((response) => {
        setAuthStatus(userStatus.UserLoaded);
        setCoachInfo(response.data.coachInfo);
        setTeams(response.data.teams);
        setIndividuals(response.data.individuals);
        setLoading(false);
      })
      .catch((error) => {
        Swal.fire(
          "Error",
          "There was an error fetching your data. Please try again later.",
          "error"
        );
        setLoading(false);
        console.log(error);
      });
  }, []);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [activeTab, setActiveTab] = useState("view-competitors");
  const navigate = useNavigate();

  const handleTabClicked = (newValue) => {
    switch (newValue) {
      case "view-competitors":
        setActiveTab("view-competitors");
        break;
      case "view-coach-info":
        setActiveTab("view-coach-info");
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

  const logout = () => {
    axios
      .post(emccServerUrl + "/auth/logout", {}, { timeout: 5000 })
      .then((response) => {
        setAuthStatus(userStatus.NoUser);
        setCoachInfo({});
        setTeams([]);
        setIndividuals([]);
        Swal.fire("Successfully logged out.", "", "success");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
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
                        .post(
                          emccServerUrl + "/registration/update-team",
                          newData,
                          {
                            timeout: 5000
                          }
                        )
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
                        .post(
                          emccServerUrl + "/registration/update-team",
                          newData,
                          {
                            timeout: 5000
                          }
                        )
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
            <SHeading variant="h6">
              Notice: Only register a student as an individual if they are not
              on a team. They will be placed in an individual team
              automatically.
            </SHeading>
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
                    deleteText:
                      "Are you sure you want to remove this individual?"
                  }
                }
              }}
              editable={{
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    if (
                      validateIndividual(
                        individuals.length - 1,
                        newData.student
                      )
                    ) {
                      // fields: student
                      // an error response should tell us why it is not possible
                      // (such as "another individual with the same name already exists")
                      console.log("got to onRowAdd");
                      axios
                        .post(
                          emccServerUrl + "/registration/update-indiv",
                          newData,
                          {
                            timeout: 5000
                          }
                        )
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
                    if (
                      validateIndividual(individuals.length, newData.student)
                    ) {
                      axios
                        .post(
                          emccServerUrl + "/registration/update-indiv",
                          newData
                        )
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
      case "view-coach-info":
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
            <Button variant="outlined" onClick={logout}>
              Log out
            </Button>
          </Box>
        );
      default:
        return;
    }
  };

  return (
    <Box
      style={{
        maxWidth: 1200,
        margin: "auto",
        paddingLeft: 30,
        paddingRight: 30
      }}
    >
      <SHeading variant="h2">Dashboard</SHeading>
      <SContent>
        <Typography variant="body1">
          An individual registration costs $20.00, registering a team of between
          two to four students costs $60.00. Payments will be emailed by invoice
          soon after January 15th. Registration for teams will close on January
          20th and individual information should be finalized by January 23rd.
          <br /> <br />
          We will be ordering pizza for all teams on contest day. If any of your
          students requires dietary accommodations, please email us at
          exetermathclub@gmail.com to let us know and we will plan accordingly.
        </Typography>
      </SContent>

      <Paper elevation={3}>
        <Tabs
          value={activeTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(_event, value) => handleTabClicked(value)}
        >
          <Tab value="view-competitors" label="Edit Competitors" />

          <Tab value="view-coach-info" label="Edit Coach Info" />
        </Tabs>
      </Paper>
      <br />
      {renderTab()}
    </Box>
  );
};

export default Dashboard;
