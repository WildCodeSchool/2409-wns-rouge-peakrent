import { useMutation } from "@apollo/client";
import classNames from "classnames";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CREATE_USER } from "../../GraphQL/createUser";
import { SIGNIN } from "../../GraphQL/signin";
import { WHOAMI } from "../../GraphQL/whoami";
import Button from "../../UI/Button/Button";
import styles from "./SignIn.module.scss";

const SignInPage = () => {
  const switchCtnRef = useRef<HTMLDivElement | null>(null);
  const switchC1Ref = useRef<HTMLDivElement | null>(null);
  const switchC2Ref = useRef<HTMLDivElement | null>(null);
  const switchCircle0Ref = useRef<HTMLDivElement | null>(null);
  const switchCircle1Ref = useRef<HTMLDivElement | null>(null);
  const aContainerRef = useRef<HTMLDivElement | null>(null);
  const bContainerRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const [email, setEmail] = useState("test1@gmail.com");
  const [password, setPassword] = useState("SuperSecret#2025");
  const [confirmPassword, setConfirmPassword] = useState("SuperSecret#2025");
  const [firstname, setFirstname] = useState("Test");
  const [lastname, setLastname] = useState("Test");
  const [signinError, setSigninError] = useState("");
  const [signupError, setSignupError] = useState("");

  const [doSignin] = useMutation(SIGNIN, {
    refetchQueries: [WHOAMI],
  });
  const [doCreateUser, { data }] = useMutation(CREATE_USER);

  async function doSubmitSignin() {
    try {
      const { data } = await doSignin({
        variables: {
          datas: {
            email,
            password,
          },
        },
      });
      if (data.signIn) {
        // connected
        console.log(data.signIn);
        navigate(`/`, { replace: true });
      } else {
        setSigninError("Impossible de vous connecter");
      }
    } catch (e: any) {
      console.error(e);
      setSigninError("Identification échouée");
    }
  }

  async function doSubmitSignup() {
    try {
      await doCreateUser({
        variables: {
          data: {
            email,
            password,
            confirmPassword,
            firstname,
            lastname,
          },
        },
      });
    } catch (e: any) {
      console.error(e);
      if (e.message.includes("password is not strong enough")) {
        setSignupError("Le mot de passe n'est pas assez fort");
      } else if (e.message.includes("email must be an email")) {
        setSignupError("L'email est invalide");
      } else {
        setSignupError(e.message);
      }
    }
  }

  if (data) {
    return (
      <div>
        <h2>Inscription</h2>
        <p>Ton compte a été créé 🎉, tu peux te connecter</p>
      </div>
    );
  }

  const changeForm = () => {
    const switchCtn = switchCtnRef.current;
    const switchC1 = switchC1Ref.current;
    const switchC2 = switchC2Ref.current;
    const switchCircle0 = switchCircle0Ref.current;
    const switchCircle1 = switchCircle1Ref.current;
    const aContainer = aContainerRef.current;
    const bContainer = bContainerRef.current;

    if (!switchCtn || !switchC1 || !switchC2) return;

    switchCtn.classList.add(styles.isGx);
    setTimeout(() => {
      switchCtn.classList.remove(styles.isGx);
    }, 1500);

    switchCtn.classList.toggle(styles.isTxr);
    switchCircle0?.classList.toggle(styles.isTxr);
    switchCircle1?.classList.toggle(styles.isTxr);

    switchC1.classList.toggle(styles.isHidden);
    switchC2.classList.toggle(styles.isHidden);

    aContainer?.classList.toggle(styles.isTxl);
    bContainer?.classList.toggle(styles.isTxl);
    bContainer?.classList.toggle(styles.isZ200);
  };

  return (
    <section className={styles.formContainer}>
      <div className={styles.main}>
        {/* A container */}
        <div
          className={classNames(styles.container, styles.aContainer)}
          id="aContainer"
          ref={aContainerRef}
        >
          <form
            className={styles.form}
            id="a-form"
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              doSubmitSignup();
            }}
          >
            <h2 className={styles.title}>Create Account</h2>
            <span className={styles.form__span}>
              or use email for registration
            </span>
            <input
              className={styles.form__input}
              name="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={styles.form__input}
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className={styles.form__input}
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={styles.form__input}
              name="firstname"
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              className={styles.form__input}
              name="lastname"
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            {signupError && <p style={{ color: "red" }}>{signupError}</p>}
            <Button onClick={doSubmitSignup}>SIGN UP</Button>
          </form>
        </div>

        {/* B container */}
        <div
          className={classNames(styles.container, styles.bContainer)}
          id="bContainer"
          ref={bContainerRef}
        >
          <form
            className={styles.form}
            id="b-form"
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              doSubmitSignin();
            }}
          >
            <h2 className={styles.title}>Sign in to Website</h2>
            <span className={styles.form__span}>or use your email account</span>
            <input
              className={styles.form__input}
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={styles.form__input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a className={styles.form__link}>Forgot your password?</a>
            {signinError && <p style={{ color: "red" }}>{signinError}</p>}
            <Button onClick={doSubmitSignin}>SIGN IN</Button>
          </form>
        </div>

        {/* Switch */}
        <div className={styles.switch} id="switch-cnt" ref={switchCtnRef}>
          <div className={styles.switch__circle} ref={switchCircle0Ref}></div>
          <div
            className={`${styles.switch__circle} ${styles["switch__circle--t"]}`}
            ref={switchCircle1Ref}
          ></div>
          <div
            className={styles.switch__container}
            id="switch-c1"
            ref={switchC1Ref}
          >
            <h2 className={styles.title}>Welcome Back !</h2>
            <p className={styles.description}>
              To keep connected with us please login with your personal info
            </p>
            <Button
              // className={classNames(styles.switch__button, styles.button)}
              onClick={changeForm}
            >
              SIGN IN
            </Button>
          </div>
          <div
            className={classNames(styles.switch__container, styles.isHidden)}
            id="switch-c2"
            ref={switchC2Ref}
          >
            <h2 className={styles.title}>Hello Friend !</h2>
            <p className={styles.description}>
              Enter your personal details and start journey with us
            </p>
            <Button
              // className={classNames(styles.switch__button, styles.button)}
              onClick={changeForm}
            >
              SIGN UP
            </Button>
          </div>
        </div>
      </div>
      {/* <div>
        <h2>Connexion</h2>
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doSubmit();
            }}
          >
            <label>
              Email * :
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <br />
            <br />
            <label>
              Mot de passe * :
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <br />
            <br />
            <Button>Connexion</Button>
            <br />
            <br />
            {loading === true && <p>Envoi...</p>}
          </form>
        </div>
      </div> */}
    </section>
  );
};

export default SignInPage;
