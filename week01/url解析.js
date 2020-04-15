/**
 * url 解析
 * @param search window.location.search
 * @returns Object
 */
function urlSearch(search) {
  let result = {};

  const queryString = decodeURIComponent(search.slice(1))
  const queryStringList = queryString.split(/=|&/);
  const length = queryStringList.length;
  for (let i = 0; i < length - 1; i += 2) {
      const key = queryStringList[i];
      const value = queryStringList[i + 1];
      result[key] = value;
  }

  return result;
}
