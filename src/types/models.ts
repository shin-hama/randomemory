export type ModelBase = {
  createdAt: Date
  updatedAt: Date
}
export type ProviderContent = ModelBase & {
  data: Array<string>
}

export type Content = {
  body: string
  timestamp: string
  properties: Array<string>
  url: string
}
