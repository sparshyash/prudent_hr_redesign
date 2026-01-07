import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "leads")).then(snap => {
      setLeads(snap.docs.map(d => d.data()));
    });
  }, []);

  return (
    <div>
      <h2>All Client Leads</h2>
      {leads.map((l, i) => (
        <div key={i}>
          <b>{l.name}</b> ({l.email})<br/>
          {l.message}
        </div>
      ))}
    </div>
  );
}
