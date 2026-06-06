import {analyzeText as analyze} from '../../analyzer/index.analyzer.js'
import {Analyzed} from '../types.generator.js'

export function analyzeText(text: string): Promise<Analyzed> {
	return analyze(text)
}
