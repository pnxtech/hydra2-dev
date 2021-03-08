/*
    __  __          __          ___ 
   / / / /_  ______/ /___ _____|__ \
  / /_/ / / / / __  / __ `/ ___/_/ /
 / __  / /_/ / /_/ / /_/ / /  / __/ 
/_/ /_/\__, /\__,_/\__,_/_/  /____/ 
      /____/                   
 Hydra2 is a rewrite of Hydra for NodeJS.      
*/

import {EventEmitter} from 'events';
import Cache from './cache';
import Network from './network';
import Utils from './utils';

interface IHydraHash {
  [name: string]: any
};

export default class Hydra2 extends EventEmitter {
  //#region internal constants
  private HYDRA_REDIS_DB = 0;
  private redisPreKey = 'hydra:service';
  private mcMessageKey = 'hydra:service:mc';
  private MAX_ENTRIES_IN_HEALTH_LOG = 64;
  private ONE_SECOND = 1000; // milliseconds
  private ONE_WEEK_IN_SECONDS = 604800;
  private PRESENCE_UPDATE_INTERVAL = this.ONE_SECOND;
  private HEALTH_UPDATE_INTERVAL = this.ONE_SECOND * 5;
  private KEY_EXPIRATION_TTL = this.ONE_SECOND * 3;
  private KEYS_PER_SCAN = '100';
  private UMF_INVALID_MESSAGE = 'UMF message requires "to", "from" and "body" fields';
  private INSTANCE_ID_NOT_SET = 'not set';  
  //#endregion

  //#region class vars
  private static instance: Hydra2 | undefined;
  private instanceID:string = this.INSTANCE_ID_NOT_SET;
  private mcMessageChannelClient: string = '';
  private mcDirectMessageChannelClient: string = '';
  private messageChannelPool:IHydraHash = {};
  private config: IHydraHash | undefined;
  private serviceName: string = '';
  private serviceDescription: string = '';
  private serviceVersion: string = '';
  private isService: boolean = false;

  private redisdb = null;
  private registeredRoutes: Array<string> = [];
  private registeredPlugins: Array<string> = [];
  private presenceTimerInteval:any = null;
  private healthTimerInterval:any = null;
  private initialized: boolean = false;
  private hostName: string;
  private internalCache: Cache;
  //#endregion

  /**
   * @name constructor
   * @description private constructor because Hydra2 implements the sington design pattern
   */
  private constructor() {
    super();
    this.updatePresence = this.updatePresence.bind(this);
    this.updateHealthCheck = this.updateHealthCheck.bind(this);
    this.hostName = Network.hostName;
    this.internalCache = new Cache();
  }

/* ============================================================================
              __   ___    
   ___  __ __/ /  / (_)___
  / _ \/ // / _ \/ / / __/
 / .__/\_,_/_.__/_/_/\__/ 
/_/  

Public members - these are the member intended for application use

┌──────────────┬───────────────────────────────────────────────────────────┐
│ MEMBER       │ USAGE                                                     │
├──────────────┼───────────────────────────────────────────────────────────┤
│ getInstance  │ returns an instance of a single Hydra2 object             │
│ init         │ Hydra initialization method with config object            │
└──────────────┴───────────────────────────────────────────────────────────┘
============================================================================ */

  /**
   * @name getInstance
   * @description returns an instance of a single Hydra2 object
   * @returns {Hydar2} Hydra2 instance
   */
  static getInstance(): Hydra2 {
    if (!Hydra2.instance) {
      Hydra2.instance = new Hydra2();
    }
    return Hydra2.instance;
  }

  /**
   * @name init
   * @description Hydra initialization method
   * @param config {IHydraHash} config.json file contents
   * @todo does this need to return a promise?
   * @returns void
   */
  public async init(config: IHydraHash) {
    this.config = config.hydra;
    console.log(this.config);
    this.determineIPAddress();
    this.registerService();
  }

/* ============================================================================
             _           __     
   ___  ____(_)  _____ _/ /____ 
  / _ \/ __/ / |/ / _ `/ __/ -_)
 / .__/_/ /_/|___/\_,_/\__/\__/ 
/_/                             

 Private members - for internal use only
============================================================================ */

  /**
   * @name updatePresence
   * @description Update redis with presence info.
   * Called every PRESENCE_UPDATE_INTERVAL seconds.
   * @returns void
   */
  private updatePresence(): void {
    console.log('updatePresence');
  }

  /**
   * @name updatePresence
   * @description Update redis with health info.
   * Called one every HEALTH_UPDATE_INTERVAL seconds.
   * @returns void
   */
   private updateHealthCheck(): void {
    console.log('updateHealthCheck');
  }

  /**
   * @name registerService
   * @description registers the current process as a service
   * @returns void
   */
  private registerService(): void {
    this.presenceTimerInteval = setInterval(this.updatePresence, this.PRESENCE_UPDATE_INTERVAL);
    this.healthTimerInterval = setInterval(this.updateHealthCheck, this.HEALTH_UPDATE_INTERVAL);    
  }

  /**
   * @name determineIPAddress
   * @description parse this.config to determine machine's IP address
   * @return {void}
   */
  private async determineIPAddress() {
    if (!this.config) {
      throw new Error('hydra config file is invalid');
    }
    if (this.config.serviceDNS && this.config.serviceDNS !== '') {
      this.config.serviceIP = this.config.serviceDNS;
    } else {
      if (this.config.serviceIP && this.config.serviceIP !== '' && Network.isIP(this.config.serviceIP) === false) {
        this.config.serviceIP = await Network.ipFromDNS(this.config.serviceIP);
      } else if (!this.config.serviceIP || this.config.serviceIP === '') {
        if (this.config.serviceInterface && this.config.serviceInterface !== '') {
          this.config.serviceIP = Network.ipFromInterfaceNameMask(this.config.serviceInterface);
        } else {
          // not using serviceInterface - try best guess
          this.config.serviceIP = Network.ipBestGuess();
        }       
      }
    }    
  }
}
