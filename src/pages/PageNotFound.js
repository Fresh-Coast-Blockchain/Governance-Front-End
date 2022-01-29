import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="text-center font-bold">
      404 Page not found{" "}
      <Link to="/" className="underline text-blue-600">
        go back
      </Link>
    </div>
  );
}

export default PageNotFound;
