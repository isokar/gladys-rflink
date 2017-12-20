# Gladys RFLink

Gladys hooks which connect to your RFLink thru a USB serial port in order to control and receive datas from radio devices.

Need Gladys version >= 3.0.0.

## Installation

From your Gladys interface, go to the « Modules » view, then clic on the « Advanced » tab.

|===
| Name | Version | Depot | Slug | |
RFLink | 0.0.2 | https://github.com/isokar/gladys-rflink | rflink | Install
|===

**Click on install**

- Flash your Arduino with RFLink [firmware](http://www.rflink.nl/blog2/download).
- Connect your arduino in USB to your Raspberry Pi
- Reboot Gladys
- Click on the "config" button of the "RFLink" module in the "Modules" view. 
- Simply receive datas from your device(or it's remote) to create the appropriate device and deviceType(s).
- To create your device manually, you can copy/paste and adapt the following script:
"gladys.modules.rflink.create('20;01;MiLightv1;ID=F746;SWITCH=00;RGBW=3c1d;CMD=ON;');"
- Just change The protocol, the ID, SWITCH N° and CMD.

## Infos

bugs and incompatibilities might be found.
Please report if you find any.

## Credits

Module made by [isokar](https://community.gladysproject.com/u/isokar/summary).
