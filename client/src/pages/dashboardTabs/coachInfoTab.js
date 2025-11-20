import React, { useState } from "react";

import { Box } from "@material-ui/core";
import { TextField, Button, CircularProgress } from "@material-ui/core";

import axios from "axios";
import Swal from "sweetalert2";
import { emccServerUrl } from "../../config";

const CoachInfoTab = ({
  coachInfo,
  setCoachInfo,
  setAuthStatus,
  userStatus,
  setTeams,
  setIndividuals,
  setIndivResults,
  setTeamResults,
  navigate,
  skipUserFetch
}) => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [updateCoachInfoLoading, setUpdateCoachInfoLoading] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const handleUpdateCoachInfo = () => {
    setUpdateCoachInfoLoading(true);
    if (!coachInfo.name || !coachInfo.phone || !coachInfo.mail) {
      Swal.fire("Error", "All fields are required.", "error");
      return;
    }

    axios
      .post(emccServerUrl + "/registration/update-coach-info", coachInfo)
      .then((response) => {
        setCoachInfo(response.data.coachInfo);
        Swal.fire("Success", "Coach info was updated.", "success");
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", error?.response?.data, "error");
      })
      .finally(() => {
        setUpdateCoachInfoLoading(false);
      });
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

  const handleChangePassword = (event) => {
    event.preventDefault();
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
      setNewPassword("");
      setNewPasswordConfirm("");
      return;
    }
    setChangePasswordLoading(true);
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
      })
      .finally(() => {
        setChangePasswordLoading(false);
        setOldPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
      });
  };

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

      <Button
        variant="outlined"
        onClick={() => handleUpdateCoachInfo()}
        disabled={updateCoachInfoLoading}
      >
        {updateCoachInfoLoading ? (
          <CircularProgress size={20} />
        ) : (
          "Update Info"
        )}
      </Button>
      <br />
      <br />
      <form onSubmit={handleChangePassword} autoComplete="on">
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

        <Button
          variant="outlined"
          type="submit"
          disabled={changePasswordLoading}
        >
          {changePasswordLoading ? (
            <CircularProgress size={20} />
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
      <br />
      <br />
      <Button
        onClick={handleLogout}
        variant="outlined"
        disabled={logoutLoading}
      >
        {logoutLoading ? <CircularProgress size={20} /> : "Log Out"}
      </Button>
    </Box>
  );
};

export default CoachInfoTab;
