import {JMdictWord} from '@scriptin/jmdict-simplified-types'

export interface Msg {
	jMdictWord: JMdictWord
	tags: Record<string, number>
	mecab: Record<string, number>
}
