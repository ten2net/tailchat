import { decode, encode, isMiao } from './miaotrans';
import { regMessageInterpreter } from '@capital/common';
import { Translate } from './translate';

const miao = encode('火星文翻译已加载');
const human = decode(miao);

console.log(`${miao}\n${human}`);

regMessageInterpreter({
  name: Translate.miaoTrans,
  explainMessage(message: string) {
    // 火星文 -> 人话
    if (!isMiao(message)) {
      return null;
    }

    return decode(message);
  },
});
