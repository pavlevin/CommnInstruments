import java.net.InetSocketAddress;
import java.net.Proxy;
import java.security.Provider;

import javax.net.SocketFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLContextSpi;

import rocks.xmpp.addr.Jid;
import rocks.xmpp.core.XmppException;
import rocks.xmpp.core.sasl.AuthenticationException;
import rocks.xmpp.core.session.TcpConnectionConfiguration;
import rocks.xmpp.core.session.XmppClient;
import rocks.xmpp.core.stanza.model.Presence;
import rocks.xmpp.extensions.httpbind.BoshConnectionConfiguration;
import rocks.xmpp.im.roster.RosterManager;
import rocks.xmpp.core.stanza.model.Message;


public class BabblerRunner {
	
	static XmppClient xmppClient;
	static TcpConnectionConfiguration tcpConfiguration;
	static BoshConnectionConfiguration boshConfiguration;
	
	static String
		domain = "domain",
		username = "username",
		password = "password",
		resource = "resource",
		
		tcpHostname = "localhost",
		boshHostname = "hostname",
		boshInetSocketAddressHostname = "hostname";
	
	static Integer
		tcpPort = 5222,
		boshPort = 5280,
		boshInetSocketAddressPort = 3128;
	
	static SocketFactory socketFactory;
	
	// static Provider provider = new Provider("The Provider", 1, "test");		// TODO ???
	// static SSLContextSpi SslContextSpi = new SSLContextSpi();
	// static SSLContext sslContext = 
	
	static boolean doWeUseSSL = false;

	
	public static void main() {
				
		configureTcp();
		configureBosh();
		
		xmppClient = new XmppClient(domain, tcpConfiguration, boshConfiguration);
		
		setupListeners();
		
		connectToServer();
		login();
		
	}
	
	static void connectToServer() {
		try {
			xmppClient.connect();
		} catch (XmppException e) {
			// ...
		}
	}
	
	static void login() {
		try {
			xmppClient.login(username, password, resource);
		} catch (AuthenticationException e) {
			// Login failed, because the server returned a SASL failure, most likely due to wrong credentials.
		} catch (XmppException e) {
			// Other causes, e.g. no response, failure during resource binding, etc.
		}
	}
	
	static void sendMessage() {
		xmppClient.send(new Message(Jid.of("juliet@example.net"), Message.Type.CHAT));
	}
	
	static void changeAvailability() {
		xmppClient.send(new Presence(Presence.Show.AWAY));
	}
	
	static void closeSession() {
		try {
			xmppClient.close();
		} catch (XmppException e) {
			e.printStackTrace();
		}
	}
	
	static void configureTcp() {
		tcpConfiguration = TcpConnectionConfiguration.builder()
			    .hostname(tcpHostname)
			    .port(tcpPort)
			    .proxy(Proxy.NO_PROXY)        // Proxy for the TCP connection
			    .secure(doWeUseSSL)
			    .keepAliveInterval(20)        // Whitespace keep-alive interval
			    //.socketFactory(socketFactory) // Custom socket factory
			    .build();
		
		if (doWeUseSSL) {
			/*
			tcpConfiguration = TcpConnectionConfiguration.builder()
				.secure(true)          // Default value is true
				.sslContext(sslContext)
				.hostnameVerifier(hostnameVerifier)
				.build();
				     */
		}
	}
	
	static void configureBosh() {
		boshConfiguration = BoshConnectionConfiguration.builder()
			    .hostname(boshHostname)
			    .port(boshPort)
			    .proxy(new Proxy(Proxy.Type.HTTP,
			    		new InetSocketAddress(boshInetSocketAddressHostname, boshInetSocketAddressPort)))
			    // .file("/http-bind/")
			    .wait(60)  // BOSH connection manager should wait maximal 60 seconds before responding to a request.
			    .build();
	}
	
	static void setupListeners() {
		// Listen for presence changes
		xmppClient.addInboundPresenceListener(e -> {
			Presence presence = e.getPresence();
			// Handle inbound presence.
		});
			// Listen for messages
			xmppClient.addInboundMessageListener(e -> {
			rocks.xmpp.core.stanza.model.Message message = e.getMessage();
			// Handle inbound message.
		});
			// Listen for roster pushes
			xmppClient.getManager(RosterManager.class).addRosterListener(e -> {
			// Roster has changed
		});
	}
	
}
