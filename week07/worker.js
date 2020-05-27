// 爬取`https://www.w3.org/TR/?tag=css`文章链接
const workDraftList = Array.prototype.slice
  .call(document.getElementById('container').children)
  .map((li) => {
    const a = li.querySelector('a');
    return {
      name: a.innerText,
      url: a.href,
    };
  });
JSON.stringify(workDraftList, null, 2);

// 收集 CSS 属性相关标准,然后通过iframe加载到页面
let iframe = document.createElement('iframe');
document.body.innerHTML = '';
document.body.appendChild(iframe);

function happen(element, event) {
  return new Promise(function (resolve) {
    let handler = () => {
      element.removeEventListener(event, handler);
      resolve();
    };
    element.addEventListener(event, handler);
  });
}

void (async function () {
  for (let standard of standards) {
    iframe.src = standard.url;
    console.log(standard.name);
    await happen(iframe, 'load');
  }
})();
