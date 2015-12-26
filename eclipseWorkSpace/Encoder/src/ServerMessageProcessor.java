

public class ServerMessageProcessor
		implements MessageProcessor, Commands {
	
	ServerDirector director;
	
	public ServerMessageProcessor(ServerDirector sd) {
		director = sd;
	}
	
	public void process(Message message) {
		printLog(message);
		processCommand(message);
	}
	
	public void processCommand(Message message) {
		int id = message.getSenderID();
		switch (message.getCommand()) {
		case MY_ID:
			director.notifyContactGotID(id);
			break;
		case PING:
			director.pingReply(id);
			break;
		case QUIT:
			director.clientQuits(id);
			break;
		default:
			director.askToSend(message);
			break;
		}
	}
	
	public void printLog(Message message) {
		String senderName = senderLogin(message);
		String recipientName = recipientLogin(message);
		System.out.printf(senderName + " to " + recipientName +
				": %s\n", message.getText());
	}
	
	String senderLogin(Message message) {
		int id = message.getSenderID();
		if (id != 0)
			return director.getContact(id).getLogin();
		return "Server";
	}
	
	String recipientLogin(Message message) {
		int id = message.getRecipientID();
		if (id != 0)
			return director.getContact(id).getLogin();
		return "Server";
	}
	
}
