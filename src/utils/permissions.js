export const UAEPassConfig = async () => {
  try {
    // const config = {
    //   env: 'staging', // or production // default staging
    //   clientId: 'sergas_mob_stage',
    //   redirectURL: 'sergas://customer.app',
    //   successHost: 'uaePassSuccess',
    //   failureHost: 'uaePassFail',
    //   scheme: 'testscheme',
    //   scope: 'urn:uae:digitalid:profile',
    //   locale: 'en',
    // };

    const config = {
      env: 'production', // or production // default staging
      clientId: 'sergas_mob_prod',
      redirectURL: 'sergas://customer.app',
      successHost: 'uaePassSuccess',
      failureHost: 'uaePassFail',
      scheme: 'testscheme',
      scope: 'urn:uae:digitalid:profile',
      locale: 'en',
    };
    return config;
  } catch (err) {
    console.warn(err);
    return false;
  }
};
