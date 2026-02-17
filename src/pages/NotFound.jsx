import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, []);

  return <h1>404 - Redirecting...</h1>;
}

export default NotFound;