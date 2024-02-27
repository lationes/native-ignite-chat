import {CommonItemModel} from "~/models/common.model";

export function formatItemsIntoSelectValues(items: CommonItemModel[]) {
  return items.map((item) => {
    return {
      id: item.id,
      label: `${item.title} ${item.id}` || '',
      value: item.id,
    }
  })
}
