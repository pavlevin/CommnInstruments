import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.Socket;


public abstract class Client
		implements Commands, MessageStates {
	
	int port = 4444;
	Socket clientSocket;
	ObjectInputStream ois;
	ObjectOutputStream oos;
	Thread t = new Thread();
	
	final int DEFAULT_ID = -1;
	int myID = DEFAULT_ID;
	
	abstract void start();
	abstract void interrupt();
	
	void initiateStreams(Socket socket) {
		try {	// Output - flush - Input: this exact order!
			oos = new ObjectOutputStream(socket.getOutputStream());
			oos.flush();
			ois = new ObjectInputStream(socket.getInputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	void findOutMyID() {
		while (myID == DEFAULT_ID)
			myID = getMessage().getRecipientID();
	}
	
	void sendCommand(Command command) {
		send(new Message(myID, 0, "", command));
	}
	
	void send(Message message) {
		MessageUtils.sendMessage(oos, message);
	}
	
	Message getMessage() {
		return MessageUtils.getMessage(ois);
	}
	
	public int getID() {
		return myID;
	}
	
	public ObjectInputStream getObjectInputStream() {
		return ois;
	}
	
	public ObjectOutputStream getObjectOutputStream() {
		return oos;
	}
	
	void closeClient() {
		System.out.println("Connection is closed for client " + myID + ".");
		closeIgnoringException(clientSocket);
	}
	
	void closeIgnoringException(Socket socket) {
		try {
			socket.close();
		} catch (IOException ioe) {
		}
	}
	
	void sleep(int seconds) {
		try {
			Thread.sleep(seconds*1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

}
