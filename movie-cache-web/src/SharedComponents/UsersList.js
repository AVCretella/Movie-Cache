import { Link } from "react-router-dom";

//pass users in as a prop so we have a modular userslist
const UsersList = ({users}) => {

    return (
        <>
        {users.map(user => (
            <div>
                <Link key={user.id} to={`/profile/${user.id}`}>
                    <h3>{user.name} - {user.moviesWatched}</h3>
                    <p>{user.bio}</p>
                </Link>
            </div>
            ))
        }
        </>
    )
}

export default UsersList;