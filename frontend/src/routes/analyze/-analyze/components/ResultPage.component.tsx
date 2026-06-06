import type { FC } from 'react'
import { AnalyzedText } from '../../../../components/analyzed-text/AnalyzedText.component'
import { Button } from '../../../../components/Button/Button.component'
import type { AnalyzeData } from '../analyze.types'
import styles from './ResultPage.module.css'
import { Card } from '../../../../components/Card/Card.component'
import { Icon } from '../../../../components/Icon/Icons.component'

interface Props {
  data: AnalyzeData
  onClear: () => void
}

export const ResultPage: FC<Props> = ({ data, onClear }) => {
  return (
    <Card className={styles.container}>
      <div className={styles.buttonContainer}>
        <Button variant="transparent" onClick={onClear}>
          <Icon icon="trash" /> Clear
        </Button>
      </div>
      <div>
        <p className={styles.text}>
          <AnalyzedText tokens={data.tokens} dict={data.dict} />
        </p>
      </div>
    </Card>
  )
}
