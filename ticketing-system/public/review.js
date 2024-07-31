const ticketsContainer = document.getElementById('ticketsContainer');
const tickets = JSON.parse(localStorage.getItem('tickets')) || [];

function renderTickets() {
    ticketsContainer.innerHTML = '';
    
    tickets.forEach(ticket => {
        const ticketElement = document.createElement('div');
        ticketElement.className = `ticket ${ticket.status.toLowerCase()}`;
        ticketElement.innerHTML = `
            <p><strong>Ticket ID:</strong> ${ticket.id}</p>
            <p><strong>Requester Name:</strong> ${ticket.requesterName}</p>
            <p><strong>Project Field:</strong> ${ticket.projectField}</p>
            <p><strong>Comment:</strong> ${ticket.comment}</p>
            <p><strong>Attachments:</strong></p>
            <ul>
                ${ticket.attachments.map(att => `<li><a href="${att.url}" target="_blank">${att.name}</a></li>`).join('')}
            </ul>
            <p><strong>Status:</strong> ${ticket.status}</p>
            <button class="btn btn-warning btn-sm" onclick="editTicket('${ticket.id}')">Edit</button>
        `;
        ticketsContainer.appendChild(ticketElement);
    });
}

function editTicket(ticketId) {
    localStorage.setItem('editingTicketId', ticketId);
    window.location.href = 'roles.html';
}

window.onload = renderTickets;
