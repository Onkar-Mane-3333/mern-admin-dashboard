import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>🏠 Home Page</h1>
      <p>Welcome to Routes Learning Project</p>

      <nav>
        <Link to="/about">About</Link> |{" "} 
        <Link to="/contact">Contact</Link>
      </nav>
    </div>
  );
}

export default Home;