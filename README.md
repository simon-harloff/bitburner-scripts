# bitburner-scripts

A collection of scripts that I use when playing [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/).

### scan.js
**Descritpion:** Performs a complete scan of ALL hosts and produces a JSON file of containing the scan data. This JSON file can  subsequently be used by any hacking, weaking, growing scripts to determine what hosts to target. Scan data is refreshed every 10 seconds.
Note: This script will discover ALL hosts regardless of hacking level and what `DeepscanVX.exe` programs are available.
**Use from:** home
**Runs:** Continuously, every 10 seconds
**Output files:** scan_data.txt (JSON file)
**Input files:** n/a
**JSON file structure:** Array of host entries.
Each host entry element is a JSON object with the following structure:
|Property|Type|Description|Example|
|-|-|-|-|
|hostname|String|Name of the host.|n00dles|
|path|String[]|The network path that connects `home` to the target host.|["home","n00dles","zer0"]|
|rootAccess|Boolean|Whether root access is available.|true|
|ports|Number|Number of open ports needed to run `NUKE.exe`|1|
|level|Number|Hacking level required.|20|
|money|Number|Amount of money available to on the target host|2100000|
|security|Number|Security level of the target host|20|
|hackTime|Number|Amount of time (ms) required to execute `hack()` on the target host.|60000|
|hackChance|Number|Chance of successfully executing `hack()` against the target host.|0.42|
|hackEfficiency|Computed Number|Formula: `(money / hackTime) * hackChance`. Calculates the efficiency of running `hack()` against the target host by taking into account money available, time to execute hack and the current hack chance. The higher the number the more attractive the target host is for hacking.|0.041|
|hackInverseEfficiency|Computed Number|Formula: `(money / hackTime) * (1 - hackChance)`. Calculates the inverse of `hackEfficiency`. The higher the number the higher the priority should be for executing `weaken()` against the target host.|0.42|

### unlock.js
**Descritpion:** Enables root access on all eligible hosts. Takes into account current hacking level and port opening tools currently available (i.e. `BruteSSH.exe`).
**Use from:** home
**Runs:** Once, when executed from terminal
**Output files:** n/a
**Input files:** scan_data.txt