import { useEffect } from "react";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn, UserContext } from "../context/User";
import GroupList from "./Group/GroupList";
import Banner from "./Utils/Banner";
import SearchGroup from "./Group/GroupSearch";
import {API_URL} from "../context/Const";
export default function Group(props) {
    const { user } = useContext(UserContext);

    const [groups, setGroups] = useState([]);
    const [recommendedGroups, setRecommmendedGroups] = useState([]);
    useEffect(() => {
        if (!isLoggedIn(user)) return;
        let joined = [];
        fetch(`${API_URL}/group/${user._id}`)
            .then((res) => res.json())
            .then((fetched) => {
                setGroups(fetched);
                joined = fetched;
            });
        fetch(`${API_URL}/group/user/${user._id}`)
            .then((res) => res.json())
            .then((fetched) => {
                // console.log(fetched)
                // if (joined.length === 0)
                //     console.log("0 joined");
                // setRecommmendedGroups(fetched);
                // console.log(joined[1]);
                // console.log('gg')
                const joined_ids = joined.map(group => group._id);
                // const rec_ids = fetched.map(group => group._id);
                // console.log(fetched[0] === joined[1]);
                // if (joined[1] === fetched[1])
                const rec = fetched.filter(group => !joined_ids.includes(group._id) );
                // console.log(rec)
                setRecommmendedGroups(rec);
            });
        
    }, []);
    if (!isLoggedIn(user)) {
        return <Navigate to="/login" />;
    }

    return (
        <div
            className=" h-100"
            style={{
                overflowY: "auto",
            }}
        >
            <Banner pageName="group" />
            <div className="accordion">
                <SearchGroup groups={groups} />
                <GroupList listName="join" groups={groups} />
                <GroupList listName="recommended" groups={recommendedGroups}/>
            </div>
        </div>
    );
}
