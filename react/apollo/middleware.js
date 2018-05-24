import url from 'url';

import { initApolloClient } from 'react/apollo';
import ssr from 'react/apollo/ssr';

export default (req, res, next) => {
  const currentRoute = { ...url.parse(req.url) };

  const client = initApolloClient({
    token: req.user && req.user.get('authentication_token'),
    currentRoute,
  });

  req.apollo = {
    client,
    render: ssr(client),
  };

  next();
};
