import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;


public abstract class ButtonListener implements ActionListener {
	
	JButton button;
	
	abstract public void actionPerformed(ActionEvent event);
	
}
