import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SIGNIN } from "../../GraphQL/signin";
import { WHOAMI } from "../../GraphQL/whoami";
import Button from "../../UI/Button/Button";
import styles from "./SignIn.module.scss";

export const SignInPage = () => {
  const [email, setEmail] = useState("test1@gmail.com");
  const [password, setPassword] = useState("SuperSecret#2025");
  const [signinError, setSigninError] = useState("");
  const navigate = useNavigate();

  const [doSignin] = useMutation(SIGNIN, {
    refetchQueries: [WHOAMI],
  });

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
        console.log(data.signIn);
        navigate(`/`, { replace: true });
      } else {
        setSigninError("Impossible de vous connecter");
      }
    } catch (e) {
      console.error(e);
      setSigninError("Identification échouée");
    }
  }

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          doSubmitSignin();
        }}
      >
        <h2>Sign in to Website</h2>
        <input
          className={styles.form__input}
          type="email"
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
        {signinError && <p style={{ color: "red" }}>{signinError}</p>}
        <Button onClick={doSubmitSignin}>SIGN IN</Button>
      </form>
    </div>
  );
};
