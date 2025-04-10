import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { CREATE_USER } from "../../GraphQL/createUser";

export function SignUpPage() {
  const [email, setEmail] = useState("test1@gmail.com");
  const [password, setPassword] = useState("SuperSecret#2025");
  const [confirmPassword, setConfirmPassword] = useState("SuperSecret#2025");
  const [firstname, setFirstname] = useState("Test");
  const [lastname, setLastname] = useState("Test");
  const [signupError, setSignupError] = useState("");

  const [doCreateUser, { data }] = useMutation(CREATE_USER);

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

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          doSubmitSignup();
        }}
      >
        <h2>Create Account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        {signupError && <p style={{ color: "red" }}>{signupError}</p>}
        <Button onClick={doSubmitSignup}>SIGN UP</Button>
      </form>
    </div>
  );
}
