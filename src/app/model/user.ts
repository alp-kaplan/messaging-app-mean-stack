export class User {
  username: {
    type: String,
    unique: true
  }
  password: {
    type: String
  }
  name: {
    type: String
  }
  surname: {
    type: String
  }
  birthdate: {
    type: Date
  }
  gender: {
    type: String
  }
  email: {
    type: String
  }
  location: {
    type: String
  }
  isAdmin: {
    type: Boolean
  }
}
