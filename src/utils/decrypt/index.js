import lhash from '../lhash'
import hash from '../hash'

const decrypt = (recovery_phrase, story) => {
  if (!recovery_phrase.length)
    throw new Error(
      `The encrypted recovery phrase array must contains at least one element`,
    )
  if (!story.trim().length)
    throw new Error(`The story must contain at least one word`)

  const encoded_story = new TextEncoder().encode(lhash(hash(story, 100), 3))

  return new TextDecoder().decode(
    new Uint8Array(recovery_phrase).map((c, i) => c ^ encoded_story[i]),
  )
}

export default decrypt
