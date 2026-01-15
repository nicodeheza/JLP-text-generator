import {analyzeText as analyze} from '../../analyzer/analyzer.js'
import {Analyzed} from '../types.generator.js'

export function analyzeText(text: string): Promise<Analyzed> {
	return analyze(text)
}
