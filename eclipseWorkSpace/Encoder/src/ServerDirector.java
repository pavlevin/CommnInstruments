import java.io.IOException;
import java.net.Socket;
import java.util.concurrent.ConcurrentHashMap;


public class ServerDirector {

	Server server;
	ServerStorage storage;
	ServerContactProcessor contactProcessor;
	ServerMessageProcessor messageProcessor;
	
	public ServerDirector(Server s) {
		server = s;
		storage = new ServerStorage(this);
		contactProcessor = new ServerContactProcessor(this);
		messageProcessor = new ServerMessageProcessor(this);
	}
	
	public void manageNewContact(Socket socket) {
		storage.storeNewContact(socket);
		Contact newContact = getContactOnSocket(socket);
		contactProcessor.manage(newContact);
	}
	
	public void manageNew(Message message) {
		storage.store(message);
		messageProcessor.process(message);
	}
	
	public void closeSocketAndForget(Contact contact) {
		closeIgnoringException(contact.getSocket());
		removeFromStorage(contact);
	}
	
	public Contact getContactOnSocket(Socket s) {
		try {
			return storage.getContactOnSocket(s);
		} catch (ContactNotFoundException cnfe) {
			cnfe.printStackTrace();
			return null;
		}
	}
	
	public Contact getContact(int id) {
		try {
			return storage.extractContact(id);
		} catch (ContactNotFoundException cnfe) {
			cnfe.printStackTrace();
			return null;
		}
	}
	
	public void askToSend(Message message) {
		server.attemptToSend(message);
	}
	
	public void askToGetMessageFrom(Contact contact) {
		server.attemptToGetMessageFrom(contact);
	}
	
	public void removeFromStorage(Contact contact) {
		storage.remove(contact);
	}
	
	public void syncContacts(ConcurrentHashMap<Integer, Contact> contacts) {
		// There are no listeners to notify now
	}

	public void syncMessages(ConcurrentHashMap<Integer, Message> messages) {
		// There are no listeners to notify now
	}
	
	public synchronized ConcurrentHashMap<Integer, Contact> getAllContacts() {
		return storage.getAllContacts();
	}
	
	public synchronized ConcurrentHashMap<Integer, Message> getAllMessages() {
		return storage.getAllMessages();
	}
	
	public void clientQuits(int id) {
		contactProcessor.clientQuits(getContact(id));
	}
	
	public void setStatusOnline(int id) {
		storage.setStatusOnline(id);
	}
	
	public void setStatusOffline(int id) {
		storage.setStatusOffline(id);
	}
	
	public void notifyContactGotID(int id) {
		commandReply(id, "You've got an ID.");
	}
	
	public void pingReply(int id) {
		commandReply(id, "Ping answer from server");
	}
	
	void commandReply(int id, String text) {
		server.attemptToSend(new Message(0, id, text));
	}
	
	public boolean isOnline(int id) {
		Contact c = getContact(id);
		if (c != null && !c.equals(null))
			return c.isOnline();
		return false;
	}
	
	public void closeIgnoringException(Socket socket) {
		if (socket != null && !socket.equals(null)) {
			try {
				socket.close();
			} catch (IOException ignore) {
			}
		}
	}
	
}
