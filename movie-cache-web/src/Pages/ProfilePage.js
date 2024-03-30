import { useParams } from "react-router-dom";
import tempProfiles from "../test_data/test_profiles"
import { useState, useEffect } from 'react'
import axios from 'axios'

const ProfilePage = () => {
    const [profileInfo, setProfileInfo] = useState({userName: "bing", userId: ""})
    const {profileId } = useParams();

    useEffect(async () => {
        const loadProfileInfo = async () => {
            const response = await axios.get(`http://localhost:8000/api/profiles/getTempProfile/${profileId}`)
            const { newProfileInfo } = response.data
            setProfileInfo(newProfileInfo)
        }

        loadProfileInfo()
    }, [])




    // console.log(tempProfiles)
    // console.log(typeof(tempProfiles))
    // const params = useParams(); //When you get routed to this component, grab the url params and parse them for the correct profile
    // const profileId = params.profileId;
    //or can destructure with const {profileId} = useParams();
    // console.log("looking for: ", profileId, typeof(profileId))
    // console.log("this is the id of the second: ", typeof(tempProfiles[2].id))
    const profile = tempProfiles.find(prof => prof.id === profileId);
    // console.log("found: ", profile)

    return (
        <>
            <h1>This is the ProfilePage page with id: {profileId}</h1>
            <p>This User's id is: {profileInfo.userId}</p>
            <p>{profile.bio}</p>
        </>
    )
}

export default ProfilePage;