import { useEffect, type FC, type FormEvent } from 'react'
import { useGenerateText } from './TextGenerator.service'
import styles from './TextGenerator.module.css'
import { FuriganaSettings } from '../../../components/settings/FuriganaSettings.component'
import { LevelSettings } from '../../../components/settings/LevelSettings.component'
import { AnalyzedText } from '../../../components/analyzed-text/AnalyzedText.component'
import { Button } from '../../../components/Button/Button.component'
import { Translation } from './components/translation/Translation.component'
import { ToolDescription } from '../../../components/ToolDescription/ToolDescription.component'
import { Card } from '../../../components/Card/Card.component'
import { Icon } from '../../../components/Icon/Icons.component'
import { ErrorMessage } from '../../../components/ErrorMessage/ErrorMessage.component'
import { LoadingDots } from '../../../components/LoadingDots/LoadingDots.component'

export const TextGenerator: FC = () => {
  const {
    generateText,
    paragraphs,
    error,
    connectionState,
    dict,
    setFromCache,
    userPrompt,
    setUserPrompt,
    level,
    setLevel,
  } = useGenerateText()

  useEffect(() => {
    setFromCache()
  }, [setFromCache])

  if (error) {
    return (
      <div className={styles.result}>
        <ErrorMessage message={error} />
      </div>
    )
  }

  const isConnected = connectionState === 'connected'
  const isLoading = connectionState === 'loading'
  const isDisconnected = connectionState === 'disconnected'
  const canSendReq = isDisconnected && !isLoading
  const showContentCard = paragraphs.length > 0 || isConnected || isLoading

  const onSendPrompt = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    generateText()
  }

  return (
    <div className={styles.result}>
      <div className={styles.header}>
        <ToolDescription
          title="Generate Text"
          descriptions="Generate level-appropriate Japanese reding material with AI."
        />
        <div className={styles.settings}>
          <LevelSettings value={level} onChange={setLevel} />
          <FuriganaSettings />
        </div>
      </div>
      {showContentCard && (
        <Card>
          {!isLoading && (
            <div className={styles.cardContent}>
              {paragraphs.map((p, i) => (
                <div className={styles.paragraph} key={i}>
                  <p className={styles.text}>
                    <AnalyzedText tokens={p.tokens} dict={dict} />
                  </p>
                  <Translation translation={p.translation} />
                </div>
              ))}
            </div>
          )}
          {(isLoading || isConnected) && <LoadingDots />}
        </Card>
      )}
      <Card>
        <form className={styles.prompt} onSubmit={onSendPrompt}>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            disabled={!canSendReq}
            placeholder="Ex: Create a story abut a cat."
            required
          />
          <Button variant="primary" type="submit" disabled={!canSendReq} className={styles.submit}>
            Generate new text <Icon icon="stars" />
          </Button>
        </form>
      </Card>
    </div>
  )
}
