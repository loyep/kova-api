import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common"

@Injectable()
export class ParsePagePipe implements PipeTransform<string, number> {
  constructor() {
    //
  }

  transform(value: string, metadata: ArgumentMetadata): any {
    if (metadata.type !== "query") {
      return value
    }
    let page: number = parseInt(value, 10)
    if (isNaN(page)) {
      page = 1
    }
    return page
  }
}

@Injectable()
export class ParsePageSizePipe implements PipeTransform<string, number> {
  constructor() {
    //
  }

  transform(value: string, metadata: ArgumentMetadata): any {
    if (metadata.type !== "query") {
      return value
    }
    let pageSize: number = parseInt(value, 10)
    if (isNaN(pageSize)) {
      pageSize = 10
    }
    return pageSize
  }
}
