import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/userLayout';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionsRequest, getMyConnectionRequest, sendConnectionRequest } from '@/config/redux/action/authAction';


export default function ViewProfilePgae({userProfile}) {

  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();

  const searchParamers = useSearchParams();
    
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest({ token: localStorage.getItem("token")} ));
    await dispatch(getMyConnectionRequest({ token: localStorage.getItem("token")} ))
  }

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username
    })

    setUserPosts(post);
  }, [postReducer.posts])

  useEffect(() => {
  // ✅ Guard everything first
  if (
    !authState ||
    !Array.isArray(authState.connections) ||
    !Array.isArray(authState.connectionRequest) ||
    !userProfile?.userId?._id
  ) {
    return; // <-- CHANGE: bail out early if anything is missing
  }

  const profileId = userProfile.userId._id;

  // ---------- Connections ----------
  const inConnections = authState.connections.some(
    (u) => u?.connectionId?._id === profileId // <-- CHANGE: optional chaining & guard
  );

  if (inConnections) {
    setIsCurrentUserInConnection(true);

    const found = authState.connections.find(
      (u) => u?.connectionId?._id === profileId // <-- CHANGE
    );

    if (found?.status_accepted === true) {      // <-- CHANGE: optional chaining
      setIsConnectionNull(false);
    }
  }

  // ---------- Connection Requests ----------
  const inRequests = authState.connectionRequest.some(
    (u) => u?.userId?._id === profileId // <-- CHANGE: guard & correct _id
  );

  if (inRequests) {
    setIsCurrentUserInConnection(true);

    const foundReq = authState.connectionRequest.find(
      (u) => u?.userId?._id === profileId // <-- CHANGE: fix id -> _id, guard
    );

    if (foundReq?.status_accepted === true) {   // <-- CHANGE: optional chaining
      setIsConnectionNull(false);
    }
  }
}, [
  authState?.connections,              // <-- CHANGE: safe access
  authState?.connectionRequest,        // <-- CHANGE
  userProfile?.userId?._id             // <-- CHANGE: include this so effect re-runs when profile changes
]);

    useEffect(() => {
      getUsersPost();
    }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>

          <div className={styles.backDropContainer}>
            <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt='user_profile' />
          </div>

          <div className={styles.profileContainer_details}>

            <div className={styles.profileContainer_flex}>

              <div className={styles.profileContainer_flex_profile}>

      

              <div className={styles.name_username}>
                <h2> { userProfile.userId.name } </h2>
                <p className={styles.name_username_p} >@{ userProfile.userId.username } </p>
                </div>

                <div className={styles.connection_button}>
                  { isCurrentUserInConnection ? 
                  <button className={styles.connectedButton}> {isConnectionNull ? "Pending" : "Connected" } </button> 
                  :
                  <button onClick={() => {
                    dispatch(sendConnectionRequest({ token: localStorage.getItem("token"),  user_id: userProfile.userId._id}))
                  }} className={styles.connectBtn} >Connect</button>
                }
                <div onClick={ async () =>{
                  const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                  window.open(`${BASE_URL}/${response.data.message}`, "_blank")
                }}
                className={styles.download_Resume}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>

                </div>
                </div>

                <div>
                  <p> { userProfile.bio } </p>
                </div>
             
              </div>

              <div className={styles.recent_Activity}>
                <h3>Recent Activity</h3>

                { userPosts.map((post) => {
                  return (
                      <div key={post._id} className={styles.postCard}>

                        <div className={styles.card}>

                          <div className={styles.card_profileContainer}>

                            { post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt='' /> : <div className={styles.empty_Box}></div> }
                          </div>
                          <p>{post.body}</p>
                        </div>
                      </div>
                  )
                })}
               </div>
            </div>
          </div>

          <div className={styles.workingHistory}>
            <h4>Work History</h4>

            <div className={styles.workHistoryContainer}>

              {
                userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p className={styles.show_workHistoryCard}>
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years}</p>
                    </div>
                  )
                })
              }

            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export async function getServerSideProps(context) {
  console.log("View Profile");
  console.log(context.query.username)

  const request = await clientServer.get('/user/get_profile_based_on_username',{
    params: {
      username: context.query.username
    }
  })

  const response = await request.data;
  console.log(response);
  return { props: { userProfile: request.data.profile } }
}
