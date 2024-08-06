import { withDrizzle } from "../withDrizzle";
import component from './MapArea';

const mapStateToProps = (state) => ({
  transactions: state.transactions
});

export default withDrizzle(mapStateToProps)(component);
