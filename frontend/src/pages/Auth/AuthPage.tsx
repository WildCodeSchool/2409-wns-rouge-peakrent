// import { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { SignInPage } from "./SignIn";
// import styles from "./SignIn.module.scss";
// import { SignUpPage } from "./SignUp";

// export const AuthPage = (isSignIn: boolean) => {
//   const switchCtnRef = useRef<HTMLDivElement | null>(null);
//   const switchC1Ref = useRef<HTMLDivElement | null>(null);
//   const switchC2Ref = useRef<HTMLDivElement | null>(null);
//   const switchCircle0Ref = useRef<HTMLDivElement | null>(null);
//   const switchCircle1Ref = useRef<HTMLDivElement | null>(null);
//   const aContainerRef = useRef<HTMLDivElement | null>(null);
//   const bContainerRef = useRef<HTMLDivElement | null>(null);
//   const [view, setView] = useState("");

//   const location = useLocation();

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     setView(params.get("view") || "");
//   }, [location.search]);

//   const navigate = useNavigate();
//   const [email, setEmail] = useState("test1@gmail.com");
//   const [password, setPassword] = useState("SuperSecret#2025");
//   const [confirmPassword, setConfirmPassword] = useState("SuperSecret#2025");
//   const [firstname, setFirstname] = useState("Test");
//   const [lastname, setLastname] = useState("Test");
//   const [signinError, setSigninError] = useState("");
//   const [signupError, setSignupError] = useState("");
//   const [view, setView] = useState("");

//   // if (data) {
//   //   return (
//   //     <div>
//   //       <h2>Inscription</h2>
//   //       <p>Ton compte a été créé 🎉, tu peux te connecter</p>
//   //     </div>
//   //   );
//   // }

//   const changeForm = () => {
//     const switchCtn = switchCtnRef.current;
//     const switchC1 = switchC1Ref.current;
//     const switchC2 = switchC2Ref.current;
//     const switchCircle0 = switchCircle0Ref.current;
//     const switchCircle1 = switchCircle1Ref.current;
//     const aContainer = aContainerRef.current;
//     const bContainer = bContainerRef.current;

//     if (!switchCtn || !switchC1 || !switchC2) return;

//     switchCtn.classList.add(styles.isGx);
//     setTimeout(() => {
//       switchCtn.classList.remove(styles.isGx);
//     }, 1500);

//     switchCtn.classList.toggle(styles.isTxr);
//     switchCircle0?.classList.toggle(styles.isTxr);
//     switchCircle1?.classList.toggle(styles.isTxr);

//     switchC1.classList.toggle(styles.isHidden);
//     switchC2.classList.toggle(styles.isHidden);

//     aContainer?.classList.toggle(styles.isTxl);
//     bContainer?.classList.toggle(styles.isTxl);
//     bContainer?.classList.toggle(styles.isZ200);
//   };

//   return (
//     <section className={styles.formContainer}>
//       <div className={styles.main}>
//         {isSignIn ? <SignInPage /> : <SignUpPage />}

//         {/* Switch */}
//         {/* <div className={styles.switch} id="switch-cnt" ref={switchCtnRef}>
//           <div className={styles.switch__circle} ref={switchCircle0Ref}></div>
//           <div
//             className={`${styles.switch__circle} ${styles["switch__circle--t"]}`}
//             ref={switchCircle1Ref}
//           ></div>
//           <div
//             className={styles.switch__container}
//             id="switch-c1"
//             ref={switchC1Ref}
//           >
//             <h2 className={styles.title}>Welcome Back !</h2>
//             <p className={styles.description}>
//               To keep connected with us please login with your personal info
//             </p>
//             <Button
//               // className={classNames(styles.switch__button, styles.button)}
//               onClick={changeForm}
//             >
//               SIGN IN
//             </Button>
//           </div>
//           <div
//             className={classNames(styles.switch__container, styles.isHidden)}
//             id="switch-c2"
//             ref={switchC2Ref}
//           >
//             <h2 className={styles.title}>Hello Friend !</h2>
//             <p className={styles.description}>
//               Enter your personal details and start journey with us
//             </p>
//             <Button
//               // className={classNames(styles.switch__button, styles.button)}
//               onClick={changeForm}
//             >
//               SIGN UP
//             </Button>
//           </div>
//         </div> */}
//       </div>
//       {/* <div>
//         <h2>Connexion</h2>
//         <div>
//           {error && <p style={{ color: "red" }}>{error}</p>}
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               doSubmit();
//             }}
//           >
//             <label>
//               Email * :
//               <input
//                 required
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </label>
//             <br />
//             <br />
//             <label>
//               Mot de passe * :
//               <input
//                 required
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </label>
//             <br />
//             <br />
//             <Button>Connexion</Button>
//             <br />
//             <br />
//             {loading === true && <p>Envoi...</p>}
//           </form>
//         </div>
//       </div> */}
//     </section>
//   );
// };
