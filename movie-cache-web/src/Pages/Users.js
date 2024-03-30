import tempProfiles from '../test_data/test_profiles'
import { Link } from 'react-router-dom';
import UsersList from '../SharedComponents/UsersList';

const UsersPage = () => {
    const users = tempProfiles
    return (
        <>
            <h1> User Search </h1>
            <UsersList users={users} />
        </>
    )
}

export default UsersPage;