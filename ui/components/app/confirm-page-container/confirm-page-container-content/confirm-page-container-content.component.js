import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tabs, Tab } from '../../../ui/tabs';
import Button from '../../../ui/button';
import ActionableMessage from '../../../ui/actionable-message/actionable-message';
import { PageContainerFooter } from '../../../ui/page-container';
import ErrorMessage from '../../../ui/error-message';
import { INSUFFICIENT_FUNDS_ERROR_KEY } from '../../../../helpers/constants/error-keys';
import Typography from '../../../ui/typography';
import { TYPOGRAPHY } from '../../../../helpers/constants/design-system';
import { TRANSACTION_TYPES } from '../../../../../shared/constants/transaction';

import { ConfirmPageContainerSummary, ConfirmPageContainerWarning } from '.';

export default class ConfirmPageContainerContent extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired,
  };

  state = {
    simData: 'loading...'
  }

  static propTypes = {
    action: PropTypes.string,
    dataComponent: PropTypes.node,
    dataHexComponent: PropTypes.node,
    detailsComponent: PropTypes.node,
    errorKey: PropTypes.string,
    errorMessage: PropTypes.string,
    hideSubtitle: PropTypes.bool,
    tokenAddress: PropTypes.string,
    nonce: PropTypes.string,
    subtitleComponent: PropTypes.node,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string,
    titleComponent: PropTypes.node,
    warning: PropTypes.string,
    origin: PropTypes.string.isRequired,
    ethGasPriceWarning: PropTypes.string,
    // Footer
    onCancelAll: PropTypes.func,
    onCancel: PropTypes.func,
    cancelText: PropTypes.string,
    onSubmit: PropTypes.func,
    submitText: PropTypes.string,
    disabled: PropTypes.bool,
    unapprovedTxCount: PropTypes.number,
    rejectNText: PropTypes.string,
    hideTitle: PropTypes.bool,
    supportsEIP1559V2: PropTypes.bool,
    hasTopBorder: PropTypes.bool,
    currentTransaction: PropTypes.object,
    nativeCurrency: PropTypes.string,
    networkName: PropTypes.string,
    showBuyModal: PropTypes.func,
    toAddress: PropTypes.string,
    transactionType: PropTypes.string,
    isBuyableChain: PropTypes.bool,
  };

  renderContent() {
    const { detailsComponent, dataComponent } = this.props;

    if (detailsComponent && dataComponent) {
      return this.renderTabs();
    }
    return detailsComponent || dataComponent;
  }

  componentDidMount = () => {
    const { fromAddress, toAddress, currentTransaction } = this.props;
    // const TENDERLY_USER = 'freeslugs@gmail.com' // 'freeslugs', 
    let TENDERLY_USER = 'freeslugs' // 'freeslugs', 
    let TENDERLY_PROJECT = 'project' 
    let TENDERLY_ACCESS_KEY = 'OM793dakPccX8xQfi1RGh9rPO82VI2cV'
    let SIMULATE_URL = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate`

    let body = {
      "network_id": "4",
      // "block_number": 10917578,
      // "transaction_index": 0,
      "from": fromAddress,
      "input": currentTransaction.txParams.data,
      "to": toAddress,
      "gas": parseInt(currentTransaction.txParams.gas, 16),
      "gas_price": currentTransaction.txParams.gasPrice,
      "value": currentTransaction.txParams.value,
      // "access_list": [],
      // "generate_access_list": true,
      "save": true,
      "source": "dashboard",
      // "block_header": {
      //   "number": "0xa696ca",
      //   "timestamp": "0x62b7e6cb"
      // }
    }

     let opts = {
      method : 'POST',
      headers: {
        'X-Access-Key': TENDERLY_ACCESS_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(body)
    }

    fetch(SIMULATE_URL, opts)
    .then(response => response.json())
    .then(data => {
      const logs = data.transaction.transaction_info.logs.map(log => {
        return log.inputs.map(evt => {
          return `${evt.soltype.name} ${evt.value.substring(0, 6)}`
        }).join(" ")
      })
      this.setState({ simData: logs.join("\n") })
    });
  }

  renderTabs() {
    const { t } = this.context;
    const { detailsComponent, dataComponent, dataHexComponent } = this.props;

    return (
      <Tabs>
        <Tab
          className="confirm-page-container-content__tab"
          name={t('details')}
        >
          {detailsComponent}
        </Tab>
        <Tab className="confirm-page-container-content__tab" name={t('data')}>
          {dataComponent}
        </Tab>
        {dataHexComponent && (
          <Tab
            className="confirm-page-container-content__tab"
            name={t('dataHex')}
          >
            {dataHexComponent}
          </Tab>
        )}
        <Tab className="confirm-page-container-content__tab" name="Simulation">
          <div className="simulation__tab">
            {/* TODO GILAD - SIMULATION TAB */}
            { this.state.simData }
          </div>
        </Tab>
      </Tabs>
    );
  }

  render() {
    const {
      action,
      errorKey,
      errorMessage,
      title,
      image,
      titleComponent,
      subtitleComponent,
      hideSubtitle,
      tokenAddress,
      nonce,
      detailsComponent,
      dataComponent,
      warning,
      onCancelAll,
      onCancel,
      cancelText,
      onSubmit,
      submitText,
      disabled,
      unapprovedTxCount,
      rejectNText,
      origin,
      ethGasPriceWarning,
      hideTitle,
      supportsEIP1559V2,
      hasTopBorder,
      currentTransaction,
      nativeCurrency,
      networkName,
      showBuyModal,
      toAddress,
      transactionType,
      isBuyableChain,
    } = this.props;

    const { t } = this.context;

    const showInsuffienctFundsError =
      supportsEIP1559V2 &&
      (errorKey || errorMessage) &&
      errorKey === INSUFFICIENT_FUNDS_ERROR_KEY;

    return (
      <div
        className={classnames('confirm-page-container-content', {
          'confirm-page-container-content--with-top-border': hasTopBorder,
        })}
      >
        {warning ? <ConfirmPageContainerWarning warning={warning} /> : null}
        {ethGasPriceWarning && (
          <ConfirmPageContainerWarning warning={ethGasPriceWarning} />
        )}
        <ConfirmPageContainerSummary
          className={classnames({
            'confirm-page-container-summary--border':
              !detailsComponent || !dataComponent,
          })}
          action={action}
          title={title}
          image={image}
          titleComponent={titleComponent}
          subtitleComponent={subtitleComponent}
          hideSubtitle={hideSubtitle}
          tokenAddress={tokenAddress}
          nonce={nonce}
          origin={origin}
          hideTitle={hideTitle}
          toAddress={toAddress}
          transactionType={transactionType}
        />
        {this.renderContent()}
        {!supportsEIP1559V2 &&
          (errorKey || errorMessage) &&
          currentTransaction.type !== TRANSACTION_TYPES.SIMPLE_SEND && (
            <div className="confirm-page-container-content__error-container">
              <ErrorMessage errorMessage={errorMessage} errorKey={errorKey} />
            </div>
          )}
        {showInsuffienctFundsError && (
          <div className="confirm-page-container-content__error-container">
            <ActionableMessage
              className="actionable-message--warning"
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

        <PageContainerFooter
          onCancel={onCancel}
          cancelText={cancelText}
          onSubmit={onSubmit}
          submitText={submitText}
          disabled={disabled}
        >
          {unapprovedTxCount > 1 ? (
            <a onClick={onCancelAll}>{rejectNText}</a>
          ) : null}
        </PageContainerFooter>
      </div>
    );
  }
}
