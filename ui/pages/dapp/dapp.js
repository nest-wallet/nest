import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { isEqualCaseInsensitive } from '../../../shared/modules/string-utils';
import CollectibleDetails from '../../components/app/collectible-details/collectible-details';
import { getCollectibles, getTokens } from '../../ducks/metamask/metamask';
import { DEFAULT_ROUTE } from '../../helpers/constants/routes';




const Dapp = () => {
  const { id } = useParams();


  useEffect(() => {
    console.log('HERE!!!!!!!!!!!!!!!!!!!!!!')
    console.log('DAPP ID: ', id)
  }, []);

  return <div className="main-container">DAPP {id}</div>;
};

export default Dapp;
