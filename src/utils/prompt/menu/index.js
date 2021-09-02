import prompt from '../../prompt'

const promptMenu = async ({ title = 'Options', options = [] }) => {
  let selected
  do {
    process.stdout.write(`${Array(120).fill('-').join('')}\n${title}:\n\n`)
    options.forEach((options, i) =>
      process.stdout.write(`\t[${i}] ${options} ${i ? '' : '(default)'}\n`),
    )
    process.stdout.write(`\t[${options.length}] exit\n\n`)
    selected = await prompt(`Option number: `)
  } while (
    ![...Array(options.length + 1).keys()]
      .map((n) => String(n))
      .includes(selected) &&
    selected !== ''
  )

  selected = parseInt(selected)

  if (selected === options.length) throw new Error('Exit by user')

  return isNaN(selected) ? 0 : selected
}

export default promptMenu
