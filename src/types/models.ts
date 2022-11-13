export type ModelBase = {
  createdAt: Date
  updatedAt: Date
}
export type UserContent = ModelBase & {
  notion?: Array<string>
  twitter?: Array<string>
}
