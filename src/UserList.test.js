import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserList from "./components/UserList";

describe("UserList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", () => {
    render(<UserList />);

    // Check if the loading image is displayed
    const loadingImage = screen.getByAltText("loading...");
    expect(loadingImage).toBeInTheDocument();

    expect(loadingImage.tagName).toBe("IMG");
  });
  // test to ensure that the component renders correctly when data is fetched successfully.

  it("should render list of users after successful API call", async () => {
    const mockUsers = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    );

    render(<UserList />);

    // waiting for users name to be displayed
    await waitFor(() => {
      mockUsers.forEach((user, index) => {
        const userItem = screen.getByText(`${index + 1}. ${user.name}`);
        expect(userItem).toBeInTheDocument();
      });
    });

    // Ensuring the loading state is removed
    expect(screen.queryByAltText("loading...")).not.toBeInTheDocument();
  });

  it("should display an error message if the API call fails", async () => {
    const errorMessage = "response is not ok status code: 500";

    // Mocking a failed API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error(errorMessage)),
      })
    );

    render(<UserList />);

    // Waiting for the display of error message
    await waitFor(() => {
      const errorElement = screen.getByText(/error occured/i);
      expect(errorElement).toBeInTheDocument();
    });

    // Ensuring  loading state is removed after displaying contentss
    expect(screen.queryByAltText("loading...")).not.toBeInTheDocument();
  });

  it("should handle fetch rejection nicely", async () => {
    const errorMessage = "API is down";

    // Mock a network error
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));

    render(<UserList />);

    // Waiting for the error message to be rendered
    await waitFor(() => {
      const errorElement = screen.getByText(/error occured/i);
      expect(errorElement).toBeInTheDocument();
    });

    // Ensuring that the loading is removed
    expect(screen.queryByAltText("loading...")).not.toBeInTheDocument();
  });
});
