// import org.w3c.dom.Entity;


public interface GenericDao <T> {
    
    /** —охранить объект newInstance в базе данных */
    void store(T newInstance);

    /** »звлечь объект, предварительно сохраненный в базе данных, использу€
     *   указанный id в качестве первичного ключа
     */
    // public T extract(Integer id);

    /** —охранить изменени€, сделанные в объекте.  */
    void update(T transientObject);

    /** ”далить объект из базы данных */
    void remove(T persistentObject);
    
}