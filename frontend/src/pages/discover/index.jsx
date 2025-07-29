import { getAllUsers } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./index.module.css";
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'

export default function Discoverpage() {

  const authState = useSelector((state) => state.auth)

  const dispath = useDispatch();

  useEffect(() => {
    if (!authState.all_profiles_fetching) {
      dispath(getAllUsers());
    }
  }, [])

  const router = useRouter();
  
  return (
    <UserLayout>
        <DashboardLayout>
            <div className={styles.container}>
                <h1>Discover</h1>
            

            <div className={styles.allUserProfiles}>

              { authState.all_profiles_fetching && authState.all_users.map((user) => {

                return (
                  <div onClick={() => {
                    router.push(`/view_profile/${user.userId.username}`)
                  }} key={user._id} className={styles.userCard}>
                    <img className={styles.userCard_image} src={`${BASE_URL}/${user.userId.profilePicture}`} alt='' />

                    <div>
                      <h1> { user.userId.name } </h1>
                    <p className={styles.username}>@{ user.userId.username } </p>
                    </div>
                  </div>
                )
              }) }
            </div>
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}
