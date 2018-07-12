import {Injectable} from "@angular/core";
import {appConfig} from "./app.config";
import * as Keycloak from "keycloak-js";

@Injectable()
export class KeycloakService {
    private keycloakInstance;

    constructor() {
        this.keycloakInstance = Keycloak({
            clientId: appConfig.openIdConnect.clientId,
            oidcProvider: appConfig.openIdConnect.providerUrl
        });
    }

    public getInstance() {
        return this.keycloakInstance;
    }

    public init () {
        return this.keycloakInstance.init({
            onLoad: 'login-required',
            flow: 'implicit',
            checkLoginIframe: false
        });
    }
}
