const ticketDetailsContainer = document.getElementById('ticketDetailsContainer');
const approveButton = document.getElementById('approveButton');
const cancelButton = document.getElementById('cancelButton');
let tickets = []
let viewingTicketId = localStorage.getItem('viewingTicketId');

function renderTicketDetails() {
    ticketDetailsContainer.innerHTML = '';
    const ticket = tickets.find(t => t._id === viewingTicketId);
    if (ticket) {
        const ticketDetails = `
            <p><strong>Ticket ID:</strong> ${ticket._id}</p>
            <p><strong>Requester Name:</strong> ${ticket.requesterName}</p>
            <p><strong>Project Field:</strong> ${ticket.projectField}</p>
            <p><strong>Comment:</strong> ${ticket.comment}</p>
            <p><strong>Attachments:</strong></p>
            <ul>
                ${ticket.attachments.map(att => `<li><a href="${att.url}" target="_blank">${att.name}</a></li>`).join('')}
            </ul>
            <p><strong>Status:</strong> ${ticket.status}</p>
        `;
        ticketDetailsContainer.innerHTML = ticketDetails;
    }
}

approveButton.addEventListener('click', function() {
    const ticket = tickets.find(t => t._id === viewingTicketId);
    ticket.status = 'Approved';
    ticket.timestamp = new Date().getTime(); // Add timestamp
    console.log('going to set ticket in mongoDB');
    updateTicketInMongoDb(viewingTicketId, ticket);
    window.location.href = 'approver2.html';
});

cancelButton.addEventListener('click', function() {
    const ticket = tickets.find(t => t._id === viewingTicketId);
    ticket.status = 'Cancelled';
    ticket.timestamp = new Date().getTime(); // Add timestamp
    updateTicketInMongoDb(viewingTicketId, ticket);
    window.location.href = 'approver2.html';
});

function updateTicketInMongoDb(ticketId, ticket) {
    console.log('ticketId:', ticketId);
    console.log('ticket:', ticket);
    fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticket)
    }).then(res => res.json())
        .then(data => {
            console.log('Ticket added to MongoDB:', data);
        });
}


window.onload = async () => {
    let response = await fetch('/api/tickets')
    tickets = await response.json();
    renderTicketDetails();
}

