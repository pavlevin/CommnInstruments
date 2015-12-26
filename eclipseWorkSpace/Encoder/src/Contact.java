import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;


public class Contact {
	
	private Thread t;
	private Socket socket;
	private ObjectInputStream ois;
	private ObjectOutputStream oos;
	private boolean isOnline;
	private int id;
	private String login = "";
	private ContactMessagesReciever reciever;
	
	public List<Message> myMessages= new ArrayList<Message>();
	
	public Contact(int id, Socket socket) {
		this.id = id;
		this.socket = socket;
		initiateStreams(socket);
		this.isOnline = true;
		this.login = "Contact" + id;
	}
	
	private void initiateStreams(Socket socket) {
		try {	// Output - flush - Input: this exact order!
			oos = new ObjectOutputStream(socket.getOutputStream());
			oos.flush();
			ois = new ObjectInputStream(socket.getInputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void startSession() {
		t = new Thread(clientHandler);
		t.start();
	}
	
	Runnable clientHandler = new Runnable() {
		public void run() {
			try {
				while (isOnline())
					if (recieverExistsButCurrentlyInactive())
						reciever.start();
				Thread.sleep(1111);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	};
	
	public boolean recieverExistsButCurrentlyInactive() {
		return reciever != null && !reciever.equals(null) && !reciever.isRunning;
	}
	
	public void setLogin(String login) {
		this.login = login;
	}
	
	public void setStatusOnline() {
		isOnline = true;
	}
	
	public void setStatusOffline() {
		isOnline = false;
	}
	
	public void setReciever(ContactMessagesReciever cmr) {
		reciever = cmr;
	}
	
	public boolean isOnline() {
		return isOnline;
	}
	
	public Socket getSocket() {
		return socket;
	}
	
	public ObjectInputStream getObjectInputStream() {
		return ois;
	}
	
	public ObjectOutputStream getObjectOutputStream() {
		return oos;
	}
	
	public String getLogin() {
		return login;
	}
	
	public int getID() {
		return this.id;
	}

}
