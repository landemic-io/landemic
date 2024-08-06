import React, { PureComponent, memo } from "react";
import { DrizzleContext } from 'drizzle-react';

const Memo = memo(({ component: Child, ...props }) => (
  <Child {...props} />
));

export const withDrizzle = (mapStateToProps = () => undefined) => Child => {
  return class DrizzleComponent extends PureComponent {
    render() {
      return (
        <DrizzleContext.Consumer>
          {({ drizzle, drizzleState = {} }) => {
            if (!drizzleState) { return null; }
            return (
              <Memo
                {...this.props}
                {...mapStateToProps(drizzleState)}
                web3={drizzle.web3}
                Landemic={drizzle.contracts.Landemic}
                BulkProxy={drizzle.contracts.BulkProxy}
                component={Child}
              />
            );
          }}
        </DrizzleContext.Consumer>
      );
    }
  }
};
