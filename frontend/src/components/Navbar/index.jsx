import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

export default function NavBarComponent() {
  const router = useRouter();

  const dispath = useDispatch();
  const authState = useSelector((state) => state.auth);
  return (
    <div className={styles.container}>
      <div className={styles.navBar}>
        <h1
          onClick={() => {
            router.push("/");
          }}
        >
          Pro Connect
        </h1>

        <div className={styles.navBarOptionContainer}>

        {authState.profileFetched && <div>
            
            <div className={styles.button_Containers}>
        
                <p onClick={() => {
                  router.push("/profile")
                }} className={styles.button_Containers_profile}>Profile</p>

                <p onClick={() => {
                  localStorage.removeItem("token")
                  router.push("/login")
                  dispath(reset())
                }} className={styles.button_Containers_logout}>Logout</p>
            </div>
            
            </div>}


          {!authState.profileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
