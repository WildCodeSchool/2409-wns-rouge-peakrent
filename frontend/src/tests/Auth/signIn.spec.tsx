import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SIGNIN } from "../../graphQL/signin";
import { WHOAMI } from "../../graphQL/whoami";
import { SignInPage } from "../../pages/Auth/SignIn";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mocks = [
  {
    request: {
      query: gql(SIGNIN),
      variables: {
        datas: {
          email: "test@example.com",
          password: "Password123*",
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
          password: "Password123*",
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

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <MockedProvider mocks={mocks}>{ui}</MockedProvider>
    </MemoryRouter>
  );
};

describe("SignIn Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the SignIn form", () => {
    renderWithRouter(<SignInPage />);

    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Se connecter/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /Se souvenir de moi/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Mot de passe oublié/i })
    ).toBeInTheDocument();
  });

  it("should call onSubmit with email and password", async () => {
    renderWithRouter(<SignInPage />);

    await userEvent.type(screen.getByTestId("email"), "test@example.com");
    await userEvent.type(screen.getByTestId("password"), "Password123*");
    await userEvent.click(
      screen.getByRole("button", { name: /Se connecter/i })
    );

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("should show an error if unauthorized response", async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={unauthaurizedMock}>
          <SignInPage />
        </MockedProvider>
      </MemoryRouter>
    );

    await userEvent.type(screen.getByTestId("email"), "test@example.com");
    await userEvent.type(screen.getByTestId("password"), "Password123*");
    await userEvent.click(
      screen.getByRole("button", { name: /Se connecter/i })
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Identifiant ou mot de passe incorrect",
      { duration: 7000 }
    );
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});
