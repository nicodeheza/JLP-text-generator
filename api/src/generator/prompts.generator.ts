import { JLPTLevel } from './types.generator.js'

const levelConstraints: Record<JLPTLevel, string> = {
  N5: `\
- Basic sentence structure with particles like は、が、を、に、で、へ、も、と、や
- Simple verb forms: dictionary form, ます/です, past tense (ました/でした), negative (ません/じゃない)
- Te-form basics:〜ている (ongoing state/action), 〜てください (please do), 〜てはいけない (must not), 〜てもいいです (may do)
- Basic adjectives: い-adjectives and な-adjectives in simple sentences
- Expressing want/desire: 〜たい
- Simple connectors: から (because), けど (but), そして (and then)
- Common sentence-ending particles: ね、よ、か (question)
- Avoid complex subordinate clauses, formal registers, or grammar beyond everyday basic speech`,

  N4: `\
- All N5 grammar, plus:
- Conditional forms: 〜ば、〜たら (if/when)
- Giving/receiving verbs: あげる、くれる、もらう with て-form
- Auxiliary verbs: 〜始める (start doing), 〜出す (suddenly start), 〜続ける (keep doing), 〜すぎる (too much)
- Te-form extensions: 〜てみる (try doing), 〜てしまう (end up doing), 〜ておく (do in advance)
- Purpose/goal expressions: 〜ために、〜ように
- Expectation/certainty: 〜はずだ、〜はずがない
- Permission/prohibition: 〜てもいい、〜なくてもいい、〜なければならない
- Basic honorific/humble speech starters (〜ていただく、ございます)
- Avoid complex formal written patterns, literary expressions, or heavy use of passive/causative`,

  N3: `\
- All N4 grammar, plus:
- Passive, causative, and causative-passive verb forms
- Conjunctions and connectors: 〜し (and also), 〜のに (even though), 〜くせに (even though — critical nuance), 〜ながら (while doing)
- Compound expressions: 〜だけでなく (not only), 〜によって (depending on / by means of), 〜ばかり (nothing but)
- Hearsay/inference: 〜らしい、〜ようだ、〜そうだ (looks like / seems like)
- Noun-modifying clauses used more freely
- 〜てある (has been done, resulting state), 〜ていく / 〜てくる (directional change over time)
- Common set phrases: 〜ことにする (decide to), 〜ことになる (it has been decided), 〜ようにする (try to make it so)
- Avoid most formal written-language expressions, classical grammar, or N2/N1-level complex patterns`,

  N2: `\
- All N3 grammar, plus:
- Formal written expressions: 〜において (in/at — formal), 〜に対して (toward/against), 〜に関して (regarding), 〜について (about)
- Advanced conjunctions: 〜ずに (without doing), 〜に伴って (along with), 〜に従って (in accordance with), 〜をめぐって (surrounding the issue of)
- Nominalizer and compound patterns: 〜ものの (although), 〜ものだ (is/should be by nature), 〜わけだ (that's why), 〜わけではない (it's not that)
- Expressing difficulty/reluctance: 〜かねる、〜かねない
- 〜にしては (for/considering that), 〜にすぎない (nothing more than), 〜にほかならない (nothing but)
- Potential to mix formal and informal registers appropriately
- Avoid classical grammar, literary-only forms, or the most advanced N1 patterns`,

  N1: `\
- All N2 grammar, plus:
- Literary and formal written patterns: 〜ならではの (unique to), 〜をもって (by means of / as of), 〜いかんにかかわらず (regardless of), 〜にもかかわらず (despite)
- Classical/formal conjunctions: 〜たりとも (even one), 〜といえども (even though), 〜であれ (even if it is)
- Highly formal or archaic expressions appropriate to essays, news, or literature
- Complex clause nesting and long sentence structures
- Full use of passive, causative, and honorific/humble speech at a natural level
- Nuanced use of particles and patterns that distinguish near-synonyms
- The text can reflect the sophistication expected of an advanced learner`,
}

export function generateStoryInstructions(level: JLPTLevel): string {
  return `You are a Japanese writer who writes texts for Japanese learners so they can practice reading. Create a text based on the student's request. After each paragraph, put down the English translation between (). The text should not have any formatting; just return the plain text. Also, don't add furigana to the text. Only respond with the story and the translation, nothing more.

The target reader is at JLPT ${level} level. Try to use vocabulary and grammar patterns that feel natural for that level. You don't need to follow this strictly — it's a guide to help match the reader's level, not a hard rule.

Rough grammar guide for ${level}:
${levelConstraints[level]}`
}
