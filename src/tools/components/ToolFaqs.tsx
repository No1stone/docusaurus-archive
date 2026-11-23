import type {ReactNode} from 'react';

import type {ToolFaq} from '../types';
import styles from '../styles.module.css';

type Props = {
  faqs: ToolFaq[];
};

export default function ToolFaqs({faqs}: Props): ReactNode {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className={styles.panel} aria-label="자주 묻는 질문">
      <h2 className={styles.panelTitle}>자주 묻는 질문</h2>
      <dl className={styles.faqList}>
        {faqs.map((faq) => (
          <div key={faq.question} className={styles.faqItem}>
            <dt className={styles.faqQuestion}>{faq.question}</dt>
            <dd className={styles.faqAnswer}>{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
