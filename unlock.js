const data_file = 'scan_data.txt'
const portTools = ['BruteSSH.exe', 'FTPCrack.exe', 'HTTPWorm.exe', 'relaySMTP.exe', 'SQLInject.exe']

/** @param {NS} ns **/
function isBruteSSHAvailable(ns) {
	return ns.fileExists('BruteSSH.exe') ? 1 : 0
}

/** @param {NS} ns **/
function isFTPCrackAvailable(ns) {
	return ns.fileExists('FTPCrack.exe') ? 1 : 0
}

/** @param {NS} ns **/
function isHTTPWormAvailable(ns) {
	return ns.fileExists('HTTPWorm.exe') ? 1 : 0
}

/** @param {NS} ns **/
function isRelaySMTPAvailable(ns) {
	return ns.fileExists('relaySMTP.exe') ? 1 : 0
}

/** @param {NS} ns **/
function isSQLInjectAvailable(ns) {
	return ns.fileExists('SQLInject.exe') ? 1 : 0
}

/** @param {NS} ns **/
function unlockHost(ns, hostData) {

	if (hostData.rootAccess) {
		ns.tprint(`Host ${hostData.hostname} already unlocked.`)
		return
	}

	// run all the port tools that we have against the target host
	if (isBruteSSHAvailable(ns)) {
		ns.brutessh(hostData.hostname)
	}
	if (isFTPCrackAvailable(ns)) {
		ns.ftpcrack(hostData.hostname)
	}
	if (isHTTPWormAvailable(ns)) {
		ns.httpworm(hostData.hostname)
	}
	if (isRelaySMTPAvailable(ns)) {
		ns.relaysmtp(hostData.hostname)
	}
	if (isSQLInjectAvailable(ns)) {
		ns.sqlinject(hostData.hostname)
	}

	// nuke the host to gain access
	ns.nuke(hostData.hostname)

	// check if we now have to root access
	if (!hostData.rootAccess) {
		ns.tprint(`Unable to unlock host ${hostData.hostname}.`)
		return
	}

	ns.tprint(`Host ${hostData.hostname} successfully unlocked.`)

}

/** @param {NS} ns **/
export async function main(ns) {
	let networkScanData = JSON.parse(await ns.read(data_file))
	let hackingLevel = ns.getHackingLevel()
	let numPortTools = portTools.reduce((pV, cV) => {
		return pV + (ns.fileExists(cV) ? 1 : 0)
	}, 0)

	ns.tprint(`Number of tools available: ${numPortTools}`)

	let eligibleHosts = networkScanData.filter(hostData => {
		return hackingLevel >= hostData.level && numPortTools >= hostData.ports
	})

	eligibleHosts.forEach(hostData => {
		unlockHost(ns, hostData)
	})
}