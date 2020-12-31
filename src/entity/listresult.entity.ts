export class ListResult<T> {
  list: T[]
  meta: {
    count: number
    page: number
    pageSize: number
    totalPage: number
  }
}
