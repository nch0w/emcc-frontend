import React from "react";

import { Box, Typography } from "@material-ui/core";
import MaterialTable from "material-table";
import axios from "axios";
import Swal from "sweetalert2";

import { emccServerUrl } from "../../config";
import { tableIcons } from "./tableIcons";

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
      <Typography variant="body1">
        Add teams and individuals entries below. Up until the competition date,
        entries can be freely modified.
        <br />
        <br />
        The registration fee is collected through a separate payment portal.
        This portal will be released in December. An email will be sent to
        coaches when this happens.
      </Typography>{" "}
      <br />
      <MaterialTable
        title="Teams"
        options={{
          search: false,
          sorting: false,
          draggable: false,
          paging: true,
          pageSize: 5,
          pageSizeOptions: []
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
          draggable: false,
          paging: true,
          pageSize: 5,
          pageSizeOptions: []
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

export default CompetitorsTab;
