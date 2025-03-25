import { Router, Application } from 'express';

import UserCtrl from './controller/user';
import CatCtrl from './controller/cat';

const setRoutes = (app: Application): void => {
  const router = Router();
  const userCtrl = new UserCtrl();
  const catCtrl = new CatCtrl();

  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  router.route('/cats').get(catCtrl.getAll);
  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Test routes
  if (process.env.NODE_ENV === 'test') {
    router.route('/users/delete').delete(userCtrl.deleteAll);
  }

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

};

export default setRoutes;
