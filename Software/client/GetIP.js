import os from 'os';

// Function to fetch the host IP address
function getHostIP() {
  const interfaces = os.networkInterfaces();
  // Loop through the network interfaces
  for (const interfaceName of Object.keys(interfaces)) {
    const iface = interfaces[interfaceName];
    // Filter out internal (non-Internet) IP addresses and IPv6 addresses
    const usableInterfaces = iface.filter(({ internal, family }) => !internal && family === 'IPv4');
    // If there are usable interfaces, return the first one
    if (usableInterfaces.length > 0) {
      return usableInterfaces[0].address;
    }
  }
  // If no usable interface is found, return localhost
  return 'localhost';
}

// Fetch the host IP address
export const hostIP = getHostIP();
