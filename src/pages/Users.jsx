import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Registered Users</h2>

      {users.map((user) => {
        const name =
          user.name ||
          user.userName ||
          user.displayName ||
          "N/A";

        const email =
          user.email ||
          user.userEmail ||
          user.emailAddress ||
          "N/A";

        return (
          <div
            key={user.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <p><b>Name:</b> {name}</p>
            <p><b>Email:</b> {email}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Users;