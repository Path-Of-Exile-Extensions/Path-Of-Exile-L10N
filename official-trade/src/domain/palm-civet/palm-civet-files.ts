import {
  ChecksumsFile,
  CommonFile,
  FullFile,
  GemFlatFile,
  GemNamesFile,
  GemStatsFlatFile,
  ItemsFile,
  ItemsBothFile,
  MenuSearchFile,
  StaticFile,
  StatsFile,
  StatsIdFlatFile,
} from './files'
import {PalmCivet, PalmCivetModel} from "./palm-civet";

export namespace PalmCivetFiles {
  export const files = [
    new ChecksumsFile(),
    new CommonFile(),
    new FullFile(),
    new GemFlatFile(),
    new GemNamesFile(),
    new GemStatsFlatFile(),
    new ItemsFile(),
    new ItemsBothFile(),
    new MenuSearchFile(),
    new StaticFile(),
    new StatsFile(),
    new StatsIdFlatFile(),
  ]

  export const fileNames = files.map(file => file.fileName)
  export const findByName = (fileName: string) => files.find(file => file.fileName === fileName)
  export const toPalmModel = (entity: PalmCivet) => {
    return files.reduce((acc, file) => {
      acc[file.fileField] = file.parse(entity[file.fileField])
      return acc
    }, {} as PalmCivetModel)
  }
}
