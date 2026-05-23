import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <h3 style={{ padding: "20px", color: "#ff8800" }}>
        Loading users...
      </h3>
    );
  }

  return (
    <div style={{ padding: "20px", color: "#ff8800" }}>

      <h2 style={{ color: "#ff8800", textAlign: "center" }}>
        Registered Users
      </h2>

      {users.length === 0 ? (
        <p style={{ color: "#ff8800" }}>No users found</p>
      ) : (
        users.map((user) => {
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
                border: "1px solid #ff8800",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
                background: "#fff3eb",
                color: "#ff8800"
              }}
            >
              <p><b>Name:</b> {name}</p>
              <p><b>Email:</b> {email}</p>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Users;