import React from 'react';
import {Route, withRouter, Switch} from "react-router-dom";
import TileInfoWrapper from "../TileInfoWrapper";

const TileInfoRouter = ({
   transactionStackOngoing,
   transactionStack,
   transactions,
   account,
   contract,
   defaultMultiple,
   grabCodes,
   setTransactionStackOngoing,
   onClose,
   dataJSON
}) => {

  return (
    <Switch>
      <Route
        path='/buy/:codes'
        render={({ match: { params: { codes } } }) => {

          const stackId = transactionStackOngoing[codes];
          const transactionKey = transactionStack[stackId];
          const transaction = transactions ? transactions[transactionKey] : undefined;
          const codesArray = codes.split(',')

          return (
            <TileInfoWrapper
              codes={codesArray}
              account={account}
              contract={contract}
              metadataForToken={contract.metadataForToken}
              defaultMultiple={defaultMultiple}
              grabCodes={(codes, wei) => {grabCodes(codes, wei)}}
              transaction={transaction}
              setTransactionStackOngoing={setTransactionStackOngoing}
              onClose={onClose}
              dataJSON={dataJSON}
            />
          )
        }}
      />
    </Switch>
  );
};

export default withRouter(TileInfoRouter);
