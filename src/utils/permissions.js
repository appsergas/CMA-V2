export const UAEPassConfig = async () => {
  try {

    const config = {
      env: 'production', 
      clientId: 'sergas_mob_prod',
      redirectURL: 'sergas://customer.app',
      successHost: 'uaePassSuccess',
      failureHost: 'uaePassFailure',
      scheme: 'prodScheme',
      scope: 'urn:uae:digitalid:profile',
      locale: 'en',
    };
    return config;
  } catch (err) {
    console.warn(err);
    return false;
  }
};
