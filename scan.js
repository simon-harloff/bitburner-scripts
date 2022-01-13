const data_file = 'scan_data.txt'
const sleep_time = 10000
const server_prefix = 'srv-'

/** @param {NS} ns **/
async function scanNetwork(ns) {
	let rootHostQueue = ns.scan().filter(host => host.indexOf(server_prefix) === -1)
	let scanResult = rootHostQueue.flatMap(rootHost => {
		return scanHost(ns, rootHost, [ns.getHostname()])
	})

	await ns.write(data_file, JSON.stringify(scanResult), 'w')
	let timestamp = ns.tFormat(Date.now())
	ns.print(`[${timestamp}] Network scan completed. ${scanResult.length} hosts found. Data saved to '${data_file}'.`)
}

/** @param {NS} ns **/
function scanHost(ns, host, parents) {

	let connectedHosts = ns.scan(host).filter(host => !['home', ...parents].includes(host))
	let scanResult = {
		hostname: host,
		path: parents,
		rootAccess: ns.hasRootAccess(host),
		ports: ns.getServerNumPortsRequired(host),
		level: ns.getServerRequiredHackingLevel(host),
		money: ns.getServerMoneyAvailable(host),
		security: ns.getServerSecurityLevel(host),
		hackTime: ns.getHackTime(host),
		hackChance: ns.hackAnalyzeChance(host)
	}

	// add derived fields
	scanResult['hackEfficiency'] = (scanResult['money'] / scanResult['hackTime']) * scanResult['hackChance']
	scanResult['hackInverseEfficiency'] = (scanResult['money'] / scanResult['hackTime']) * (1 - scanResult['hackChance'])

	if (connectedHosts.length === 0) {
		return [scanResult]
	}

	return [
		scanResult,
		...connectedHosts.flatMap(connectedHost => {
			return scanHost(ns, connectedHost, [...parents, host])
		})
	]
	
}

/** @param {NS} ns **/
export async function main(ns) {
	while (true) {
		await scanNetwork(ns)
		await ns.sleep(sleep_time)
	}
}