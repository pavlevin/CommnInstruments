/*
This file is part of Telegram Desktop,
the official desktop version of Telegram messaging app, see https://telegram.org

Telegram Desktop is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

It is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

In addition, as a special exception, the copyright holders give permission
to link the code of portions of this program with the OpenSSL library.

Full license: https://github.com/telegramdesktop/tdesktop/blob/master/LICENSE
Copyright (c) 2014-2015 John Preston, https://desktop.telegram.org
*/
#pragma once

#include <QtNetwork/QLocalSocket>
#include <QtNetwork/QLocalServer>
#include <QtNetwork/QNetworkReply>

#include "window.h"
#include "pspecific.h"

class MainWidget;
class FileUploader;
class Translator;
class UpdateDownloader;

class Application : public PsApplication, public RPCSender {
	Q_OBJECT

public:

	Application(int &argc, char **argv);
	~Application();
	
	static Application *app();
	static Window *wnd();
	static QString language();
	static int32 languageId();
	static MainWidget *main();

	enum UpdatingState {
		UpdatingNone,
		UpdatingDownload,
		UpdatingReady,
	};
	UpdatingState updatingState();
	#ifndef TDESKTOP_DISABLE_AUTOUPDATE
	int32 updatingSize();
	int32 updatingReady();
	#endif

	FileUploader *uploader();
	void uploadProfilePhoto(const QImage &tosend, const PeerId &peerId);
	void regPhotoUpdate(const PeerId &peer, const FullMsgId &msgId);
	void clearPhotoUpdates();
	bool isPhotoUpdating(const PeerId &peer);
	void cancelPhotoUpdate(const PeerId &peer);

	void stopUpdate();

	void selfPhotoCleared(const MTPUserProfilePhoto &result);
	void chatPhotoCleared(PeerId peer, const MTPUpdates &updates);
	void selfPhotoDone(const MTPphotos_Photo &result);
	void chatPhotoDone(PeerId peerId, const MTPUpdates &updates);
	bool peerPhotoFail(PeerId peerId, const RPCError &e);
	void peerClearPhoto(PeerId peer);

	void writeUserConfigIn(uint64 ms);

	void killDownloadSessionsStart(int32 dc);
	void killDownloadSessionsStop(int32 dc);

	void checkLocalTime();
	void checkMapVersion();

signals:

	#ifndef TDESKTOP_DISABLE_AUTOUPDATE
	void updateChecking();
	void updateLatest();
	void updateDownloading(qint64 ready, qint64 total);
	void updateReady();
	void updateFailed();
	#endif

	void peerPhotoDone(PeerId peer);
	void peerPhotoFail(PeerId peer);

	void adjustSingleTimers();

public slots:

	#ifndef TDESKTOP_DISABLE_AUTOUPDATE
	void startUpdateCheck(bool forceWait = false);
	#endif
	void socketConnected();
	void socketError(QLocalSocket::LocalSocketError e);
	void socketDisconnected();
	void socketWritten(qint64 bytes);
	void socketReading();
	void newInstanceConnected();
	void closeApplication();

	void readClients();
	void removeClients();

	#ifndef TDESKTOP_DISABLE_AUTOUPDATE
	void updateGotCurrent();
	void updateFailedCurrent(QNetworkReply::NetworkError e);

	void onUpdateReady();
	void onUpdateFailed();
	#endif

	void photoUpdated(const FullMsgId &msgId, const MTPInputFile &file);

	void onSwitchDebugMode();
	void onSwitchTestMode();

	void killDownloadSessions();
	void onAppStateChanged(Qt::ApplicationState state);

private:

	QMap<FullMsgId, PeerId> photoUpdates;

	QMap<int32, uint64> killDownloadSessionTimes;
	SingleTimer killDownloadSessionsTimer;

	void startApp();

	typedef QPair<QLocalSocket*, QByteArray> ClientSocket;
	typedef QVector<ClientSocket> ClientSockets;

	QString serverName;
	QLocalSocket socket;
	QString socketRead;
	QLocalServer server;
	ClientSockets clients;
	bool closing;

	uint64 lastActionTime;

	void execExternal(const QString &cmd);

	Window *window;

	#ifndef TDESKTOP_DISABLE_AUTOUPDATE
	mtpRequestId updateRequestId;
	QNetworkAccessManager updateManager;
	QNetworkReply *updateReply;
	SingleTimer updateCheckTimer;
	QThread *updateThread;
	UpdateDownloader *updateDownloader;
	#endif

	QTimer writeUserConfigTimer;

	Translator *_translator;

};
