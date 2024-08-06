import component from './TileInfo';
import { withDrizzle } from "../../withDrizzle";

const mapStateToProps = () => ({
  isMetamaskEnabled: Boolean(window.web3)
});

export default withDrizzle(mapStateToProps)(component);
