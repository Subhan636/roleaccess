async function updateTicketInMongoDb(ticketId, ticket) {
  await fetch(`/api/tickets/${ticketId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Ticket added to MongoDB:", data);
    });
}

module.exports = updateTicketInMongoDb;
