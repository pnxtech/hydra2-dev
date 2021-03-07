import net from 'net';
import dns from 'dns';
import os from 'os';

export default class Network {
  /**
   * @name hostName
   * @description hostname acccessor
   * @returns hostname
   */
  static get hostName(): string {
    return os.hostname();
  }

  /**
   * @name isIP
   * @param ipAddress {string} ip address
   * @returns {boolean} true of ip else false
   */
  static isIP(ipAddress:string): boolean {
    return (net.isIP(ipAddress)) ? true : false;
  }

  /**
   * @name ipFromDNS
   * @param dnsName {string} - DNS name to resolve
   * @returns Promise
   */
  static ipFromDNS(dnsName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      dns.lookup(dnsName, (err, result) => {
        if (err) {
          reject();
        } else {
          resolve(result);
        }        
      });
    });
  }

  /**
   * @name ipFromInterfaceNameMask
   * @description searches for an ip address based on interface name and mask. 
   * The expected format is a forward slash seperated name and mask pair.
   * Example: en0/255.255.255.0
   * @param interfaceNameMask {string} - an interface name and mask
   * @returns {string} ipaddress
   */
  static ipFromInterfaceNameMask(interfaceNameMask: string): string {
    let interfaces: any = os.networkInterfaces();
    let ipAddress: string = '';
    let segments = interfaceNameMask.split('/');
    if (segments && segments.length === 2) {
      let interfaceName = segments[0];
      let interfaceMask = segments[1];
      Object.keys(interfaces).
        forEach((itf) => {
          interfaces[itf].forEach((interfaceRecord: any)=>{
            if (itf === interfaceName && interfaceRecord.netmask === interfaceMask && interfaceRecord.family === 'IPv4') {
              ipAddress = interfaceRecord.address;
            }
          });
        });
    } else {
      throw new Error('interfaceNameMask is not a valid format');
    }
    return ipAddress;  
  }

  /**
   * @name ipBestGuess
   * @description attempts to find the machines IP Address using a best guess
   * @returns {string | undefined} ipAddress
   */
  static ipBestGuess(): string | undefined {
    let interfaces: any = os.networkInterfaces();
    let ipAddress: string | undefined;
    ipAddress = undefined;
    Object.keys(interfaces).
      forEach((itf) => {
        interfaces[itf].forEach((interfaceRecord: any)=>{
          if (!ipAddress && 
              interfaceRecord.family === 'IPv4' && 
              interfaceRecord.address.startsWith('127.') === false && 
              interfaceRecord.mac !== '00:00:00:00:00:00') {
            ipAddress = interfaceRecord.address;
          }
        });
      });
    return ipAddress;
  }
}

