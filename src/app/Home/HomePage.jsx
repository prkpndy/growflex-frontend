import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h1>Hi, Welcome to GroFlex</h1>
      <h3>Please go to the following links:</h3>
      <ul>
        <li>
          <Link to={"/login"}>/login</Link>
        </li>
        <li>
          <Link to={"/register"}>/register</Link>
        </li>
        <li>
          <Link to={"/dashboard"}>/dashboard</Link>
        </li>
      </ul>
    </div>
  );
}
