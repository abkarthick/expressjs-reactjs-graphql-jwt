import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import Layout from '../components/Layout';
import Button from 'react-bootstrap/Button';

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const Dashboard = () => {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleDelete = async (id) => {
    try {
      await deleteUser({ variables: { id } });
      refetch();
    } catch (e) {
      console.error('Error deleting user:', e);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout>
      <h1 className="mt-5">User Dashboard</h1>
      <ul className="list-group">
        {data.getUsers.map(user => (
          <li key={user.id} className="list-group-item">
            {user.email}
            <Button
              variant="danger"
              className="float-end"
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Dashboard;