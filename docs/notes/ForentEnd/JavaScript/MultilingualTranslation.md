# 多语言翻译方案

- 如果需要本地进行多语言翻译, 可以使用这个方法进行多语言初始化配置

## 测试用例

```js
import { intlUtil } from "./intl.util";

const commonLangConfig = {
  ok: {
    zh_CN: "确定",
    en_US: "ok"
  },
  cancel: {
    zh_CN: "取消",
    en_US: "cancel"
  }
};

describe("intl util", () => {
  test("代理多语言配置", () => {
    const commonLang = intlUtil.proxy(commonLangConfig);

    expect(commonLang.ok("zh_CN")).toBe("确定");
  });

  test("获取多语言配置项", () => {
    const commonLang = intlUtil.proxy(commonLangConfig);

    expect(commonLang.ok()).toEqual(commonLangConfig.ok);
  });

  test("继承配置", () => {
    const commonLang = intlUtil.proxy(commonLangConfig);

    const pageLevelLang = intlUtil.proxy({
      ok: commonLang.ok,
      specialContent: {
        zh_CN: "特殊内容",
        en_US: "special content"
      }
    });

    expect(pageLevelLang.ok("zh_CN")).toBe("确定");
  });

  test("配置嵌套", () => {
    const nestedLang = intlUtil.proxy({
      footer: {
        zh_CN: "底部",
        en_US: "footer"
        left: {
          zh_CN: "页底左",
          en_US: "footer left"
        }
      }
    });

    expect(function() {
      nestedLang.footer("zh_CN");
    }).toThrowError(new Error("无此多语言配置：footer"));

    expect(nestedLang.footer("en_US")).toBe("footer");

    expect(nestedLang.footer.left("zh_CN")).toBe("页底左");
  });

  test("支持变量", () => {
    const includeVarLang = intlUtil.proxy({
      welcome: {
        zh_CN: "你好 {name} 欢迎你来到{address}",
        en_US: "Hi, Welcome to {address}, {name}"
      },
      fake: {
        zh_CN: "你好 {{name}} 欢迎你来到{{address}}",
        en_US: "Hi, Welcome to {{address}}, {{name}}"
      }
    });

    expect(
      includeVarLang.welcome("zh_CN", {
        name: "小明",
        address: "中国"
      })
    ).toBe("你好 {name} 欢迎你来到{address}");

    expect(
      includeVarLang.fake("zh_CN", {
        name: "小明",
        address: "中国"
      })
    ).toBe("你好 小明 欢迎你来到中国");
  });
});
```

## 实现代码

> 使用了 es6 里的 Proxy 的特性去实现

### 功能点

- 支持多语言
- 支持继承
- 支持嵌套, 支持链式调用
- 支持模板字符串, 传入变量进行替换

```js
import _ from "lodash";

const handler = {
  set: function(obj, prop, value) {
    if (_.isFunction(obj[prop])) {
      Object.keys(value).forEach(valueKey => {
        obj[prop][valueKey] = value[valueKey];
      });
    } else {
      obj[prop] = value;
    }

    return true;
  },
  get: function(target, propKey) {
    if (_.isFunction(target[propKey])) {
      return target[propKey];
    }

    return target[propKey];
  }
};

const intlUtil = {
  /**
   * 代理多语言配置
   * @param {object} langs
   */
  proxy(langs) {
    if (!_.isPlainObject(langs)) {
      throw new Error("params of lang must be object");
    }

    const langProxy = new Proxy({}, handler);

    Object.keys(langs).forEach(langKey => {
      let langValue = langs[langKey];

      if (_.isFunction(langValue)) {
        langValue = langValue();
      }

      if (_.isPlainObject(langValue)) {
        // if (_.has(langValue, 'zh_CN') && _.has(langValue, 'en_US')) {
        // 判断如果有zh_CN, en_US 表示符合规范
        langProxy[langKey] = (language, params) => {
          if (language) {
            if (!_.isString(language)) {
              throw new Error("params of language must be string");
            }

            if (langValue[language]) {
              if (_.isPlainObject(params)) {
                return templateTranslate(langValue[language], params);
              }

              return langValue[language];
            } else {
              throw new Error("无此多语言配置：" + langKey);
            }
          }

          return langValue;
        };

        const copyLangValue = _.cloneDeep(langValue);

        delete copyLangValue.zh_CN;
        delete copyLangValue.en_US;

        if (Object.keys(copyLangValue).length > 0) {
          const childFuncObj = this.proxy(copyLangValue);

          langProxy[langKey] = childFuncObj;
        }
      } else {
        throw new Error(
          "The first parameter of proxy is not in the correct format, expect function or object"
        );
      }
    });

    return langProxy;
  }
};

/**
 * 模板转换
 * @param {string} template 带有 {param}格式的字符串 就是需要转换的模板
 * @param {object} params 替换模板的参数
 */
function templateTranslate(template, params) {
  const reg = /\{\{(.*?)\}\}/g;

  const paramsList = template.match(reg);

  if (paramsList) {
    // eslint-disable-next-line no-useless-escape
    const paramsKeyList = paramsList.map(v => v.replace(/[\{, \}]/g, ""));

    if (Array.isArray(paramsKeyList)) {
      paramsKeyList.forEach((paramsKey, paramsIndex) => {
        if (_.has(params, paramsKey)) {
          template = template.replace(
            paramsList[paramsIndex],
            params[paramsKey]
          );
        }
      });
    }
  }

  return template;
}

export { intlUtil };
```
