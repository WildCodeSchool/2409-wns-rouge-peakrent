import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SIGNIN } from "../../GraphQL/signin";
import { SignInPage } from "../../pages/Auth/SignIn";

const mocks = [
  {
    request: {
      query: SIGNIN,
      variables: {
        datas: {
          email: "test1@gmail.com",
          password: "SuperSecret#2025",
        },
      },
    },
    result: {
      data: {
        signIn: {
          id: "1",
        },
      },
    },
  },
  {
    request: {
      query: SIGNIN,
      variables: {
        datas: {
          email: "wrong@gmail.com",
          password: "wrongpassword",
        },
      },
    },
    result: {
      errors: [{ message: "Invalid credentials" }],
    },
  },
];

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("SignInPage", () => {
  it("should render the login form correctly", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SignInPage />
      </MockedProvider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    expect(submitButton).toBeInTheDocument();
  });

  it("should submit the form correctly", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SignInPage />
      </MockedProvider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test1@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "SuperSecret#2025" } });

    fireEvent.click(submitButton);

    await screen.findByText("Sign in to Website");
  });

  it("should show error if login fails", async () => {
    const failedMocks = [
      {
        request: {
          query: SIGNIN,
          variables: {
            datas: {
              email: "wrong@gmail.com",
              password: "wrongpassword",
            },
          },
        },
        result: {
          data: {
            signIn: false,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={failedMocks} addTypename={false}>
        <SignInPage />
      </MockedProvider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "wrong@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(
      /Impossible de vous connecter/i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
