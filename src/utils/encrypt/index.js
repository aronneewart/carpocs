import lhash from '../lhash'
import hash from '../hash'

const encrypt = (recovery_phrase, story) => {
  if (!recovery_phrase.trim().length)
    throw new Error(`The recovery phrase must contain at least one word`)

  if (!story.trim().length)
    throw new Error(`The story must contain at least one word`)

  const encoded_story = new TextEncoder().encode(lhash(hash(story, 100), 3))

  return [
    ...new TextEncoder()
      .encode(recovery_phrase)
      .map((c, i) => c ^ encoded_story[i]),
  ]
}

export default encrypt
