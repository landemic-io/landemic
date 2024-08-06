import React, { Component, memo } from 'react';
import './styles.scss';
import MyTile from './MyTile';
import {withDrizzle} from "../../withDrizzle";
import MapLoading from "../../MapArea/components/MapLoading";
import InstallMetamask from "../../InstallMetamask";
import Helper from '../../../shared'
import StatsTable from '../Stats/StatsTable'

class MyTiles extends Component {

  constructor(props) {
    super(props)

    const { account } = this.props;
    // let account = "0x3B8b631F77D5E6947d796773411998911d4c8999" // many notifications
    // let account = "0xe9D4420B4289A7DA3943917Ef52c186e26d1333E" // no notifications, many tiles

    if (account)
      this.notifications = this.props.dataJSON['notifications'].filter((row) => row[1] === account)
    else
      this.notifications = []

  }

  handleClick = (e, code) => {
    e.preventDefault();
    this.props.selectCode(code);
  };

  render() {

    const { tiles = [], selectCode, Landemic, web3, loading, isMetamaskEnabled, transactionStackOngoing, transactions, transactionStack, dataJSON } = this.props

    const notificationRows = this.notifications.map((row,i) => {
      const [timestamp,,,code] = row
      const dateTime = new Date(timestamp * 1000)

            /*eslint-disable-next-line*/
      return <tr key={i}><td><a href='' onClick={(e) => this.handleClick(e, code)}>{code}</a></td><td>{Helper.timeSince(dateTime)}</td></tr>      
    });

    const hasNotifications = notificationRows.length > 0

    return(
      <div id="my-tiles-list">
        {hasNotifications ? 
          <StatsTable bodyRows={notificationRows} showFirst={3} headerRow={<tr><th>Sold</th></tr>} /> : null
        }
        {isMetamaskEnabled && loading && <MapLoading />}
        {isMetamaskEnabled
          ? !loading && (
            tiles.length ? 
              <div><table className="stats-table">
              {hasNotifications ? <thead><tr><th>Current</th></tr></thead> : null}
              <tbody>
              {tiles.map(tile => {
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
                    dataJSON={dataJSON}
                  />
                )
              })}
              </tbody>
              </table>
              <div id="tips"><div>Pro Tip: Hold the Shift key to select more than one tile</div></div></div>

              :
              <h3>You currently have no tiles. Choose a tile on the map to buy it.</h3>
          )
          : <InstallMetamask />
        }
      </div>
    );
  }

}


export default withDrizzle()(memo(MyTiles));
