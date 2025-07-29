import { BASE_URL } from '@/config';
import { AcceptConnection, getMyConnectionRequest } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import styles from "./index.module.css"
import { useRouter } from 'next/router';

export default function MyconnectionPage() {

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getMyConnectionRequest({ token: localStorage.getItem("token")}));
  }, [])

  const router = useRouter();

  useEffect(() => {
    if(authState.connectionRequest.length != 0){
      console.log(authState.connectionRequest)
    }
  }, [authState.connectionRequest])
  return (
    <UserLayout>
        <DashboardLayout>
            <div className={styles.container}>
              <h4>My Connections</h4>
              {
                authState.connectionRequest.length === 0 && <h1>No Connection Request Panding</h1>
              }
              {
                authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user, index) => {
                  return (
                    <div onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`)
                    }}
                     className={styles.userCard} key={index}>
                      <div className={styles.Go_userProgile}>
                        <div className={styles.profilePicture}>
                          <img src = {`${BASE_URL}/${user.userId.profilePicture}`} alt='' />
                        </div>

                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>{user.userId.username}</p>
                        </div>
                        <button onClick={(e) => {
                          e.stopPropagation();

                          dispatch(AcceptConnection({
                            connectionId: user._id,
                            token: localStorage.getItem("token"),
                            action: "accept"
                          }))
                        }}
                         className={styles.acceptButton}>Accept</button>
                      </div>
                    </div>
                  )
                })
              }

                <h4>My Network</h4>
              { // original
                authState.connectionRequest.filter((connection) => connection.status_accepted !== null).map((user, index) =>{
                  return(
                    <div onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`)
                    }}
                     className={styles.userCard} key={index}>
                      <div className={styles.Go_userProgile}>
                        <div className={styles.profilePicture}>
                          <img src = {`${BASE_URL}/${user.userId.profilePicture}`} alt='' />
                        </div>

                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>{user.userId.username}</p>
                        </div>
          
                      </div>
                    </div>
                  )
                })
              }
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}
