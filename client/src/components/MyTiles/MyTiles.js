import React, { memo } from 'react';
import './styles.scss';
import MyTile from './MyTile';
import {withDrizzle} from "../withDrizzle";
import MapLoading from "../MapArea/components/MapLoading";
import InstallMetamask from "../InstallMetamask";

const MyTiles = ({
  tiles = [],
  selectCode,
  Landemic,
  web3, loading,
  isMetamaskEnabled,
  transactionStackOngoing,
  transactions,
  transactionStack,
  myTilesAmount
}) => (

    <div id="my-tiles-list">
      {isMetamaskEnabled && loading && <MapLoading />}
      {isMetamaskEnabled
        ? !loading && (
          tiles.length ?
            tiles.map(tile => {
                return (
                  <MyTile
                    key={tile.code}
                    tile={tile}
                    Landemic={Landemic}
                    web3={web3}
                    selectCode={selectCode}
                    ongoingTransaction={
                      typeof transactionStackOngoing[tile.code] !== 'undefined'
                        ? transactions[transactionStack[transactionStackOngoing[tile.code]]]
                        : undefined
                    }
                  />
                );
              }).concat(<div id="tips"><div>Pro Tip: Hold the Shift key to select more than one tile</div></div>)
            :
              <h3>You currently have no tiles. Choose a tile on the map to buy it.</h3>
        )
        : <InstallMetamask />
      }
    </div>
);

export default withDrizzle()(memo(MyTiles));
