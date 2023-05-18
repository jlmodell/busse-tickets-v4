import { getCurrentUser } from "@/lib/session";
import SignInButton from "./signin";
import SignOutButton from "./signout";

const LoginButtons = async () => {
  const user = await getCurrentUser();

  if (user && user.email) return <SignOutButton email={user?.email} />;
  else return <SignInButton />;
};

export default LoginButtons;
