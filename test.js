const stringArr = "['left', 'right']";
const arr = stringArr.split(",");
const arg1 = arr[1]
  .replace(`'`, "")
  .replace(`]`, "")
  .replace(" ", "")
  .replace(`"`, "")
  .replace("`", "")
  .replace(`,`, "");

const cleanArr = [];
arr.forEach((elem, i) => {
  cleanArr.push(
    arr[i]
      .replace(/\'/g, "")
      .replace(/\[/g, "")
      .replace(/\]/g, "")
      .replace(/\ /g, "")
      .replace(/\"/g, "")
      .replace(/\`/g, "")
      .replace(/\,/g, "")
  );
});

console.log("test", cleanArr);
