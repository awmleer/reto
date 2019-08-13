## Reto是hooks版本的redux么？

不是，Reto是redux和redux-saga的替代品。它在工程项目中做的事情和redux一样（构建应用的模型层），但是它所采用的方案却更为灵活高效。

## 我可以在生产环境中使用Reto么？

是的，笔者所在的一个阿里巴巴的项目组目前就在使用Reto。

## Reto会明显增大应用的打包体积么？

不会的，Reto非常的简单轻量。

## 我可以在TypeScript的项目中使用Reto么？

当然可以，Reto本身就是用TypeScript写的。

## 我可以在React 16.7及以下的环境中使用Reto么？

不可以。。Reto基于React 16.8新发布的"hooks"特性，所以如果你想使用Reto，你需要先将React升级到16.8或者更高。

## 我不写函数组件，那我还可以使用Reto么？

可以，Reto和类组件是兼容的。你可以只在store中使用hooks。
