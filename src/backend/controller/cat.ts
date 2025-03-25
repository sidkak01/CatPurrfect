import Cat, { ICat } from '../model/cat';
import BaseCtrl from './base';

class CatCtrl extends BaseCtrl<ICat> {
  model = Cat;
}

export default CatCtrl;
