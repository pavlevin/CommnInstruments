
public interface ContactDao {

    public void store(Contact newInstance);

    // public Contact extract(Integer id);

    void update(Contact transientContact);

    void remove(Contact persistentContact);
	
}
