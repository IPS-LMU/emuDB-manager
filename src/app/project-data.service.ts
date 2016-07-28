import {Injectable} from '@angular/core';
import {ProjectInfo} from "./types/project-info";
import {DatabaseInfo} from "./types/database-info";
import {bundleListMaxMustermann} from "./max.mustermann_bundleList";
import {BundleList} from "./types/bundle-list";

@Injectable()
export class ProjectDataService {
  private info:ProjectInfo = {
    name: "Typologie der Vokal- und Konsonantenquantitäten (DACH)",
    databases: [{
      name: "corpus1",
      dbConfig: {},
      bundleLists: [{
        name: "kleber",
        status: "",
        items: []
      }, {
        name: "leah.meyer",
        status: "",
        items: []
      }],
      sessions: []
    }, {
      name: "corpus2",
      dbConfig: {},
      bundleLists: [{
        name: "sepp.wurzel",
        status: "",
        items: []
      }],
      sessions: [{
        name: "lalala",
        bundles: [
          "a",
          "b",
          "c"
        ]
      }, {
        name: "bebebe",
        bundles: [
          "a",
          "b",
          "c"
        ]
      }]
    }, {
      name: "blahDB-1",
      dbConfig: {},
      bundleLists: [{
        name: "sylvia.moosmueller",
        status: "",
        items: []
      }, {
        name: "sepp.wurzel",
        status: "",
        items: []
      }]
      ,
      sessions: []
    }
    ],
    uploads: []
  };

  constructor() {
    for (let i=0; i<120; ++i) {
      this.info.databases[0].sessions.push({
        name: i.toString(),
        bundles: []
      });
      this.info.databases[0].sessions[i].bundles = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h"
      ]
    }

    this.info.databases[0].bundleLists.push(bundleListMaxMustermann);
  }

  public getAllDatabases():DatabaseInfo[] {
    return this.info.databases;
  }

  public getAllBundleLists():BundleList[] {
    var result:BundleList[] = [];
    for (let i=0; i<this.info.databases.length; ++i) {
      result = result.concat(this.info.databases[i].bundleLists);
    }
    return result;
  }

  /**
   * Returns the info object for a single database
   *
   * @param name The name of the database in question
   * @returns A DatabaseInfo object if the DB exists, otherwise null
   */
  public getDatabase(name:string):DatabaseInfo {
    for (let i = 0; i < this.info.databases.length; ++i) {
      if (this.info.databases[i].name === name) {
        return this.info.databases[i];
      }
    }

    return null;
  }

  public getName():string {
    return this.info.name;
  }

}
