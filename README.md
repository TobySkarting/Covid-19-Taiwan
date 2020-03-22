# Covid-19-Taiwan
COVID-19 Cases Data in Taiwan. 台灣武漢肺炎病例

資料來源：https://infogram.com/--1h8j4xgy7x1d6mv

## 注意事項
僅採用關鍵字過濾，不保證結果之正確性，如因資料錯誤導致任何損失，概不負責。

## 分析
還沒寫爬蟲自動抓取網頁資料，可從上方連結自行撈取，輸入資料為以下格式：
all = [["編號", "確診日", "年齡", "身分", "狀況", "備註"], ...];

由於早期的案例沒有附上彙整表格，僅能透過程式分析，未來新增案例直接爬表格就好。

## 欄位說明
- origin: 得病來源，本土感染=domestic、境外移入=imported
- location: 得病國家、旅遊國家
- breakout: 破口，境內可能為family/hospital/school/contact，其餘則為unknown，境外則有taishang/luke/study/work/travel/reside/visit，無特別指明則是go-abroad

## 其他
早期提供的確診案例縣市僅附加在description欄位，且來源資料僅保留北、中、南部等資訊。
部分案例性別未提供。

## TODO
整合維基百科上的代碼、補上早期縣市資料、由官方文件抓取國籍、旅遊國家、發病日期等資料、人工檢驗資料正確性。

## 免責聲明
本專案僅作為爬蟲練習、文字分析、學術研究之用，資料全取自網路，不保證來源與結果資料之正確性，如欲使用請自行負責。
