/**
 * formats wallet address
 */
const formatAddress = (addr: string) =>
  addr.substr(0, 17) + "..." + addr.substring(38);
export default formatAddress;
