```js
// 保存单个值
localStorage.setItem("theme", "dark");

// 保存对象（需要转成 JSON 字符串）
const settings = { fontSize: 16, language: "zh" };
localStorage.setItem("settings", JSON.stringify(settings));

// 读取单个值
const theme = localStorage.getItem("theme");

// 读取对象（记得解析 JSON）
const settings = JSON.parse(localStorage.getItem("settings"));
console.log(settings.fontSize); // 16

window.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("theme");
    if (theme) {
        document.body.className = theme; // 应用主题
    }

    const settings = localStorage.getItem("settings");
    if (settings) {
        const parsed = JSON.parse(settings);
        document.body.style.fontSize = parsed.fontSize + "px";
    }
});

function changeTheme(newTheme) {
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
}

```

```js
alert("消息")：只显示提示信息。

confirm("是否继续？")：显示确认/取消按钮，返回布尔值。

prompt("请输入数值")：显示输入框，用户可以输入文本或数字，返回字符串。
```