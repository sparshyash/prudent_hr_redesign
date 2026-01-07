import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Protected({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (!user) return <p>Loading...</p>;
  return children;
}
