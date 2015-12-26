
public interface MessageDao {

	public void store(Message newInstance);

    // public Message extract(Integer id);

    void update(Message transientContact);

    void remove(Message persistentContact);
	
}
