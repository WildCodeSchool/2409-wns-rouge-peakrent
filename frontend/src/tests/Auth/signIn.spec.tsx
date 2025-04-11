import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SIGNIN } from "../../GraphQL/signin";
import { WHOAMI } from "../../GraphQL/whoami";
import { SignInPage } from "../../pages/Auth/SignIn";

const mocks = [
  {
    request: {
      query: gql(SIGNIN),
      variables: {
        datas: {
          email: "test@example.com",
          password: "password123",
        },
      },
    },
    result: {
      data: {
        signIn: {
          id: "3",
        },
      },
    },
  },
  {
    request: {
      query: gql(WHOAMI),
    },
    result: {
      data: {
        whoami: {
          id: "3",
          email: "test@example.com",
          role: "user",
        },
      },
    },
  },
];

const unauthaurizedMock = [
  {
    request: {
      query: gql(SIGNIN),
      variables: {
        datas: {
          email: "test@example.com",
          password: "password123",
        },
      },
    },
    result: {
      errors: [
        {
          message: "Invalid email or password",
          locations: [
            {
              line: 2,
              column: 3,
            },
          ],
          path: ["signIn"],
          extensions: {
            code: "INVALID_CREDENTIALS",
            stacktrace: [
              "GraphQLError: Invalid email or password",
              "    at UserResolver.signIn (/app/src/resolver/Users.ts:95:15)",
            ],
          },
        },
      ],
      data: {
        signIn: null,
      },
    },
  },
];

const mockedUsedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

describe("SignIn Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the SignIn form", () => {
    render(
      <MockedProvider mocks={mocks}>
        <SignInPage />
      </MockedProvider>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Se connecter/i })
    ).toBeInTheDocument();
  });

  it("should call onSubmit with email and password", async () => {
    render(
      <MockedProvider mocks={mocks}>
        <SignInPage />
      </MockedProvider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/mot de passe/i);
    const button = screen.getByRole("button", { name: /Se connecter/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(button);

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("should show an error if unauthorized response", async () => {
    render(
      <MockedProvider mocks={unauthaurizedMock}>
        <SignInPage />
      </MockedProvider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/mot de passe/i);
    const button = screen.getByRole("button", { name: /Se connecter/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(button);

    const errorMessage = screen.getByText("Identification échouée");
    expect(errorMessage).toBeInTheDocument();

    expect(mockedUsedNavigate).not.toHaveBeenCalledWith("/", { replace: true });
  });
});
