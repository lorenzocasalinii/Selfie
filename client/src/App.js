import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TimeMachineProvider } from "./context/TimeMachineContext";
import Login from "./components/loginsignup/Login";
import Signup from "./components/loginsignup/Signup";
import Profile from "./components/profile/Profile";
import Calendar from "./components/calendar/Calendar";
import Pomodoro from "./components/pomodoro/Pomodoro";
import Notes from "./components/notes/Notes";
import TimeMachine from "./components/timemachine/TimeMachine";
import ProtectedRoute from "./components/loginsignup/ProtectedRoute";
import ForgotPassword from "./components/loginsignup/ForgotPassword";
import ResetPassword from "./components/loginsignup/ResetPassword";
import Inbox from "./components/profile/Inbox";
import InvitationHandler from "./components/calendar/InvitationHandler";
import HomePage from "./components/homepage/Homepage";
import "../src/styles/Global.css";
const App = () => {
  return (
    <AuthProvider>
      <TimeMachineProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pomodoro"
              element={
                <ProtectedRoute>
                  <Pomodoro />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/time-machine"
              element={
                <ProtectedRoute>
                  <TimeMachine />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/forgot-password" 
              element={ <ForgotPassword />} 
            />
            <Route 
              path="/reset-password/:token" 
              element={<ResetPassword /> } 
            />
            <Route
              path="/events/:id/accept"
              element={<InvitationHandler action="accept" type="events" />}
            />
            <Route
              path="/events/:id/reject"
              element={<InvitationHandler action="rejct" type="events" />}
            />
            <Route
              path="/events/:id/resend"
              element={<InvitationHandler action="resend" type="events" />}
            />
            <Route
              path="/tasks/:id/accept"
              element={<InvitationHandler action="accept" type="tasks" />}
            />
            <Route
              path="/tasks/:id/reject"
              element={<InvitationHandler action="reject" type="tasks" />}
            />
            <Route
              path="/tasks/:id/resend"
              element={<InvitationHandler action="resend" type="tasks" />}
            />
            <Route path="/" element={<Login />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </Router>
      </TimeMachineProvider>
    </AuthProvider>
  );
};

export default App;
