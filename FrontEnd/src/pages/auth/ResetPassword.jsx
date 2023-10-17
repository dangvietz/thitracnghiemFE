import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  FormControl,
  TextField,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const VITE_LOCAL_SERVER_URL = "http://localhost:8080";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [response, setResponse] = useState({ success: false, data: null, error: null });
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    const codeParam = searchParams.get('code');

    if (emailParam && codeParam) {
      setEmail(emailParam);
      setCode(codeParam);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const apiResponse = await axios.put(`${VITE_LOCAL_SERVER_URL}/api/auth/resetpassword?email=${email}&code=${code}`, {
        email,
        newPassword,
        confirmNewPassword,
      });

      setResponse(apiResponse.data);

      if (apiResponse.data.success) {
        setSuccessMessage('Password reset successfully. Redirecting to login...');
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
      }

    } catch (error) {
      if (error.response && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen" style={{ background: "#fff" }}>
      <div className="flex items-center justify-center w-100">
        <div className="mt-24" style={{ width: "400px" }}>
          <div>
            <Button
              onClick={() => {
                navigate("/auth/login");
              }}
            >
              <ArrowBackIcon />
            </Button>
          </div>
          <div className="w-full flex justify-center mb-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <FormControl fullWidth>
                  <TextField
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </FormControl>
              </div>
              <div className="mb-5">
                <FormControl fullWidth>
                  <TextField
                    type="password"
                    label="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </FormControl>
              </div>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "20px" }}>
                  <CircularProgress />
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "20px" }}>
                  {errorMessage && <div>{errorMessage}</div>}
                  {successMessage && <div>{successMessage}</div>}
                </div>
              )}
              <div className="flex items-center">
                <div className="mr-3 w-full">
                  <FormControl fullWidth>
                    <Button variant="contained" type="submit">
                      Reset Password
                    </Button>
                  </FormControl>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
