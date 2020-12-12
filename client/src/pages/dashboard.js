import React, { useState, useContext } from "react";

import { Container, Box, Paper, Typography } from "@material-ui/core";
import { Tabs, Tab } from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";
import MaterialTable from "material-table";
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
import { Link } from "@reach/router";
import axios from "axios";

import { UserContext, userStatus } from "../App";
import { emccServerUrl } from "../config";
import { SHeading } from "../styled_components";

const tableIcons = {
  Add: AddBox,
  Check: Check,
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

const dashboardStatus = {
  ViewCompetitors: "view-competitors",
  InvalidCompetitor: "invalid-competitor",
  UpdateCompetitorSuccess: "update-competitor-success",
  UpdateCompetitorFailure: "update-competitor-failure",
  ViewCoachInfo: "view-coach-info",
  InvalidCoachInfo: "invalid-coach-info",
  UpdateCoachInfoSuccess: "update-coach-info-success",
  UpdateCoachInfoFailure: "update-coach-info-failure"
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

  if (authStatus === userStatus.NoUser) {
    axios
      .post(emccServerUrl + "/auth/user", {}, { timeout: 5000 })
      .then((response) => {
        setAuthStatus(userStatus.UserLoaded);
        setCoachInfo(response.data.coachInfo);
        setTeams(response.data.teams);
        setIndividuals(response.data.individuals);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [status, setStatus] = useState(dashboardStatus.ViewCompetitors);
  const [activeTab, setActiveTab] = useState("view-competitors");
  // const [name, setName] = useState(coachInfo.name.slice());
  // const [phone, setPhone] = useState(coachInfo.phoneNumber.slice());
  // const [email, setEmail] = useState(coachInfo.email.slice());
  // const [mail, setMail] = useState(coachInfo.mailingAddress.slice());
  const [err, setError] = useState("");

  const handleTabClicked = (newValue) => {
    switch (newValue) {
      case "view-competitors":
        setActiveTab("view-competitors");
        setStatus(dashboardStatus.ViewCompetitors);
        break;
      case "view-coach-info":
        setActiveTab("view-coach-info");
        setStatus(dashboardStatus.ViewCoachInfo);
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
      coachInfo.email.length === 0 ||
      coachInfo.mail.length === 0
    ) {
      setStatus(dashboardStatus.InvalidCoachInfo);
      setError("All fields are required.");
      return;
    }
    // submit form
    axios
      .post(emccServerUrl + "/update-coach-info", coachInfo)
      .then((response) => {
        setStatus(dashboardStatus.UpdateCoachInfoSuccess);
      })
      .catch((error) => {
        console.log(error);
        setStatus(dashboardStatus.UpdateCoachInfoFailure);
      });
    return;
  };

  const renderMessage = () => {
    switch (status) {
      case dashboardStatus.InvalidCompetitor:
        return (
          <Typography variant="body1" align="left">
            Error: cannot add competitor
            <br />
            Reason: {err}
          </Typography>
        );
      case dashboardStatus.UpdateCompetitorSuccess:
        return (
          <Typography variant="body1">
            Successfully updated competitors
          </Typography>
        );
      case dashboardStatus.UpdateCompetitorFailure:
        return (
          <Typography variant="body1" align="left">
            Error: could not add, update, or delete competitor (server error)
            <br />
            Reason: {err}
          </Typography>
        );
      case dashboardStatus.InvalidCoachInfo:
        return (
          <Typography variant="body1">
            Error: invalid coach information
            <br />
            Reason: {err}
          </Typography>
        );
      case dashboardStatus.UpdateCoachInfoSuccess:
        return (
          <Typography variant="body1">
            Successfully updated coach information
          </Typography>
        );
      case dashboardStatus.UpdateCoachInfoFailure:
        return (
          <Typography variant="body1" align="left">
            Something went wrong; we could not update your info currently.
            Please try again in a few hours, and let us know at{" "}
            <Link to="mailto:exetermathclub@gmail.com">
              exetermathclub@gmail.com
            </Link>{" "}
            if the issue persists.
          </Typography>
        );
      default:
        return;
    }
  };

  const isEmpty = (str) => str === undefined || str.length === 0;

  const validateTeam = (numTeams, student1, student2, student3, student4) => {
    if (numTeams > coachInfo.teamLimit) {
      setError(
        "Team limit reached. Please contact the Exeter Math Club email to request more teams. Requests will be evaluated on a case-by-case basis."
      );
      setStatus(dashboardStatus.InvalidCompetitor);
      return false;
    }
    if (
      (isEmpty(student1) && !isEmpty(student2)) ||
      (isEmpty(student2) && !isEmpty(student3)) ||
      (isEmpty(student3) && !isEmpty(student4))
    ) {
      setError("Students must be added from left to right.");
      setStatus(dashboardStatus.InvalidCompetitor);
      return false;
    }
    if (isEmpty(student2)) {
      setError("Each team must have at least 2 students");
      setStatus(dashboardStatus.InvalidCompetitor);
      return false;
    }
    const validStudents = [];
    for (let student of [student1, student2, student3, student4]) {
      if (!isEmpty(student)) validStudents.push(student);
    }
    for (let i = 0; i < validStudents.length; i++) {
      for (let j = 0; j < validStudents.length; j++) {
        if (i !== j && validStudents[i] === validStudents[j]) {
          setError(
            "Students on the same team must have different names, to avoid problems during grading."
          );
          setStatus(dashboardStatus.InvalidCompetitor);
          return false;
        }
      }
    }
    return true;
  };

  const validateIndividual = (numIndivs, studentName) => {
    if (numIndivs > coachInfo.indivLimit) {
      setError(
        "Individual limit reached. Please contact the Exeter Math Club email to request more individuals. Requests will be evaluated on a case-by-case basis."
      );
      setStatus(dashboardStatus.InvalidCompetitor);
      return false;
    }
    if (isEmpty(studentName)) {
      setError("Please enter the name of the student.");
      setStatus(dashboardStatus.InvalidCompetitor);
      return false;
    }
    return true;
  };

  const renderTab = () => {
    switch (activeTab) {
      case "view-competitors":
        return (
          <Box>
            {renderMessage()}
            <br />
            <br />
            <MaterialTable
              title="Teams"
              options={{
                search: false,
                sorting: false
              }}
              icons={tableIcons}
              columns={[
                { title: "Team Name", field: "name" },
                { title: "Student 1", field: "student1" },
                { title: "Student 2", field: "student2" },
                { title: "Student 3", field: "student3" },
                { title: "Student 4", field: "student4" }
              ]}
              data={teams}
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
                      console.log("got to onRowAdd");
                      axios
                        .post(
                          emccServerUrl + "/registration/add-team",
                          newData,
                          {
                            timeout: 5000
                          }
                        )
                        .then((response) => {
                          setTeams([...teams, newData]);
                          // newUser.teams.push(newData);
                          // newUser.amountPaid = response.data.amountPaid;
                          // newUser.amountStillOwed =
                          //   response.data.amountStillOwed;
                          setStatus(dashboardStatus.UpdateCompetitorSuccess);
                        })
                        .catch((error) => {
                          console.log(error);
                          setError(error.data);
                          setStatus(dashboardStatus.UpdateCompetitorFailure);
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
                        .then((_response) => {
                          const index = oldData.tableData.id;
                          setTeams([
                            ...teams.slice(0, index),
                            newData,
                            ...teams.slice(index + 1)
                          ]);
                          setStatus(dashboardStatus.UpdateCompetitorSuccess);
                        })
                        .catch((error) => {
                          console.log(error);
                          setError(error.data);
                          setStatus(dashboardStatus.UpdateCompetitorFailure);
                        });
                      resolve();
                    } else reject();
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve, _reject) => {
                    axios
                      .post(emccServerUrl + "/delete-team", oldData)
                      .then((_response) => {
                        const index = oldData.tableData.id;
                        // user.teams.splice(index, 1);
                        setStatus(dashboardStatus.UpdateCompetitorSuccess);
                      })
                      .catch((error) => {
                        console.log(error);
                        setError(error.data);
                        setStatus(dashboardStatus.UpdateCompetitorFailure);
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
                sorting: false
              }}
              style={{ marginBottom: 100 }}
              icons={tableIcons}
              columns={[{ title: "Student Name", field: "student" }]}
              data={individuals}
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
                          emccServerUrl + "/registration/add-indiv",
                          newData,
                          {
                            timeout: 5000
                          }
                        )
                        .then((response) => {
                          setIndividuals([...individuals, newData]);
                          setStatus(dashboardStatus.UpdateCompetitorSuccess);
                        })
                        .catch((error) => {
                          console.log(error);
                          setError(error.data);
                          setStatus(dashboardStatus.UpdateCompetitorFailure);
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
                        .post(emccServerUrl + "/update-indiv", newData)
                        .then((_response) => {
                          const index = oldData.tableData.id;
                          setIndividuals([
                            ...individuals.slice(0, index),
                            newData,
                            ...individuals.slice(index + 1)
                          ]);
                          setStatus(dashboardStatus.UpdateCompetitorSuccess);
                        })
                        .catch((error) => {
                          console.log(error);
                          setError(error.data);
                          setStatus(dashboardStatus.UpdateCompetitorFailure);
                        });
                      resolve();
                    } else reject();
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve, _reject) => {
                    axios
                      .post(emccServerUrl + "/delete-indiv", oldData)
                      .then((_response) => {
                        const index = oldData.tableData.id;
                        setIndividuals([
                          ...individuals.slice(0, index),
                          ...individuals.slice(index + 1)
                        ]);
                        setStatus(dashboardStatus.UpdateCompetitorSuccess);
                      })
                      .catch((error) => {
                        console.log(error);
                        setError(error.data);
                        setStatus(dashboardStatus.UpdateCompetitorFailure);
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
              id="coach-email"
              label="Email Address"
              value={coachInfo.email}
              onChange={(event) =>
                setCoachInfo({ ...coachInfo, email: event.target.value })
              }
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
            {renderMessage()}
          </Box>
        );
      default:
        return;
    }
  };

  return (
    <Container>
      <SHeading variant="h2">Dashboard</SHeading>
      <Paper elevation={3}>
        <Tabs
          value={activeTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(_event, value) => handleTabClicked(value)}
        >
          <Tab
            value="view-competitors"
            label="View and Edit Competitors (Teams and Individuals)"
          />
          <Tab value="view-coach-info" label="View and Edit Coach Info" />
        </Tabs>
      </Paper>
      <br />
      {renderTab()}
    </Container>
  );
};

export default Dashboard;
