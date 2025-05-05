export interface ResponseUseCase<T> {
  success: boolean
  message: string
  data: T[]
}
