import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.net.SocketTimeoutException;


public class Server
		implements Runnable, Commands {
	
	ServerDirector director;
	ServerSocket serverSocket;
	
	volatile boolean keepProcessing = true;
	
	
	Server(int port, int millisecondsTimeout)
	throws IOException {
		serverSocket = new ServerSocket(port);
		serverSocket.setSoTimeout(millisecondsTimeout);
		
		director = new ServerDirector(this);
	}
	
	public void run() {
		try {
			while (keepProcessing) {
				Socket socket = serverSocket.accept();
				director.manageNewContact(socket);
			}
		} catch (SocketTimeoutException ste) {
			// System.out.println("Timeout.");
		} catch (Exception e) {
			handle(e);
		}
	}
	
	public void attemptToGetMessageFrom(Contact contact) {
		if (contact.isOnline() && contact.getSocket().isConnected()) {
			Message newMessage = getMessageFrom(contact);
			director.manageNew(newMessage);
		}
	}
	
	public void attemptToSend(Message message) {
		int recipientID = message.getRecipientID();
		Contact recipient = director.getContact(recipientID);
		if (!recipient.equals(null))
			send(recipient, message);
	}
	
	Message getMessageFrom(Contact contact) {
		return MessageUtils.getMessage(contact.getObjectInputStream());
	}
	
	void send(Contact contact, Message message) {
		if (contact.isOnline() && contact.getSocket().isConnected())
			MessageUtils.sendMessage(contact.getObjectOutputStream(), message);
	}
	
	public void stopProcessing() {
		keepProcessing = false;
		closeIgnoringException(serverSocket);
		System.out.println("Server closed.");
	}
	
	private void closeIgnoringException(ServerSocket serverSocket) {
		if (serverSocket != null)
			try {
				serverSocket.close();
			} catch (IOException ignore) {
			}
	}

	private void handle(Exception e) {
		if (!(e instanceof SocketException)) {
			e.printStackTrace();
		}
	}
	
}
