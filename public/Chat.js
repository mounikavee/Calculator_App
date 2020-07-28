$(function(){
   	//make connection
		var url = 'https://calculatorexercise.herokuapp.com/' || '/'
		var socket = io.connect(url)

			//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
  var count = 0
	//Emit message
	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');

		if ((data.message == data.message.match(/^\d+$/)) || (data.message == "")) {
			alert("Please enter a valid computation ex: 5+5");
		}

		else {
			try {
				count++
				var computedvalue = eval(data.message)
				chatroom.prepend("<p class='message'>" + data.username + ": " + data.message + "= " + computedvalue +"</p>")
				if(count == 10) {
					chatroom.children().last().remove();
					count--
				}
			} catch (e) {
	    	if (e instanceof SyntaxError) {
	        	alert("Please enter a valid message");
	    	}
			}
		}
	})

	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()})
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a computation to be calculated..." + "</i></p>")
	})
});
