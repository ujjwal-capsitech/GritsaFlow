
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type Rootstate } from "../redux/store";
import { logout } from "../redux/slice/LoginSlice";
import { useNavigate } from "react-router-dom";

const SessionTimeout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tokenExpiry = useSelector((state: Rootstate) => state.auth.tokenExpiry);

    useEffect(() => {
        if (!tokenExpiry) return;

        const expiryDate = new Date(tokenExpiry).getTime(); // Convert string to timestamp
        const now = Date.now(); // Get current time

        if (now >= expiryDate) {
            dispatch(logout()); // clear Redux state and localStorage
            navigate("/", { replace: true }); // go to Login page
        }
    }, [tokenExpiry, dispatch, navigate]);
    return null;
};

export default SessionTimeout;
