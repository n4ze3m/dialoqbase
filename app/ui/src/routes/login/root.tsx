import { QueryBoundaries } from "../../components/Common/QueryBoundaries";
import { AuthLogin } from "../../components/Auth/Login";

export default function LoginRoot() {
  return (
    <QueryBoundaries>
      {" "}
      <AuthLogin />
    </QueryBoundaries>
  );
}
