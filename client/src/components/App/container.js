import {withRouter} from "react-router-dom";
import component from './App';
import {withDrizzle} from "../withDrizzle";

const mapStateToProps = state => {
  
  return {
    loading: !state.drizzleStatus.initialized,
    accounts: state.accounts,
    contract: state.contracts.Landemic,
    web3: state.web3,
    transactions: state.transactions,
    transactionStack: state.transactionStack
  }
};

export default withRouter(withDrizzle(mapStateToProps)(component));
