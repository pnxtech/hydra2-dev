import {EventEmitter} from 'events';
import Cache from './cache';
import Network from './network';

interface IHydraHash {
  [name: string]: any
};


export default class Hydra2 extends EventEmitter {
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

  private instanceID:string = this.INSTANCE_ID_NOT_SET;
  private mcMessageChannelClient: string = '';
  private mcDirectMessageChannelClient: string = '';
  private messageChannelPool:IHydraHash = {};
  private config: any = null;
  private serviceName: string = '';
  private serviceDescription: string = '';
  private serviceVersion: string = '';
  private isService: boolean = false;

  private redisdb = null;
  private registeredRoutes: Array<string> = [];
  private registeredPlugins: Array<string> = [];
  private presenceTimerInteval = null;
  private healthTimerInterval:any = null;
  private initialized: boolean = false;
  private hostName: string;
  private internalCache: Cache;

  constructor() {
    super();
    this.updatePresence = this.updatePresence.bind(this);
    this.updateHealthCheck = this.updateHealthCheck.bind(this);
    this.hostName = Network.hostName;
    this.internalCache = new Cache();
  }

  public async init(config: IHydraHash) {
    this.config = config.hydra;
    console.log(this.config);

    // const ip:string = await Network.ipFromDNS('pnxtech.duckdns.org');
    // const ip:string = Network.ipFromInterfaceNameMask('en0/255.255.255.0')
    const ip:string | undefined = Network.ipBestGuess();
    if (ip) {
      console.log(`ip: ${ip}`);
    }

    this.determineIPAddress();
  }

  private updatePresence() {

  }

  private updateHealthCheck() {

  }

  /**
   * @name determineIPAddress
   * @description parse this.config to determine machine's IP address
   * @return {void}
   */
  private async determineIPAddress() {
    if (this.config.serviceDNS && this.config.serviceDNS !== '') {
      this.config.serviceIP = this.config.serviceDNS;
    } else {
      if (this.config.serviceIP && this.config.serviceIP !== '' && Network.isIP(this.config.serviceIP) === false) {
        this.config.serviceIP = await Network.ipFromDNS(this.config.serviceIP);
      } else if (!this.config.serviceIP || this.config.serviceIP === '') {
        this.config.serviceIP = Network.ipFromInterfaceNameMask(this.config.serviceInterface);
      } else {
        // not using serviceInterface - try best guess
        this.config.serviceIP = Network.ipBestGuess();
      }
    }    
  }
}
