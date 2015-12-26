// import org.w3c.dom.Entity;


public interface GenericDao <T> {
    
    /** ��������� ������ newInstance � ���� ������ */
    void store(T newInstance);

    /** ������� ������, �������������� ����������� � ���� ������, ���������
     *   ��������� id � �������� ���������� �����
     */
    // public T extract(Integer id);

    /** ��������� ���������, ��������� � �������.  */
    void update(T transientObject);

    /** ������� ������ �� ���� ������ */
    void remove(T persistentObject);
    
}