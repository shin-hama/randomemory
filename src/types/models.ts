export type ModelBase = {
  createdAt: Date
  updatedAt: Date
}
export type ProviderContent = ModelBase & {
  data: Array<string>
}
