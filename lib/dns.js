const dns = require('dns');

try {
  // Set preferred DNS servers (Google public DNS)
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // ignore if not available in this environment
}

module.exports = dns;
