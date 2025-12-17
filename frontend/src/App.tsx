import { useEffect, useState } from 'react';

interface User {
  id: number;
  nom: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error('Erreur fetch:', error);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Utilisateurs</h1>

      {users.length === 0 ? (
        <p>Aucun utilisateur</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.nom}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
