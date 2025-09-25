const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide a password as an argument')
  console.log('process.argv length:', process.argv.length)
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://jeppuu:${password}@cluster0.cynfk19.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Person = mongoose.model('Person', personSchema)

// If arg contains node mongo.js mypassword name phone
if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    phone: process.argv[4],
  })

  person.save().then((result) => {
    console.log(`Added ${person.name} ☎️ ${person.phone} to phonebook!`)
    console.log('Result: ', result)
    mongoose.connection.close()
  })
}
// If arg contains only node mongo.js mypassword
if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('Phonebook:')
    result.forEach((person) => {
      console.log(`- ${person.name} ☎️ ${person.phone}`)
    })
    mongoose.connection.close()
  })
}
// If arg contains more than node mongo.js mypassword name phone
if (process.argv.length > 5) {
  console.log('Too many arguments provided.')
  process.exit(1)
}
