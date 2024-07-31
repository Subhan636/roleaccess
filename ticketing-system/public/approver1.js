const ticketTableBody = document.getElementById('ticketTableBody');
let tickets = JSON.parse(localStorage.getItem('tickets')) || [];

function renderTickets() {
    ticketTableBody.innerHTML = '';
    
    tickets.forEach(ticket => {
        if (ticket.status === 'Pending Approval' && ticket.approverLevel === 1) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ticket.id}</td>
                <td>${ticket.requesterName}</td>
                <td>${ticket.projectField}</td>
                <td>${ticket.status}</td>
                <td><button class="btn btn-primary btn-sm" onclick="viewTicket('${ticket.id}')">View</button></td>
            `;
            ticketTableBody.appendChild(row);
        }
    });
}

function viewTicket(ticketId) {
    localStorage.setItem('viewingTicketId', ticketId);
    window.location.href = 'ticket-details.html';
}

window.onload = renderTickets;
