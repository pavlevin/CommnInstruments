import java.lang.reflect.Field;

class DBUser implements GetSetFields {
	private int privInt;
	private String privStr;
	protected String serviceName;
	protected String login;
	protected String password;
	DBUser(String login, String password){
		this.login = login;
		this.password=password;
	}

}

class UnixUser implements GetSetFields{
	protected String identityFile;
	protected String login;
	protected String password;
	UnixUser(String login, String password){
		this.login = login;
		this.password=password;
	}

}

class InformaticaUser {
	
}




interface GetSetFields{
	default void setFieldValue(String field,String value){
		java.lang.reflect.Field nme;
		try {
			nme = this.getClass().getDeclaredField(field);
			nme.set(this, value);
		} catch (NoSuchFieldException e) {
			listOfAvailableFields(this.getClass());
			System.err.println("Field " + field + " was not found.");
		} catch (SecurityException e) {
			System.err.println("Access to the field " + field + " is denied.");
		} catch (IllegalArgumentException e) {
			
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			
			e.printStackTrace();
		}

	}
	default Object getFieldValue(String field){
		java.lang.reflect.Field nme;
		try {
			nme = this.getClass().getDeclaredField(field);	
			return nme.get(this);
		} catch (NoSuchFieldException e) {
			listOfAvailableFields(this.getClass());
			System.err.println("Field " + field + " was not found.");
		} catch (SecurityException e) {
			System.err.println("Access to the field " + field + " is denied.");
		} catch (IllegalArgumentException e) {
			
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			
			e.printStackTrace();
		}
		return null;
	}
	static void listOfAvailableFields(Class<?> someClass){
		Field[] list = someClass.getDeclaredFields();
		for(Field field : list)
			System.out.println(field.getName());
		
	}
}



