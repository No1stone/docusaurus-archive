import type {ReactNode} from 'react';

import {getDemo} from './catalog';
import {renderDemo} from './registry';

type Props = {
  id: string;
};

export default function UiDemo({id}: Props): ReactNode {
  const meta = getDemo(id);
  if (!meta) {
    return <p>등록되지 않은 데모 id: {id}</p>;
  }
  return renderDemo(id);
}
