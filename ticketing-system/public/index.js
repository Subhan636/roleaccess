const ticketsContainer = document.getElementById('ticketsContainer');
const ticketForm = document.getElementById('ticketForm');
const userForm = document.getElementById('userForm');
const fileList = document.getElementById('fileList');
let tickets = JSON.parse(localStorage.getItem('tickets')) || [];
let currentUserType = '';
let editingTicketId = null;

userForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    currentUserType = document.getElementById('userType').value;
    if (currentUserType === 'requester') {
        ticketForm.style.display = 'block';
    } else {
        ticketForm.style.display = 'none';
    }
    renderTickets();
});

ticketForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const requesterName = document.getElementById('requesterName').value;
    const projectField = document.getElementById('projectField').value;
    const comment = document.getElementById('comment').value;
    const attachments = Array.from(document.getElementById('attachment').files);
    
    if (editingTicketId) {
        // Update the existing ticket
        const ticket = tickets.find(t => t.id === editingTicketId);
        ticket.requesterName = requesterName;
        ticket.projectField = projectField;
        ticket.comment = comment;
        ticket.attachments = attachments.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name
        }));
        editingTicketId = null;
    } else {
        // Create a new ticket
        const ticketNumber = generateUniqueTicketNumber();
        const ticket = {
            id: ticketNumber,
            requesterName: requesterName,
            projectField: projectField,
            comment: comment,
            attachments: attachments.map(file => ({
                url: URL.createObjectURL(file),
                name: file.name
            })),
            status: 'Pending Approval',
            approverLevel: 1
        };
        tickets.push(ticket);
        sendToFirstApprover(ticket);
    }
    
    localStorage.setItem('tickets', JSON.stringify(tickets));
    renderTickets();
    ticketForm.reset();
    fileList.innerHTML = '';
});

function generateUniqueTicketNumber() {
    return 'TICKET-' + Math.floor(Math.random() * 1000000);
}

function sendToFirstApprover(ticket) {
    console.log(`Ticket ${ticket.id} sent to first approver.`);
}

function sendToSecondApprover(ticket) {
    console.log(`Ticket ${ticket.id} sent to second approver.`);
}

function renderTickets() {
    ticketsContainer.innerHTML = '';
    
    tickets.forEach(ticket => {
        const ticketElement = document.createElement('div');
        ticketElement.className = `ticket ${ticket.status === 'Approved' ? 'approved' : ticket.status === 'Cancelled' ? 'cancelled' : 'pending'}`;
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
        `;
        
        if (currentUserType.startsWith('approver') && ticket.status.startsWith('Pending') && 
            ((currentUserType === 'approver1' && ticket.approverLevel === 1) ||
             (currentUserType === 'approver2' && ticket.approverLevel === 2))) {
            ticketElement.innerHTML += `
                <button class="btn btn-success btn-sm" onclick="approveTicket('${ticket.id}')">Approve</button>
                <button class="btn btn-danger btn-sm" onclick="cancelTicket('${ticket.id}')">Cancel</button>
            `;
        }

        if (currentUserType === 'requester' && ticket.status === 'Pending Approval') {
            ticketElement.innerHTML += `
                <button class="btn btn-warning btn-sm" onclick="editTicket('${ticket.id}')">Edit</button>
            `;
        }
        
        ticketsContainer.appendChild(ticketElement);
    });
}

function approveTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (ticket.approverLevel === 1) {
        ticket.approverLevel = 2;
        ticket.status = 'Pending Second Level Approval';
        sendToSecondApprover(ticket);
    } else if (ticket.approverLevel === 2) {
        ticket.status = 'Approved';
    }
    
    localStorage.setItem('tickets', JSON.stringify(tickets));
    renderTickets();
}

function cancelTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    ticket.status = 'Cancelled';
    localStorage.setItem('tickets', JSON.stringify(tickets));
    renderTickets();
}

function editTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    
    document.getElementById('requesterName').value = ticket.requesterName;
    document.getElementById('projectField').value = ticket.projectField;
    document.getElementById('comment').value = ticket.comment;
    const dataTransfer = new DataTransfer();
    ticket.attachments.forEach(att => {
        fetch(att.url).then(res => res.blob()).then(blob => {
            const file = new File([blob], att.name, { type: blob.type });
            dataTransfer.items.add(file);
        });
    });
    document.getElementById('attachment').files = dataTransfer.files;
    
    editingTicketId = ticketId;
    ticketForm.scrollIntoView();
}

document.getElementById('attachment').addEventListener('change', function() {
    const files = Array.from(this.files);
    fileList.innerHTML = '';
    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-list-item';
        fileItem.innerHTML = `
            <span>${file.name}</span>
            <button type="button" onclick="removeFile(${index})">Remove</button>
        `;
        fileList.appendChild(fileItem);
    });
});

function removeFile(index) {
    const files = Array.from(document.getElementById('attachment').files);
    files.splice(index, 1);
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    document.getElementById('attachment').files = dataTransfer.files;
    fileList.removeChild(fileList.childNodes[index]);
}

document.getElementById('reviewRequestsButton').addEventListener('click', function() {
    window.location.href = 'review.html';
});

window.onload = function() {
    renderTickets();
};

