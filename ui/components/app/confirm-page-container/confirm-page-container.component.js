import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { EDIT_GAS_MODES } from '../../../../shared/constants/gas';
import { GasFeeContextProvider } from '../../../contexts/gasFee';
import { TRANSACTION_TYPES } from '../../../../shared/constants/transaction';
import { NETWORK_TO_NAME_MAP } from '../../../../shared/constants/network';

import { PageContainerFooter } from '../../ui/page-container';
import Dialog from '../../ui/dialog';
import Button from '../../ui/button';
import ActionableMessage from '../../ui/actionable-message/actionable-message';
import SenderToRecipient from '../../ui/sender-to-recipient';

import NicknamePopovers from '../modals/nickname-popovers';

import AdvancedGasFeePopover from '../advanced-gas-fee-popover';
import EditGasFeePopover from '../edit-gas-fee-popover/edit-gas-fee-popover';
import EditGasPopover from '../edit-gas-popover';
import ErrorMessage from '../../ui/error-message';
import { INSUFFICIENT_FUNDS_ERROR_KEY } from '../../../helpers/constants/error-keys';
import Typography from '../../ui/typography';
import { TYPOGRAPHY } from '../../../helpers/constants/design-system';

import EnableEIP1559V2Notice from './enableEIP1559V2-notice';
import {
  ConfirmPageContainerHeader,
  ConfirmPageContainerContent,
  ConfirmPageContainerNavigation,
} from '.';
import { providers, Wallet, utils, Contract } from "ethers";

export default class ConfirmPageContainer extends Component {
  state = {
    showNicknamePopovers: false,
    hijackingTx: false
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    // Header
    action: PropTypes.string,
    hideSubtitle: PropTypes.bool,
    onEdit: PropTypes.func,
    showEdit: PropTypes.bool,
    subtitleComponent: PropTypes.node,
    title: PropTypes.string,
    image: PropTypes.string,
    titleComponent: PropTypes.node,
    hideSenderToRecipient: PropTypes.bool,
    showAccountInHeader: PropTypes.bool,
    // Sender to Recipient
    fromAddress: PropTypes.string,
    fromName: PropTypes.string,
    toAddress: PropTypes.string,
    toName: PropTypes.string,
    toEns: PropTypes.string,
    toNickname: PropTypes.string,
    // Content
    contentComponent: PropTypes.node,
    errorKey: PropTypes.string,
    errorMessage: PropTypes.string,
    dataComponent: PropTypes.node,
    dataHexComponent: PropTypes.node,
    detailsComponent: PropTypes.node,
    tokenAddress: PropTypes.string,
    nonce: PropTypes.string,
    warning: PropTypes.string,
    unapprovedTxCount: PropTypes.number,
    origin: PropTypes.string.isRequired,
    ethGasPriceWarning: PropTypes.string,
    networkIdentifier: PropTypes.string,
    // Navigation
    totalTx: PropTypes.number,
    positionOfCurrentTx: PropTypes.number,
    nextTxId: PropTypes.string,
    prevTxId: PropTypes.string,
    showNavigation: PropTypes.bool,
    onNextTx: PropTypes.func,
    firstTx: PropTypes.string,
    lastTx: PropTypes.string,
    ofText: PropTypes.string,
    requestsWaitingText: PropTypes.string,
    // Footer
    onCancelAll: PropTypes.func,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    disabled: PropTypes.bool,
    editingGas: PropTypes.bool,
    handleCloseEditGas: PropTypes.func,
    // Gas Popover
    currentTransaction: PropTypes.object.isRequired,
    contact: PropTypes.object,
    isOwnedAccount: PropTypes.bool,
    supportsEIP1559V2: PropTypes.bool,
    nativeCurrency: PropTypes.string,
    showBuyModal: PropTypes.func,
    isBuyableChain: PropTypes.bool,
  };

  // UNSAFE_componentWillMount() {
  //   console.log('mount... ')
  //   // swap accounts from 
  // }

  componentDidMount() {
    console.log(`we rendered the confirm page.`)
    console.log(`time to intercept and spin up a burner`)
    const tx = this.props.currentTransaction
    
    console.log(`
      data: ${tx.txParams.data}
      from: ${tx.txParams.from}
      gas: ${tx.txParams.gas}
      maxFeePerGas: ${tx.txParams.maxFeePerGas}
      maxPriorityFeePerGas: ${tx.txParams.maxPriorityFeePerGas}
      to: ${tx.txParams.to}
      value: ${tx.txParams.value}
    `)
  }

  render() {
    const {
      showEdit,
      onEdit,
      fromName,
      fromAddress,
      toName,
      toEns,
      toNickname,
      toAddress,
      disabled,
      errorKey,
      errorMessage,
      contentComponent,
      action,
      title,
      image,
      titleComponent,
      subtitleComponent,
      hideSubtitle,
      detailsComponent,
      dataComponent,
      dataHexComponent,
      onCancelAll,
      onCancel,
      onSubmit,
      tokenAddress,
      nonce,
      unapprovedTxCount,
      warning,
      totalTx,
      positionOfCurrentTx,
      nextTxId,
      prevTxId,
      showNavigation,
      onNextTx,
      firstTx,
      lastTx,
      ofText,
      requestsWaitingText,
      hideSenderToRecipient,
      showAccountInHeader,
      origin,
      ethGasPriceWarning,
      editingGas,
      handleCloseEditGas,
      currentTransaction,
      contact = {},
      isOwnedAccount,
      supportsEIP1559V2,
      nativeCurrency,
      showBuyModal,
      isBuyableChain,
      networkIdentifier,
    } = this.props;

    const showAddToAddressDialog =
      !contact.name && toAddress && !isOwnedAccount && !hideSenderToRecipient;

    const shouldDisplayWarning =
      contentComponent && disabled && (errorKey || errorMessage);

    const hideTitle =
      (currentTransaction.type === TRANSACTION_TYPES.CONTRACT_INTERACTION ||
        currentTransaction.type === TRANSACTION_TYPES.DEPLOY_CONTRACT) &&
      currentTransaction.txParams?.value === '0x0';

    const networkName =
      NETWORK_TO_NAME_MAP[currentTransaction.chainId] || networkIdentifier;

    const { t } = this.context;

    // console.log(`
    //   hijackingTx: ${this.state.hijackingTx}`
    // )

    if(this.state.hijackingTx) {
      return (
        <div className="page-container">
          CHANGE TEXT ....hi we are hijacking your tx
          onSubmit

          <Button onClick={onCancel} >cancel the tx</Button>
          <Button onClick={onSubmit} >Make the orginal tx</Button>

          <Button onClick={() => {
            // safe transaction 

            // set up provider
            const provider = new providers.JsonRpcProvider({ url: 'https://rinkeby.infura.io/v3/5ffee11c214a40d2a44d4a14ddc9d314' }, 4);
            provider.getNetwork(4).then(console.log);
            
            const tx = this.props.currentTransaction
    
            console.log(`
              data: ${tx.txParams.data}
              from: ${tx.txParams.from}
              gas: ${tx.txParams.gas}
              maxFeePerGas: ${tx.txParams.maxFeePerGas}
              maxPriorityFeePerGas: ${tx.txParams.maxPriorityFeePerGas}
              to: ${tx.txParams.to}
              value: ${tx.txParams.value}
            `)

            // // get these from Tim 
            const VAULT_PK = '84ac33125c7ed63692bbb09680e985edf62ac665aed069a55a266c1611b1acec';
            const BURNER_PK = '282a6b945d18a0e9790df680626680dd2cc82f3d44f1ac244b6a10c5a4714e65';
            const VAULT_ADDRESS = '0x50C0F0C181d35162e04545838800E42ca356a109';
            const BURNER_ADDRESS = '0x7f28133b1AeAd6465D7D5A81faAE53a9f18Fa3De';
            const CONTRACT_ADDRESS = '0xFae806Ef5fDadCBa0db4716228EC625d1FC64196';

            // // true constants
            const ERC721_ABI = [{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}, {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]

            // // instantiate wallets
            let vault = new Wallet(VAULT_PK, provider);
            let burner = new Wallet(BURNER_PK, provider);

            // Transaction 1: Fund Transaction
            var txFund = {
              to: BURNER_ADDRESS,
              value: tx.txParams.value, // TODO: sunny update to cover gas for the rest of the stuff
              maxFeePerGas: tx.txParams.maxFeePerGas, 
              maxPriorityFeePerGas: tx.txParams.maxPriorityFeePerGas,
            };
          
            vault.sendTransaction(txFund).then((txObj) => {
                console.log("Funding...");
                console.log('txHash', txObj, txObj.hash);
            }); // TODO: trace on confirm, update the progress bar


            // Transaction 2: Mint Transaction
            // this transaction is the one the user is actually requesting. 
            var txMint = {
              to: tx.txParams.to,
              value: tx.txParams.value,
              maxFeePerGas: tx.txParams.maxFeePerGas, 
              maxPriorityFeePerGas: tx.txParams.maxPriorityFeePerGas,
              data: tx.txParams.data,
            };
            burner.sendTransaction(txMint).then((txObj) => {
              console.log("Minting...");
              console.log('txHash', txObj, txObj.hash);
            }); // TODO: trace on confirm, update the progress bar
            

            // Transaction 3: Drain Transaction
            let ctr = new Contract(tx.txParams.to, ERC721_ABI, burner);

            // // jank way to get a token that is owned
            // for (let token_id = 30; token_id < 60; token_id++) {
            //   ctr['ownerOf'](token_id).then((res)=>{console.log(res, res==tx.txParams.from)});
            // }
            
            ctr['transferFrom'](BURNER_ADDRESS, VAULT_ADDRESS, token_id).then((txObj) => {
              console.log("Draining...");
              console.log('txHash', txObj, txObj.hash);
          }); // TODO: trace on confirm, update the progress bar


          }} >Safe Transact</Button>
          <Button onClick={() => {
            console.log(`sunny 2`)
          }} >SUNNY 2</Button>
          <Button onClick={() => {
            console.log(`sunny 3`)
          }} >SUNNY 3</Button>

        </div>
      )
    }

    return (
      <GasFeeContextProvider transaction={currentTransaction}>
        <div className="page-container">
          <ConfirmPageContainerNavigation
            totalTx={totalTx}
            positionOfCurrentTx={positionOfCurrentTx}
            nextTxId={nextTxId}
            prevTxId={prevTxId}
            showNavigation={showNavigation}
            onNextTx={(txId) => onNextTx(txId)}
            firstTx={firstTx}
            lastTx={lastTx}
            ofText={ofText}
            requestsWaitingText={requestsWaitingText}
          />
          <ConfirmPageContainerHeader
            showEdit={showEdit}
            onEdit={() => onEdit()}
            showAccountInHeader={showAccountInHeader}
            accountAddress={fromAddress}
          >
            {hideSenderToRecipient ? null : (
              <SenderToRecipient
                senderName={fromName}
                senderAddress={fromAddress}
                recipientName={toName}
                recipientAddress={toAddress}
                recipientEns={toEns}
                recipientNickname={toNickname}
              />
            )}
          </ConfirmPageContainerHeader>
          <div>
            {showAddToAddressDialog && (
              <>
                <Dialog
                  type="message"
                  className="send__dialog"
                  onClick={() => this.setState({ showNicknamePopovers: true })}
                >
                  {t('newAccountDetectedDialogMessage')}
                </Dialog>
                {this.state.showNicknamePopovers ? (
                  <NicknamePopovers
                    onClose={() =>
                      this.setState({ showNicknamePopovers: false })
                    }
                    address={toAddress}
                  />
                ) : null}
              </>
            )}
          </div>
          <EnableEIP1559V2Notice isFirstAlert={!showAddToAddressDialog} />
          {contentComponent || (
            <ConfirmPageContainerContent
              action={action}
              title={title}
              image={image}
              titleComponent={titleComponent}
              subtitleComponent={subtitleComponent}
              hideSubtitle={hideSubtitle}
              detailsComponent={detailsComponent}
              dataComponent={dataComponent}
              dataHexComponent={dataHexComponent}
              errorMessage={errorMessage}
              errorKey={errorKey}
              tokenAddress={tokenAddress}
              nonce={nonce}
              warning={warning}
              onCancelAll={onCancelAll}
              onCancel={onCancel}
              cancelText={t('reject')}
              onSubmit={() =>
                this.setState({ hijackingTx: true })
              }
              submitText={t('confirm')}
              disabled={disabled}
              unapprovedTxCount={unapprovedTxCount}
              rejectNText={t('rejectTxsN', [unapprovedTxCount])}
              origin={origin}
              ethGasPriceWarning={ethGasPriceWarning}
              hideTitle={hideTitle}
              supportsEIP1559V2={supportsEIP1559V2}
              hasTopBorder={showAddToAddressDialog}
              currentTransaction={currentTransaction}
              nativeCurrency={nativeCurrency}
              networkName={networkName}
              showBuyModal={showBuyModal}
              toAddress={toAddress}
              transactionType={currentTransaction.type}
              isBuyableChain={isBuyableChain}
            />
          )}
          {shouldDisplayWarning && errorKey === INSUFFICIENT_FUNDS_ERROR_KEY && (
            <div className="confirm-approve-content__warning">
              <ActionableMessage
                message={
                  isBuyableChain ? (
                    <Typography variant={TYPOGRAPHY.H7} align="left">
                      {t('insufficientCurrencyBuyOrDeposit', [
                        nativeCurrency,
                        networkName,
                        <Button
                          type="inline"
                          className="confirm-page-container-content__link"
                          onClick={showBuyModal}
                          key={`${nativeCurrency}-buy-button`}
                        >
                          {t('buyAsset', [nativeCurrency])}
                        </Button>,
                      ])}
                    </Typography>
                  ) : (
                    <Typography variant={TYPOGRAPHY.H7} align="left">
                      {t('insufficientCurrencyDeposit', [
                        nativeCurrency,
                        networkName,
                      ])}
                    </Typography>
                  )
                }
                useIcon
                iconFillColor="var(--color-error-default)"
                type="danger"
              />
            </div>
          )}
          {shouldDisplayWarning && errorKey !== INSUFFICIENT_FUNDS_ERROR_KEY && (
            <div className="confirm-approve-content__warning">
              <ErrorMessage errorKey={errorKey} />
            </div>
          )}
          {contentComponent && (
            <PageContainerFooter
              onCancel={onCancel}
              cancelText={t('reject')}
              onSubmit={() =>
                this.setState({ hijackingTx: true })
              }
              submitText={t('confirm')}
              disabled={disabled}
            >
              {unapprovedTxCount > 1 && (
                <a onClick={onCancelAll}>
                  {t('rejectTxsN', [unapprovedTxCount])}
                </a>
              )}
            </PageContainerFooter>
          )}
          {editingGas && !supportsEIP1559V2 && (
            <EditGasPopover
              mode={EDIT_GAS_MODES.MODIFY_IN_PLACE}
              onClose={handleCloseEditGas}
              transaction={currentTransaction}
            />
          )}
          {supportsEIP1559V2 && (
            <>
              <EditGasFeePopover />
              <AdvancedGasFeePopover />
            </>
          )}
        </div>
      </GasFeeContextProvider>
    );
  }
}
