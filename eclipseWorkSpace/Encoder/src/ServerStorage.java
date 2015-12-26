import java.net.Socket;
import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;


public class ServerStorage
implements MessageStates, ContactDao, MessageDao {
	
	ServerDirector director;
	
	private volatile ConcurrentHashMap<Integer, Contact> contacts =
			new ConcurrentHashMap<Integer, Contact>();
	private volatile ConcurrentHashMap<Integer, Message> messages =
			new ConcurrentHashMap<Integer, Message>();
	
	public ServerStorage(ServerDirector sd) {
		director = sd;
	}
	
	public synchronized ConcurrentHashMap<Integer, Contact> getAllContacts() {
		return contacts;
	}
	
	public synchronized ConcurrentHashMap<Integer, Message> getAllMessages() {
		return messages;
	}
	
	public synchronized void storeNewContact(Socket socket) {
		int newID = contacts.size() + 1;
		store(new Contact(newID, socket));
	}
	
	public synchronized void store(Contact contact) {
		update(contact);
	}
	
	public synchronized void store(Message message) {
		update(message);
	}
	
	public synchronized void update(Contact contact) {
		contacts.put(contact.getID(), contact);
		notifyContactsChanged();
	}
	
	public synchronized void update(Message message) {
		messages.put(message.getMessageID(), message);
		notifyMessagesChanged();
	}
	
	public synchronized void remove(Contact contact) {
		contacts.remove(contact.getID());
		notifyContactsChanged();
	}
	
	public synchronized void remove(Message message) {
		messages.remove(message.getMessageID());
		notifyMessagesChanged();
	}
	
	void notifyContactsChanged() {
		director.syncContacts(contacts);
	}
	
	void notifyMessagesChanged() {
		director.syncMessages(messages);
	}
	
	public synchronized void setStatusOnline(int id) {
		Contact contact = contacts.get(id);
		contact.setStatusOnline();
		update(contact);
	}

	public synchronized void setStatusOffline(int id) {
		Contact contact = contacts.get(id);
		contact.setStatusOffline();
		update(contact);
	}
	
	public synchronized Contact getContactOnSocket(Socket s)
	throws ContactNotFoundException {
		Iterator<Integer> i = contacts.keySet().iterator();
		while (i.hasNext()) {
			Contact contact = contacts.get(i.next());
			if (contact.getSocket() == s)
				return contact;
		}
		throw new ContactNotFoundException("No contact on requested socket.");
	}
	
	public synchronized Contact extractContact(int id)
	throws ContactNotFoundException {
		if (contacts.containsKey(id))
			return contacts.get(id);
		else
			throw new ContactNotFoundException("No such ID: " + id);
	}
	
	public boolean isUsed(Integer id) {
		return contacts.containsKey(id);
	}
	
}
