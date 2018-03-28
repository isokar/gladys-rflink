# Gladys RFLink

Gladys hooks which connect to your RFLink thru an Arduino connected to USB serial in order to control and receive datas from radio devices.

Need Gladys version >= 3.0.0.

## Installation

From your Gladys interface, go to the « Modules » view, then clic on the « Advanced » tab.


| Name | Version | Depot | Slug |

|RFLink | 0.1.0 | https://github.com/isokar/gladys-rflink | rflink | Install


**Click on install**

- Flash your Arduino with RFLink [firmware](http://www.rflink.nl/blog2/download)(Tested with R48).
- Connect your arduino in USB to your Raspberry Pi
- Reboot Gladys
- To create your device manually, you can copy/paste and adapt the following script:
"gladys.modules.rflink.create('20;01;MiLightv1;ID=F746;SWITCH=00;RGBW=3c1d;CMD=ON;');"
- Just change The protocol, the ID, SWITCH N° and CMD.

You might need to change the serial port used(for exemple if you have multiple arduinos connected). Just click on "SETUP". the list of connected arduinos will show on console. Just copy/paste the right one to "RFLink_tty" parameters.

To import device you can do it manually or with auto-detect function. Just click on "SETUP". RFLink will be on auto-detect for 5 minutes. during this time, all detected devices will be added to your devices.

## Infos

bugs and incompatibilities might be found.
Please report if you find any.

## Credits

Module made by [isokar](https://community.gladysproject.com/u/isokar/summary).
