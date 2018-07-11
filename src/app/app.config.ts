export const appConfig = {
	enableLoginForm: false,
	openIdConnect: {
		enabled: true,
		providerUrl: 'https://www.phonetik.uni-muenchen.de/apps/login-app/',
		clientId: 'emudb-manager'
	},
	urls: {
		emuWebApp: 'https://ips-lmu.github.io/EMU-webApp/',
		externalLoginApp: 'https://www.phonetik.uni-muenchen.de/apps/login-app/',
		managerAPIBackend: 'https://www.phonetik.uni-muenchen.de/apps/emuDB-manager/server-side/emudb-manager.php',
		nodeJSServer: 'wss://webapp2.phonetik.uni-muenchen.de:17890/manager'
	}
};
