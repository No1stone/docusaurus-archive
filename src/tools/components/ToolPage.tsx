import type {ReactNode} from 'react';

import {getTool} from '../catalog';
import type {ToolId} from '../types';
import ToolFaqs from './ToolFaqs';
import ToolsLayout from './ToolsLayout';

type Props = {
  toolId: ToolId;
};

export default function ToolPage({toolId}: Props): ReactNode {
  const tool = getTool(toolId);
  const Component = tool.component;

  return (
    <ToolsLayout
      title={tool.title}
      description={tool.description}
      path={`/tools/${tool.slug}`}
      keywords={tool.keywords}
      faqs={tool.faqs}
      kind="tool"
      activeToolId={tool.id}>
      <Component />
      <ToolFaqs faqs={tool.faqs} />
    </ToolsLayout>
  );
}
