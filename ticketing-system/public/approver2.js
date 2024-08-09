const ticketTableBody = document.getElementById('ticketTableBody');
let tickets = []

function renderTickets() {
    ticketTableBody.innerHTML = '';
    
    tickets.forEach(ticket => {
        if (ticket.status === 'Pending Second Level Approval' && ticket.approverLevel === 2) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ticket._id}</td>
                <td>${ticket.requesterName}</td>
                <td>${ticket.projectField}</td>
                <td>${ticket.status}</td>
                <td><button class="btn btn-primary btn-sm" onclick="viewTicket('${ticket._id}')">View</button></td>
            `;
            ticketTableBody.appendChild(row);
        }
    });
}

function viewTicket(ticketId) {
    localStorage.setItem('viewingTicketId', ticketId);
    window.location.href = 'ticket-details2.html';
}

window.onload = async () => {
    response = await fetch('/api/tickets')
    tickets = await response.json();
    renderTickets();
}

