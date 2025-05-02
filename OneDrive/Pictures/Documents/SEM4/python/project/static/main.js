
const socket = io();

function submitBid() {
    const username = document.getElementById('user').value.trim();
    const bid = document.getElementById('amount').value;

    if (!username || !bid || bid <= 0) {
        alert("Enter a valid name and bid amount.");
        return;
    }

    socket.emit('place_bid', { username, bid });
    document.getElementById('amount').value = '';
}

function resetBids() {
    if (confirm("Are you sure you want to reset all bids?")) {
        socket.emit('reset_bids');
    }
}

socket.on('new_bid', (data) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.username}</td>
        <td>₹${data.bid}</td>
        <td>${data.time}</td>
    `;
    document.getElementById('bid-list').prepend(row);
});

socket.on('update_highest', (data) => {
    document.getElementById('highest-bid').textContent = data.bid;
});

socket.on('bids_reset', () => {
    document.getElementById('bid-list').innerHTML = '';
    document.getElementById('highest-bid').textContent = '0';
});
socket.on('bid_rejected', (data) => {
    alert(data.message); // or use a modal/Toast if preferred
});
