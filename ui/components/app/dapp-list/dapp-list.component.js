import React, { useMemo, useState, useCallback } from 'react';
import Identicon from '../../ui/identicon';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  nonceSortedCompletedTransactionsSelector,
  nonceSortedPendingTransactionsSelector,
} from '../../../selectors/transactions';
import { getCurrentChainId } from '../../../selectors';
import { useI18nContext } from '../../../hooks/useI18nContext';
import TransactionListItem from '../transaction-list-item';
import SmartTransactionListItem from '../transaction-list-item/smart-transaction-list-item.component';
import Button from '../../ui/button';
import { TOKEN_CATEGORY_HASH } from '../../../helpers/constants/transactions';
import { SWAPS_CHAINID_CONTRACT_ADDRESS_MAP } from '../../../../shared/constants/swaps';
import { TRANSACTION_TYPES } from '../../../../shared/constants/transaction';
import { isEqualCaseInsensitive } from '../../../../shared/modules/string-utils';

const PAGE_INCREMENT = 10;

const DAPPS = ['https://doodles.app/', 'https://goblintown.wtf/', 'https://www.moonbirds.xyz/']
// TODO (TRACE): do we want (current, completed) similar to transaction-list? 

const DappListItem = ({
  name,
  className,
  handleClick,
  icon = null,
}) => {
  // const { name, address, balance } = account || {};

  return (
    <div
      className={`account-list-item ${className}`}
      onClick={() => handleClick({name})}
    >
      <div className="account-list-item__top-row">
        <Identicon
          address={name}
          className="account-list-item__identicon"
          diameter={18}
        />
        <div className="account-list-item__account-name">{ name }</div>
        {icon ? <div className="account-list-item__icon">{icon}</div> : null}
      </div>
    </div>
  );
}

export default function DappList({
}) {
  // active dapps 
  // old apps

  const handleDappClick = data => {
    console.log('data!!!!!!!!!!!!!!!!!')
  }

  return (
    <div className="dapp-list">
      <div className="dapp-list__dapps">
        {DAPPS.length > 0 ? (
          <div className="transaction-list__pending-transactions">
            <div className="transaction-list__header">
              {`DAPPS (${DAPPS.length})`}
            </div>
            {DAPPS.map(name =>
             <DappListItem
              name={name}
              handleClick={handleDappClick}
              />
            )}
          </div>
        ) :
        (
          <div className="transaction-list__empty">
            <div className="transaction-list__empty-text">
              You haven't connected to any dapps
            </div>
          </div>
        )
      }
      </div>
    </div>
  );
}

// TransactionList.propTypes = {
//   hideTokenTransactions: PropTypes.bool,
//   tokenAddress: PropTypes.string,
// };

// TransactionList.defaultProps = {
//   hideTokenTransactions: false,
//   tokenAddress: undefined,
// };
