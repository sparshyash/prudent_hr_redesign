import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const login = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(
      auth,
      e.target.email.value,
      e.target.password.value
    );
  };

  return (
    <form onSubmit={login}>
      <input name="email" />
      <input name="password" type="password" />
      <button>Login</button>
    </form>
  );
}
