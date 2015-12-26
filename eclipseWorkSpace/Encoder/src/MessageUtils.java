import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.OutputStream;
import java.io.ObjectOutputStream;
import java.net.Socket;
import java.io.IOException;


public class MessageUtils implements MessageStates {
	
	private static InputStream is;
	private static ObjectInputStream ois;
    private static OutputStream os;
    private static ObjectOutputStream oos;
    
    
	public static Message getMessage(Socket socket) {
		try {
			is = socket.getInputStream();
			ois = new ObjectInputStream(is);
			return getMessage(ois);
		} catch (IOException ioe) {
			handleExceptionCaughtWhileGetting(ioe);
			return new Message();
		}
	}
	
	public static Message getMessage(ObjectInputStream ois) {
		try {
			Message message = (Message) ois.readObject();
			message.switchState();
			return message;
		} catch (Exception e) {
			handleExceptionCaughtWhileGetting(e);
			return new Message();
		}
	}
	
	public static void sendMessage(Socket socket, Message message) {
		try {
			os = socket.getOutputStream();
			oos = new ObjectOutputStream(os);
			sendMessage(oos, message);
		} catch (IOException ioe) {
			handleExceptionCaughtWhileSending(ioe);
		}
	}
	
	public static void sendMessage(ObjectOutputStream oos, Message message) {
		try {
			message.switchState();
			oos.writeObject(message);
			oos.flush();
		} catch (IOException ioe) {
			handleExceptionCaughtWhileSending(ioe);
		}
	}
	
	private static void handleExceptionCaughtWhileGetting(Exception e) {
		System.err.println("Exception caught while getting message " +
				"from socket.");
		e.printStackTrace();
	}
	
	private static void handleExceptionCaughtWhileSending(Exception e) {
		System.err.println("Exception caught while sending message " +
				"to socket.");
		e.printStackTrace();
	}
	
}
