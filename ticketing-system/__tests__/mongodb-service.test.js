// Import the function to be tested
const updateTicketInMongoDb = require("../public/lib/mongodb-service.js");

// Mock the global fetch function to simulate API requests
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: "Ticket updated successfully" }),
  })
);

describe("updateTicketInMongoDb", () => {
  // Reset the mock before each test to ensure tests don't affect each other
  beforeEach(() => {
    fetch.mockClear();
  });

  // Test 1: Ensure the fetch function is called with the correct URL and options
  it("should call fetch with the correct URL and options", async () => {
    const ticketId = "123"; // Example ticket ID
    const ticket = { title: "Updated Title", status: "Open" }; // Example ticket data

    // Call the function under test
    await updateTicketInMongoDb(ticketId, ticket);

    // Verify that fetch was called with the expected URL and request options
    expect(fetch).toHaveBeenCalledWith(`/api/tickets/${ticketId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    });
  });

  // Test 2: Check if the correct message is logged when the fetch resolves successfully
  it("should log the correct message when the fetch resolves", async () => {
    console.log = jest.fn(); // Mock console.log to capture its output

    const ticketId = "123"; // Example ticket ID
    const ticket = { title: "Updated Title", status: "Open" }; // Example ticket data

    // Call the function under test
    await updateTicketInMongoDb(ticketId, ticket);

    // Verify that the correct message was logged
    expect(console.log).toHaveBeenCalledWith("Ticket added to MongoDB:", {
      message: "Ticket updated successfully",
    });
  });

  // Test 3: Simulate a network error and ensure it is handled gracefully
  it("should handle a network error gracefully", async () => {
    console.log = jest.fn(); // Mock console.log to capture its output

    // Make the fetch mock reject the promise to simulate a network error
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Network Error"))
    );

    const ticketId = "123"; // Example ticket ID
    const ticket = { title: "Updated Title", status: "Open" }; // Example ticket data

    // Call the function under test, expecting an error to be thrown
    try {
      await updateTicketInMongoDb(ticketId, ticket);
    } catch (e) {
      // Expected error, do nothing
    }

    // Verify that no log message was produced since the update failed
    expect(console.log).not.toHaveBeenCalled();
  });

  // Test 4: Ensure the request is sent with the correct Content-Type header
  it("should send the request with the correct Content-Type header", async () => {
    const ticketId = "456"; // Example ticket ID
    const ticket = { title: "Another Title", status: "Closed" }; // Example ticket data

    // Call the function under test
    await updateTicketInMongoDb(ticketId, ticket);

    // Verify that fetch was called with the correct Content-Type header
    expect(fetch).toHaveBeenCalledWith(`/api/tickets/${ticketId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    });
  });

  // Test 5: Ensure the correct ticket object is sent in the request body
  it("should send the correct ticket object in the request body", async () => {
    const ticketId = "789"; // Example ticket ID
    const ticket = {
      title: "New Title",
      status: "Pending",
      description: "This is a new ticket.", // Additional field in the ticket object
    };

    // Call the function under test
    await updateTicketInMongoDb(ticketId, ticket);

    // Verify that fetch was called with the correct ticket object in the body
    expect(fetch).toHaveBeenCalledWith(`/api/tickets/${ticketId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    });
  });
});
