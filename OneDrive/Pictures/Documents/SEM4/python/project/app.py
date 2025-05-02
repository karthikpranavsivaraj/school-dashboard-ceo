from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

highest_bid = {"amount": 0, "bidder": "", "time": ""}
all_bids = []  # Store all bids

@app.route('/')
def index():
    return render_template('index.html')
from flask_socketio import SocketIO, emit, send

@socketio.on('connect')
def handle_connect():
    print("Client connected")
    
    # Send all previous bids
    for bid in all_bids:
        emit('new_bid', bid)
    
    # Send current highest bid
    if highest_bid['amount'] > 0:
        emit('update_highest', highest_bid)

@socketio.on('place_bid')
def handle_place_bid(data):
    name = data.get('name')
    amount = int(data.get('amount'))
    timestamp = datetime.now().strftime('%H:%M:%S')

    # Validate bid
    if amount <= highest_bid['amount']:
        emit('bid_rejected', {
            'message': f"Your bid ₹{amount} must be higher than the current highest bid ₹{highest_bid['amount']}."
        }, to=request.sid)
        return

    # Accept the bid
    bid = {'name': name, 'amount': amount, 'time': timestamp}
    all_bids.append(bid)
    highest_bid['name'] = name
    highest_bid['amount'] = amount

    emit('new_bid', bid, broadcast=True)
    emit('update_highest', highest_bid, broadcast=True)

@socketio.on('reset_bids')
def handle_reset():
    global highest_bid, all_bids
    highest_bid = {"amount": 0, "bidder": "", "time": ""}
    all_bids.clear()
    emit('bids_reset', broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
