# 增加自己的语言包

如果你发现现有的翻译有问题, 已经进行了修订, 但是主干分支还没有更新, 你可以自己增加一个语言包, 以便在本地使用.

程序解析语言包时是基于管道(Pipe)理念设计的, 大概如下:

```typescript
const translatePips = [
  默认翻译,
  插值处理,
]
const characters = "Item Category";

const translate = translatePips.reduce((prev, next) => next(prev), characters);
```

我会暴露一些翻译上下文给用户的管道, 用户可以自己增加管道, 也可以修改现有的管道.
