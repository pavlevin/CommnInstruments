import java.net.Socket;


public class ClientBot extends Client {
	
	final int MESSAGES_NUMBER = 4;
	
	
	public ClientBot(int port) {
		this.port = port;
	}

	public void start() {
		t = new Thread(botRunner);
		t.start();
	}
	
	public void interrupt() {
		t.interrupt();
	}
	
	Runnable botRunner = new Runnable() {
		public void run() {
			try {
				clientSocket = new Socket("127.0.0.1",port);
				initiateStreams(clientSocket);
				Thread.sleep(2000);
				if (clientSocket.isConnected()) {
					findOutMyID();
					doMessaging();
					System.out.println("Sending quit command.");
					sendCommand(Command.QUIT);
				}
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				sleep(2);
				closeClient();
			}
		}
	};
	
	
	void doMessaging()
	throws InterruptedException {
		for (int i = 1; i <= MESSAGES_NUMBER; i++) {
			 int recipientID = i;
			 while (recipientID == myID)
				 recipientID++;
			 Message m = generateMessage(i);
			 // printMessageSent(m);
			 send(m);
			 sleep(1);
			 m = getMessage();
			 // printMessageRecieved(m);
		 }
	}
	
	Message generateMessage(int recipientID) {
		return new Message(myID, recipientID, messageText(), Command.EMPTY);
	}
	
	String messageText() {
		return "Je suis client " + myID + " et je baise votre cheval.";
	}
	
	private void printMessageRecieved(Message message) {
		String senderName = "Contact" + message.getSenderID();
		System.out.printf("From " + senderName + ": %s\n", message.getText());
	}
	
	private void printMessageSent(Message message) {
		String recipientName = "Contact" + message.getRecipientID();
		System.out.printf("To " + recipientName + ": %s\n", message.getText());
	}
	
}
